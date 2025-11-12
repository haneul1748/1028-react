#!/usr/bin/env python3
"""
PZEM-004T 전력계 모니터링 시스템
C 코드의 모든 기능을 Python으로 완전 이식
"""

from flask import Flask, render_template_string, jsonify
from flask_socketio import SocketIO
import serial
import struct
import threading
import time
import random
from collections import deque

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pzem-monitor-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# 전역 변수
MAX_POINTS = 100
data_history = {
    'voltage': deque(maxlen=MAX_POINTS),
    'current': deque(maxlen=MAX_POINTS),
    'power': deque(maxlen=MAX_POINTS),
    'energy': deque(maxlen=MAX_POINTS),
    'frequency': deque(maxlen=MAX_POINTS),
    'power_factor': deque(maxlen=MAX_POINTS),
    'timestamp': deque(maxlen=MAX_POINTS),
    'alarm': 'Normal'
}

current_values = {
    'voltage': 0.0,
    'current': 0.0,
    'power': 0.0,
    'energy': 0.0,
    'frequency': 0.0,
    'power_factor': 0.0,
    'alarm': 'Normal'
}

monitoring = False
serial_port = None

def calculate_crc16(data):
    """CRC16 계산 함수 (Modbus RTU)"""
    crc = 0xFFFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 1:
                crc = (crc >> 1) ^ 0xA001
            else:
                crc = crc >> 1
    return crc

def init_serial(port='/dev/serial0', baudrate=9600):
    """시리얼 포트 초기화"""
    global serial_port
    try:
        serial_port = serial.Serial(
            port=port,
            baudrate=baudrate,
            bytesize=serial.EIGHTBITS,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            timeout=1.0
        )
        print(f"시리얼 포트 {port} 초기화 완료 (9600 bps)")
        return True
    except Exception as e:
        print(f"시리얼 포트 초기화 실패: {e}")
        return False

def send_modbus_request():
    """Modbus RTU 요청 전송"""
    if not serial_port:
        return None
    
    # PZEM-004T 요청 패킷: 주소 0x01, 기능 0x04 (입력 레지스터 읽기)
    # 시작주소 0x0000, 레지스터 개수 0x000A (10개)
    request = bytearray([0x01, 0x04, 0x00, 0x00, 0x00, 0x0A])
    
    # CRC16 추가
    crc = calculate_crc16(request)
    request.append(crc & 0xFF)  # CRC Low
    request.append((crc >> 8) & 0xFF)  # CRC High
    
    try:
        serial_port.write(request)
        return True
    except Exception as e:
        print(f"요청 전송 실패: {e}")
        return False

def read_modbus_response():
    """Modbus RTU 응답 읽기"""
    if not serial_port:
        return None
    
    try:
        # 응답 읽기 (헤더 3바이트 + 데이터 20바이트 + CRC 2바이트 = 25바이트)
        response = serial_port.read(25)
        
        if len(response) < 5:
            return None
            
        # CRC 검증
        received_crc = (response[-1] << 8) | response[-2]
        calculated_crc = calculate_crc16(response[:-2])
        
        if received_crc != calculated_crc:
            print("CRC 오류")
            return None
            
        # 데이터 파싱
        if response[0] == 0x01 and response[1] == 0x04:
            data_bytes = response[3:23]  # 20바이트 데이터
            
            # 10개의 16비트 레지스터 값 추출
            registers = []
            for i in range(0, 20, 2):
                value = (data_bytes[i] << 8) | data_bytes[i + 1]
                registers.append(value)
            
            return registers
            
    except Exception as e:
        print(f"응답 읽기 실패: {e}")
        return None

def generate_random_data():
    """랜덤 데이터 생성 (센서 응답이 없을 때)"""
    voltage = random.uniform(3.0, 5.0)  # 3 ~ 5 V
    current = random.uniform(0.1, 0.5)  # 0.1 ~ 0.5 A
    power = voltage * current  # 전력 = 전압 × 전류
    energy = random.uniform(100.0, 500.0)  # 100 ~ 500 Wh
    frequency = random.uniform(59.5, 60.5)  # 59.5 ~ 60.5 Hz
    power_factor = random.uniform(0.90, 1.00)  # 역률 0.90 ~ 1.00
    
    return {
        'voltage': round(voltage, 1),
        'current': round(current, 3),
        'power': round(power, 1),
        'energy': round(energy, 1),
        'frequency': round(frequency, 1),
        'power_factor': round(power_factor, 2),
        'alarm': 'Normal'
    }

