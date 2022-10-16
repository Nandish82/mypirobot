import RPi.GPIO as GPIO
from smbus2 import SMBus, i2c_msg
import time
import math



__ADC_BAT_ADDR = 0
__SERVO_ADDR   = 21
__MOTOR_ADDR   = 31
__SERVO_ADDR_CMD  = 40

__servo_angle = [0, 0, 0, 0, 0, 0]
__servo_pulse = [0, 0, 0, 0, 0, 0]
__i2c = 1
__i2c_addr = 0x7A

def setPWMServoPulse(servo_id, pulse = 1500, use_time = 1000):
    if servo_id< 1 or servo_id > 6:
        raise AttributeError("Invalid Servo ID: %d" %servo_id)
    deviation_data = 0
    index = servo_id - 1
    pulse += deviation_data
    pulse = 500 if pulse < 500 else pulse
    pulse = 2500 if pulse > 2500 else pulse
    use_time = 0 if use_time < 0 else use_time
    use_time = 30000 if use_time > 30000 else use_time
    buf = [__SERVO_ADDR_CMD, 1] + list(use_time.to_bytes(2, 'little')) + [servo_id,] + list(pulse.to_bytes(2, 'little'))
    print ("the buffer sent is:",buf)
    with SMBus(__i2c) as bus:
        try:
            msg = i2c_msg.write(__i2c_addr, buf)
            bus.i2c_rdwr(msg)
            __servo_pulse[index] = pulse
            __servo_angle[index] = int((pulse - 500) * 0.09)
        except BaseException as e:
            print(e)
            msg = i2c_msg.write(__i2c_addr, buf)
            bus.i2c_rdwr(msg)
            __servo_pulse[index] = pulse
            __servo_angle[index] = int((pulse - 500) * 0.09)

    return __servo_pulse[index]


if __name__=="__main__":
    for i in range(0,720,10):
        ang=int(1500+1000*math.sin((i/180.0)*math.pi)+math.pi/2)
        setPWMServoPulse(3, ang, 300)
        print(f'Value of ang: {__servo_angle[2]}')
        time.sleep(0.5)
    setPWMServoPulse(3, 0, 300)
    while True:
        print("I am at the start")
        ret=0
        with SMBus(__i2c) as bus:
            try:
                msg = i2c_msg.write(__i2c_addr, [__ADC_BAT_ADDR,])
                print("I am in try")
                bus.i2c_rdwr(msg)
                read = i2c_msg.read(__i2c_addr, 2)
                print(f'Reading: {list(read)}')
                bus.i2c_rdwr(read)
                print(f'Reading 2: {list(read)}')
                ret = int.from_bytes(bytes(list(read)), 'little')
            
            except:
                msg = i2c_msg.write(__i2c_addr, [__ADC_BAT_ADDR,])
                bus.i2c_rdwr(msg)
                read = i2c_msg.read(__i2c_addr, 2)
                bus.i2c_rdwr(read)
                ret = int.from_bytes(bytes(list(read)), 'little')

        print(f'I received from the adc: {ret}')
        time.sleep(5)
        
            