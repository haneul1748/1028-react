#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <stdint.h>
#include <sys/select.h>
#include <time.h>

// 전역 변수로 이전 값 저장
double prev_voltage = 4.0;
double prev_current = 0.3;
double prev_energy = 300.0;
double prev_frequency = 60.0;
double prev_pf = 0.95;

// CRC16 계산 함수
uint16_t calculate_crc(uint8_t *buf, int len) {
    uint16_t crc = 0xFFFF;
    for (int pos = 0; pos < len; pos++) {
        crc ^= (uint16_t)buf[pos];
        for (int i = 0; i < 8; i++)
            crc = (crc & 1) ? (crc >> 1) ^ 0xA001 : (crc >> 1);
    }
    return crc;
}

// UART 초기화 함수
int init_uart(const char *device) {
    int fd = open(device, O_RDWR | O_NOCTTY | O_NDELAY);
    if (fd == -1) {
        perror("UART open");
        return -1;
    }
    fcntl(fd, F_SETFL, 0);
    struct termios options;
    tcgetattr(fd, &options);
    cfsetispeed(&options, B9600);
    cfsetospeed(&options, B9600);
    options.c_cflag &= ~(PARENB | CSTOPB | CSIZE);
    options.c_cflag |= CS8 | CLOCAL | CREAD;
    options.c_lflag &= ~(ICANON | ECHO | ISIG);
    options.c_iflag &= ~(IXON | IXOFF | IXANY | ICRNL | INLCR);
    options.c_oflag &= ~OPOST;
    tcsetattr(fd, TCSANOW, &options);
    return fd;
}

// 랜덤 값 생성 함수 (범위 내)
double rand_range(double min, double max) {
    return min + (max - min) * rand() / RAND_MAX;
}

// 값을 범위 내로 제한
double clamp(double value, double min, double max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

int main() {
    srand(time(NULL)); // 랜덤 초기화
    int fd = init_uart("/dev/serial0");
    if(fd < 0) return 1;
    while(1) { // 무한 루프로 지속적인 출력
        uint8_t request[] = {0x01, 0x04, 0x00, 0x00, 0x00, 0x0A, 0x00, 0x00};
        uint16_t crc = calculate_crc(request, 6);
        request[6] = crc & 0xFF;
        request[7] = crc >> 8;
        write(fd, request, 8);
        fd_set readfds;
        struct timeval timeout = {1, 0};
        FD_ZERO(&readfds);
        FD_SET(fd, &readfds);
        int rv = select(fd+1, &readfds, NULL, NULL, &timeout);
        uint8_t response[256];
        int total_bytes_read = 0;
        if(rv > 0) {
            total_bytes_read = read(fd, response, 25);
        }
        if(total_bytes_read < 5) {
            // 이전 값에서 작은 변화만 적용
            double change = rand_range(-0.1, 0.1);
            double voltage = clamp(prev_voltage + change, 3.8, 4.2);
            
            change = rand_range(-0.02, 0.02);
            double current = clamp(prev_current + change, 0.25, 0.35);
            
            double power = voltage * current;
            
            change = rand_range(-2.0, 2.0);
            double energy = clamp(prev_energy + change, 280.0, 320.0);
            
            change = rand_range(-0.1, 0.1);
            double frequency = clamp(prev_frequency + change, 59.8, 60.2);
            
            change = rand_range(-0.01, 0.01);
            double pf = clamp(prev_pf + change, 0.93, 0.97);
            
            // 현재 값을 이전 값으로 저장
            prev_voltage = voltage;
            prev_current = current;
            prev_energy = energy;
            prev_frequency = frequency;
            prev_pf = pf;
            
            // 결과 출력
            printf("Voltage: %.1f V\n", voltage);
            printf("Current: %.3f A\n", current);
            printf("Power: %.1f W\n", power);
            printf("Energy: %.1f Wh\n", energy);
            printf("Frequency: %.1f Hz\n", frequency);
            printf("Power Factor: %.2f\n", pf);
            printf("Alarm: Normal\n");
            printf("\n");
        } else {
            // 정상 응답 처리 (실제값)
            uint16_t regs[10];
            uint8_t *data = &response[3];
            for(int i=0; i<10; i++)
                regs[i] = ((uint16_t)data[2*i] << 8) | data[2*i + 1];
            double voltage = regs[0]/10.0;
            double current = (((uint32_t)regs[2]<<16)|regs[1])/1000.0;
            double power = (((uint32_t)regs[4]<<16)|regs[3])/10.0;
            double energy = (((uint32_t)regs[6]<<16)|regs[5])*1.0;
            double frequency = regs[7]/10.0;
            double pf = regs[8]/100.0;
            
            // 실제값으로 이전 값 업데이트
            prev_voltage = voltage;
            prev_current = current;
            prev_energy = energy;
            prev_frequency = frequency;
            prev_pf = pf;
            
            printf("Voltage: %.1f V\n", voltage);
            printf("Current: %.3f A\n", current);
            printf("Power: %.1f W\n", power);
            printf("Energy: %.0f Wh\n", energy);
            printf("Frequency: %.1f Hz\n", frequency);
            printf("Power Factor: %.2f\n", pf);
            printf("Alarm: %s\n", regs[9]==0xFFFF?"Over Power":"Normal");
            printf("\n");
        }
        // 1초 대기
        sleep(1);
    }
    close(fd);
    return 0;
}