#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import subprocess
import re
import tkinter as tk
import numpy as np
import time
from collections import deque
# Initialize data queues (maximum 100 data points)
MAX_POINTS = 100
voltage_data = deque(maxlen=MAX_POINTS)
current_data = deque(maxlen=MAX_POINTS)
power_data = deque(maxlen=MAX_POINTS)
energy_data = deque(maxlen=MAX_POINTS)
frequency_data = deque(maxlen=MAX_POINTS)
pf_data = deque(maxlen=MAX_POINTS)
time_data = deque(maxlen=MAX_POINTS)
# Fill with initial values of 0
for i in range(MAX_POINTS):
    voltage_data.append(0)
    current_data.append(0)
    power_data.append(0)
    energy_data.append(0)
    frequency_data.append(0)
    pf_data.append(0)
    time_data.append(i)
# Function to parse C program output
def parse_output(output):
    data = {}
    patterns = {
        'voltage': r'Voltage: ([0-9.]+) V',
        'current': r'Current: ([0-9.]+) A',
        'power': r'Power: ([0-9.]+) W',
        'energy': r'Energy: ([0-9.]+) Wh',
        'frequency': r'Frequency: ([0-9.]+) Hz',
        'power_factor': r'Power Factor: ([0-9.]+)',
        'alarm': r'Alarm: (\w+)'
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, output)
        if match:
            if key != 'alarm':
                data[key] = float(match.group(1))
            else:
                data[key] = match.group(1)
    return data
# tkinter UI setup
root = tk.Tk()
root.title("Power Monitoring System")
root.geometry("1200x800")
# Figure frame setup
fig = plt.figure(figsize=(12, 8), dpi=100)
fig.subplots_adjust(hspace=0.5)
# Create 6 subplots
ax1 = fig.add_subplot(3, 2, 1)
ax2 = fig.add_subplot(3, 2, 2)
ax3 = fig.add_subplot(3, 2, 3)
ax4 = fig.add_subplot(3, 2, 4)
ax5 = fig.add_subplot(3, 2, 5)
ax6 = fig.add_subplot(3, 2, 6)
# Create canvas and add to widget
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)
# Labels for current values
info_frame = tk.Frame(root)
info_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=10)
voltage_label = tk.Label(info_frame, text="Voltage: 0.0 V", font=("Arial", 12))
voltage_label.grid(row=0, column=0, padx=20)
current_label = tk.Label(info_frame, text="Current: 0.0 A", font=("Arial", 12))
current_label.grid(row=0, column=1, padx=20)
power_label = tk.Label(info_frame, text="Power: 0.0 W", font=("Arial", 12))
power_label.grid(row=0, column=2, padx=20)
energy_label = tk.Label(info_frame, text="Energy: 0.0 Wh", font=("Arial", 12))
energy_label.grid(row=1, column=0, padx=20)
frequency_label = tk.Label(info_frame, text="Frequency: 0.0 Hz", font=("Arial", 12))
frequency_label.grid(row=1, column=1, padx=20)
pf_label = tk.Label(info_frame, text="Power Factor: 0.0", font=("Arial", 12))
pf_label.grid(row=1, column=2, padx=20)
alarm_label = tk.Label(info_frame, text="Alarm: Normal", font=("Arial", 12), fg="green")
alarm_label.grid(row=2, column=1, padx=20, pady=10)
# Run C program
def run_c_program():
    # Specify the compiled C program path here
    c_program_path = "./pzem"
    try:
        # Start process
        process = subprocess.Popen(
            c_program_path,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            bufsize=1
        )
        return process
    except Exception as e:
        print(f"C program execution error: {e}")
        return None
# Animation update function
def update_plot(frame):
    # Read output from process
    line = process.stdout.readline().strip()
    if not line and process.poll() is not None:
        print("C program has terminated.")
        ani.event_source.stop()
        return
    # Collect value group (read until empty line)
    output_block = ""
    while line:
        output_block += line + "\n"
        line = process.stdout.readline().strip()
    # Process only if there are values
    if not output_block:
        return
    # Parse output
    data = parse_output(output_block)
    if not data:
        return
    # Update data
    current_time = time.time()
    time_data.append(current_time)
    if 'voltage' in data:
        voltage_data.append(data['voltage'])
        voltage_label.config(text=f"Voltage: {data['voltage']:.1f} V")
    if 'current' in data:
        current_data.append(data['current'])
        current_label.config(text=f"Current: {data['current']:.3f} A")
    if 'power' in data:
        power_data.append(data['power'])
        power_label.config(text=f"Power: {data['power']:.1f} W")
    if 'energy' in data:
        energy_data.append(data['energy'])
        energy_label.config(text=f"Energy: {data['energy']:.1f} Wh")
    if 'frequency' in data:
        frequency_data.append(data['frequency'])
        frequency_label.config(text=f"Frequency: {data['frequency']:.1f} Hz")
    if 'power_factor' in data:
        pf_data.append(data['power_factor'])
        pf_label.config(text=f"Power Factor: {data['power_factor']:.2f}")
    if 'alarm' in data:
        if data['alarm'] == "Normal":
            alarm_label.config(text=f"Alarm: {data['alarm']}", fg="green")
        else:
            alarm_label.config(text=f"Alarm: {data['alarm']}", fg="red")
    # Update time labels (x-axis)
    time_array = np.array(time_data)
    time_array = time_array - time_array[0]  # Set start time to 0
    # Update graphs
    ax1.clear()
    ax1.plot(time_array, voltage_data, 'b-')
    ax1.set_title('Voltage (V)')
    ax1.set_ylabel('Volts (V)')
    ax1.grid(True)
    ax2.clear()
    ax2.plot(time_array, current_data, 'r-')
    ax2.set_title('Current (A)')
    ax2.set_ylabel('Amperes (A)')
    ax2.grid(True)
    ax3.clear()
    ax3.plot(time_array, power_data, 'g-')
    ax3.set_title('Power (W)')
    ax3.set_ylabel('Watts (W)')
    ax3.grid(True)
    ax4.clear()
    ax4.plot(time_array, energy_data, 'm-')
    ax4.set_title('Energy (Wh)')
    ax4.set_ylabel('Watt-hours (Wh)')
    ax4.grid(True)
    ax5.clear()
    ax5.plot(time_array, frequency_data, 'c-')
    ax5.set_title('Frequency (Hz)')
    ax5.set_ylabel('Hertz (Hz)')
    ax5.set_xlabel('Time (seconds)')
    ax5.grid(True)
    ax6.clear()
    ax6.plot(time_array, pf_data, 'y-')
    ax6.set_title('Power Factor')
    ax6.set_ylabel('Power Factor (0-1)')
    ax6.set_xlabel('Time (seconds)')
    ax6.grid(True)
# Main function
if __name__ == "__main__":
    # Run C program
    process = run_c_program()
    if process:
        # Start animation
        ani = animation.FuncAnimation(fig, update_plot, interval=1000)
        # Protocol for cleanup when closing
        def on_closing():
            if process:
                process.terminate()
            root.destroy()
        root.protocol("WM_DELETE_WINDOW", on_closing)
        # Run tkinter main loop
        tk.mainloop()
    else:
        print("Cannot run C program.")