#ifndef CRC_H
#define CRC_H

#include <stdint.h>
uint16_t calculate_crc(const uint8_t *buf, int len);

#endif