#include "uart.h"
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <sys/select.h>

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
    options.c_cflag &= ~PARENB;
    options.c_cflag &= ~CSTOPB;
    options.c_cflag &= ~CSIZE;
    options.c_cflag |= CS8 | CLOCAL | CREAD;
    options.c_lflag &= ~(ICANON | ECHO | ISIG);
    options.c_iflag &= ~(IXON | IXOFF | IXANY | ICRNL | INLCR);
    options.c_oflag &= ~OPOST;
    tcsetattr(fd, TCSANOW, &options);

    return fd;
}

int uart_send(int fd, const uint8_t *buf, size_t len) {
    return write(fd, buf, len);
}

int uart_receive(int fd, uint8_t *buf, size_t len, int timeout_sec) {
    fd_set readfds;
    struct timeval timeout = {timeout_sec, 0};
    FD_ZERO(&readfds);
    FD_SET(fd, &readfds);

    int rv = select(fd + 1, &readfds, NULL, NULL, &timeout);
    if (rv > 0) {
        return read(fd, buf, len);
    }
    return -1; // timeout or error
}