def parse_pzem_data(registers):
    """PZEM 레지스터 데이터 파싱"""
    # 레지스터 맵핑
    # Reg 0: Voltage (0.1V)
    # Reg 1-2: Current (0.001A) - 32bit
    # Reg 3-4: Power (0.1W) - 32bit
    # Reg 5-6: Energy (1Wh) - 32bit
    # Reg 7: Frequency (0.1Hz)
    # Reg 8: Power Factor (0.01)
    # Reg 9: Alarm (0xFFFF = Over Power)
    
    voltage = registers[0] / 10.0
    current = ((registers[1] << 16) | registers[2]) / 1000.0
    power = ((registers[3] << 16) | registers[4]) / 10.0
    energy = ((registers[5] << 16) | registers[6]) * 1.0
    frequency = registers[7] / 10.0
    power_factor = registers[8] / 100.0
    alarm = "Over Power" if registers[9] == 0xFFFF else "Normal"
    
    return {
        'voltage': round(voltage, 1),
        'current': round(current, 3),
        'power': round(power, 1),
        'energy': round(energy, 0),
        'frequency': round(frequency, 1),
        'power_factor': round(power_factor, 2),
        'alarm': alarm
    }

def monitor_pzem():
    """PZEM 모니터링 스레드"""
    global monitoring, current_values
    
    print("PZEM 모니터링 시작")
    
    while monitoring:
        try:
            # Modbus 요청 전송
            if send_modbus_request():
                # 응답 대기 및 읽기
                time.sleep(0.1)  # 짧은 대기
                registers = read_modbus_response()
                
                if registers:
                    # 실제 센서 데이터 파싱
                    data = parse_pzem_data(registers)
                    print(f"실제 데이터: V={data['voltage']}V, I={data['current']}A, P={data['power']}W")
                else:
                    # 응답 없음 - 랜덤 데이터 생성
                    data = generate_random_data()
                    print(f"랜덤 데이터: V={data['voltage']}V, I={data['current']}A, P={data['power']}W")
            else:
                # 전송 실패 - 랜덤 데이터 생성
                data = generate_random_data()
                print(f"랜덤 데이터: V={data['voltage']}V, I={data['current']}A, P={data['power']}W")
            
            # 타임스탬프 추가
            timestamp = time.time()
            
            # 데이터 업데이트
            for key in ['voltage', 'current', 'power', 'energy', 'frequency', 'power_factor']:
                if key in data:
                    data_history[key].append(data[key])
                    current_values[key] = data[key]
            
            data_history['timestamp'].append(timestamp)
            current_values['alarm'] = data['alarm']
            
            # WebSocket으로 클라이언트에 전송
            socketio.emit('power_update', {
                'current': current_values,
                'timestamp': timestamp
            })
            
            # 콘솔 출력 (디버깅용)
            print(f"Voltage: {data['voltage']} V")
            print(f"Current: {data['current']} A")
            print(f"Power: {data['power']} W")
            print(f"Energy: {data['energy']} Wh")
            print(f"Frequency: {data['frequency']} Hz")
            print(f"Power Factor: {data['power_factor']}")
            print(f"Alarm: {data['alarm']}")
            print()
            
        except Exception as e:
            print(f"모니터링 오류: {e}")
        
        # 1초 대기
        time.sleep(1)
    
    print("PZEM 모니터링 종료")

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/current')
def get_current():
    return jsonify(current_values)

@app.route('/api/history')
def get_history():
    return jsonify({
        'voltage': list(data_history['voltage']),
        'current': list(data_history['current']),
        'power': list(data_history['power']),
        'energy': list(data_history['energy']),
        'frequency': list(data_history['frequency']),
        'power_factor': list(data_history['power_factor']),
        'timestamp': list(data_history['timestamp'])
    })

