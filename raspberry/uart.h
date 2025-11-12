
#ifndef UART_H
#define UART_H

#include <stdint.h>
#include <stddef.h>

int init_uart(const char *device);
int uart_send(int fd, const uint8_t *buf, size_t len);
int uart_receive(int fd, uint8_t *buf, size_t len, int timeout_sec);

#endif
