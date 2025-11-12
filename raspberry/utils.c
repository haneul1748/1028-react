#include "utils.h"

double rand_range(double min, double max) {
    return min + (max - min) * rand() / RAND_MAX;
}

void parse_pzem_response(const uint8_t *response, double *voltage, double *current,
                         double *power, double *energy, double *frequency,
                         double *pf, char *alarmStatus) {
    uint16_t regs[10];
    const uint8_t *data = response + 3;
    for(int i=0; i<10; i++)
        regs[i] = (data[2*i] << 8) | data[2*i+1];

    *voltage   = regs[0] / 10.0;
    *current   = (((uint32_t)regs[2]<<16)|regs[1])/1000.0;
    *power     = (((uint32_t)regs[4]<<16)|regs[3])/10.0;
    *energy    = (((uint32_t)regs[6]<<16)|regs[5]);
    *frequency = regs[7]/10.0;
    *pf        = regs[8]/100.0;
    *alarmStatus = (regs[9]==0xFFFF)?'1':'0';
}