@socketio.on('connect')
def handle_connect():
    print('클라이언트 연결됨')
    # 연결 시 현재 데이터 즉시 전송
    socketio.emit('power_update', {
        'current': current_values,
        'timestamp': time.time()
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('클라이언트 연결 해제됨')

# HTML 템플릿
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PZEM-004T 전력 모니터링</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 20px;
            text-align: center;
        }
        
        .header h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .status {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background: #f0f0f0;
            border-radius: 20px;
        }
        
        .status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4CAF50;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-title {
            font-size: 14px;
            color: #888;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .card-value {
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }
        
        .card-unit {
            font-size: 18px;
            color: #888;
            font-weight: normal;
        }
        
        .card-voltage .card-value { color: #FF6B6B; }
        .card-current .card-value { color: #4ECDC4; }
        .card-power .card-value { color: #FFE66D; }
        .card-energy .card-value { color: #95E1D3; }
        .card-frequency .card-value { color: #A8E6CF; }
        .card-pf .card-value { color: #C7CEEA; }
        
        .alarm-card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .alarm-status {
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 10px;
        }
        
        .alarm-normal {
            background: #4CAF50;
            color: white;
        }
        
        .alarm-warning {
            background: #f44336;
            color: white;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .chart-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
        
        .chart-info {
            font-size: 12px;
            color: #888;
        }
        
        canvas {
            max-width: 100%;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            padding: 20px;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            .card-value {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ PZEM-004T 실시간 전력 모니터</h1>
            <div class="status">
                <div class="status-dot"></div>
                <span>실시간 모니터링 중</span>
            </div>
        </div>
        
        <div class="alarm-card">
            <div class="alarm-status alarm-normal" id="alarmStatus">상태: Normal</div>
        </div>
        
        <div class="grid">
            <div class="card card-voltage">
                <div class="card-title">전압 (Voltage)</div>
                <div class="card-value" id="voltage">0.0<span class="card-unit">V</span></div>
            </div>
            <div class="card card-current">
                <div class="card-title">전류 (Current)</div>
                <div class="card-value" id="current">0.000<span class="card-unit">A</span></div>
            </div>
            <div class="card card-power">
                <div class="card-title">전력 (Power)</div>
                <div class="card-value" id="power">0.0<span class="card-unit">W</span></div>
            </div>
            <div class="card card-energy">
                <div class="card-title">누적 에너지 (Energy)</div>
                <div class="card-value" id="energy">0.0<span class="card-unit">Wh</span></div>
            </div>
            <div class="card card-frequency">
                <div class="card-title">주파수 (Frequency)</div>
                <div class="card-value" id="frequency">0.0<span class="card-unit">Hz</span></div>
            </div>
            <div class="card card-pf">
                <div class="card-title">역률 (Power Factor)</div>
                <div class="card-value" id="powerFactor">0.00</div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <div class="chart-title">전압 추이</div>
                <div class="chart-info">최근 50개 데이터</div>
            </div>
            <canvas id="voltageChart"></canvas>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <div class="chart-title">전류 추이</div>
                <div class="chart-info">최근 50개 데이터</div>
            </div>
            <canvas id="currentChart"></canvas>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <div class="chart-title">전력 추이</div>
                <div class="chart-info">최근 50개 데이터</div>
            </div>
            <canvas id="powerChart"></canvas>
        </div>
        
        <div class="footer">
            <p>PZEM-004T Modbus RTU Monitor v1.0</p>
            <p>© 2024 Power Monitoring System</p>
        </div>
    </div>
    
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const socket = io();
        
        // 차트 초기화
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 0
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: { 
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                }
            }
        };
        
        const voltageChart = createChart('voltageChart', '전압 (V)', 'rgba(255, 107, 107, 1)');
        const currentChart = createChart('currentChart', '전류 (A)', 'rgba(78, 205, 196, 1)');
        const powerChart = createChart('powerChart', '전력 (W)', 'rgba(255, 230, 109, 1)');
        
        function createChart(canvasId, label, color) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: label,
                        data: [],
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.1)'),
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }]
                },
                options: chartOptions
            });
        }
        
        let dataCount = 0;
        
        // 초기 히스토리 로드
        fetch('/api/history')
            .then(response => response.json())
            .then(data => {
                // 기존 데이터로 차트 초기화
                const timestamps = data.timestamp.map(t => 
                    new Date(t * 1000).toLocaleTimeString()
                );
                
                voltageChart.data.labels = [...timestamps];
                voltageChart.data.datasets[0].data = [...data.voltage];
                voltageChart.update();
                
                currentChart.data.labels = [...timestamps];
                currentChart.data.datasets[0].data = [...data.current];
                currentChart.update();
                
                powerChart.data.labels = [...timestamps];
                powerChart.data.datasets[0].data = [...data.power];
                powerChart.update();
            });
        
        socket.on('power_update', (data) => {
            const values = data.current;
            const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();
            
            // 값 업데이트 (애니메이션 효과 추가)
            animateValue('voltage', values.voltage, 1);
            animateValue('current', values.current, 3);
            animateValue('power', values.power, 1);
            animateValue('energy', values.energy, 1);
            animateValue('frequency', values.frequency, 1);
            animateValueNoUnit('powerFactor', values.power_factor, 2);
            
            // 알람 상태 업데이트
            const alarmStatus = document.getElementById('alarmStatus');
            alarmStatus.textContent = `상태: ${values.alarm}`;
            if (values.alarm === 'Normal') {
                alarmStatus.className = 'alarm-status alarm-normal';
            } else {
                alarmStatus.className = 'alarm-status alarm-warning';
            }
            
            // 차트 업데이트
            dataCount++;
            updateChart(voltageChart, timestamp, values.voltage);
            updateChart(currentChart, timestamp, values.current);
            updateChart(powerChart, timestamp, values.power);
        });
        
        function animateValue(id, value, decimals) {
            const element = document.getElementById(id);
            const unit = element.querySelector('.card-unit').textContent;
            element.innerHTML = `${value.toFixed(decimals)}<span class="card-unit">${unit}</span>`;
        }
        
        function animateValueNoUnit(id, value, decimals) {
            document.getElementById(id).innerHTML = value.toFixed(decimals);
        }
        
        function updateChart(chart, label, value) {
            chart.data.labels.push(label);
            chart.data.datasets[0].data.push(value);
            
            // 최대 50개 데이터만 유지
            if (chart.data.labels.length > 50) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }
            
            chart.update('none');
        }
        
        // 연결 상태 확인
        socket.on('connect', () => {
            console.log('서버 연결됨');
            document.querySelector('.status-dot').style.background = '#4CAF50';
        });
        
        socket.on('disconnect', () => {
            console.log('서버 연결 끊김');
            document.querySelector('.status-dot').style.background = '#f44336';
        });
    </script>
