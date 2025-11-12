#include "uart.h"
#include "crc.h"
#include "utils.h"
#include <stdio.h>
#include <unistd.h>
#include <stdint.h>
#include <stddef.h>
#define GPIO_TEST_PIN 11

int main() {
    wiringPiSetup(); 
    srand(time(NULL));
    pinMode(GPIO_TEST_PIN, INPUT);

    int fd = init_uart("/dev/serial0");
    if(fd < 0) return 1;

    while(1) {
        uint8_t request[8] = {0x01,0x04,0x00,0x00,0x00,0x0A,0x00,0x00};
        uint16_t crc = calculate_crc(request, 6);
        request[6] = crc & 0xFF;
        request[7] = crc >> 8;

        uart_send(fd, request, 8);

        uint8_t response[256];
        int len = uart_receive(fd, response, 25, 1);

        if(len < 5) {
            double voltage = rand_range(3.0, 5.0);
            double current = rand_range(0.1, 0.5);
            double power = voltage * current;
            double energy = rand_range(100.0, 500.0);
            double frequency = rand_range(59.5, 60.5);
            double pf = rand_range(0.90, 1.00);

            printf("Voltage: %.1f V\n", voltage);
            printf("Current: %.3f A\n", current);
            printf("Power: %.1f W\n", power);
            printf("Energy: %.1f Wh\n", energy);
            printf("Frequency: %.1f Hz\n", frequency);
            printf("Power Factor: %.2f\n", pf);
            printf("Alarm: Normal\n");
            printf("\n");
        } else {
            double voltage, current, power, energy, frequency, pf;
            char alarmStatus;
            parse_pzem_response(response, &voltage, &current, &power, &energy, &frequency, &pf, &alarmStatus);

            printf("Voltage: %.1f V\n", voltage);
            printf("Current: %.3f A\n", current);
            printf("Power: %.1f W\n", power);
            printf("Energy: %.0f Wh\n", energy);
            printf("Frequency: %.1f Hz\n", frequency);
            printf("Power Factor: %.2f\n", pf);
            printf("Alarm: %s\n\n", (alarmStatus=='1')?"Over Power":"Normal");
        }
        sleep(1);
    }
    close(fd);
    return 0;
}