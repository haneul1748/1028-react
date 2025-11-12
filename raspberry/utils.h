#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <wiringPi.h>
#include <time.h>

double rand_range(double min, double max);
void parse_pzem_response(const uint8_t *response, double *voltage, double *current,
                         double *power, double *energy, double *frequency,
                         double *pf, char *alarmStatus);

#endif