</body>
</html>
'''

if __name__ == '__main__':
    print("=" * 60)
    print("🔌 PZEM-004T 웹 모니터링 시스템")
    print("=" * 60)
    print("Python 통합 버전 - C 코드 기능 완전 이식")
    print("=" * 60)
    
    # 시리얼 포트 초기화
    serial_initialized = init_serial('/dev/serial0', 9600)
    
    if not serial_initialized:
        print("\n⚠️  경고: 시리얼 포트 초기화 실패")
        print("랜덤 데이터 모드로 실행합니다.")
    else:
        print("✅ 시리얼 통신 준비 완료")
    
    # 모니터링 시작
    monitoring = True
    monitor_thread = threading.Thread(target=monitor_pzem, daemon=True)
    monitor_thread.start()
    
    print("\n웹 서버 시작...")
    print("접속 주소: http://localhost:5000")
    print("라즈베리파이 IP: http://[라즈베리파이_IP]:5000")
    print("\nCtrl+C로 종료")
    print("=" * 60)
    
    try:
        # Flask 서버 실행
        socketio.run(app, host='0.0.0.0', port=5000, debug=False, allow_unsafe_werkzeug=True)
    except KeyboardInterrupt:
        print("\n\n⏹️  서버 종료 중...")
        monitoring = False
        if serial_port:
            serial_port.close()
        print("종료 완료")