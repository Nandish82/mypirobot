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

def test_servos():
    setPWMServoPulse(1, 1650, 300) 
    time.sleep(0.3)
    setPWMServoPulse(1, 500, 500) 
    time.sleep(0.3)
    setPWMServoPulse(1, 1650, 500) 
    time.sleep(0.3)
    setPWMServoPulse(1, 500, 300) 
    time.sleep(1.5)

    setPWMServoPulse(3, 645, 300) 
    time.sleep(0.3)
    setPWMServoPulse(3, 745, 300) 
    time.sleep(0.3)
    setPWMServoPulse(3, 695, 300) 
    time.sleep(1.5)

    setPWMServoPulse(4, 2365, 300) 
    time.sleep(0.3)
    setPWMServoPulse(4, 2465, 300) 
    time.sleep(0.3)
    setPWMServoPulse(4, 2415, 300) 
    time.sleep(1.5)

    setPWMServoPulse(5, 730, 300) 
    time.sleep(0.3)
    setPWMServoPulse(5, 830, 300) 
    time.sleep(0.3)
    setPWMServoPulse(5, 780, 300) 
    time.sleep(1.5)

    setPWMServoPulse(6, 1450, 300) 
    time.sleep(0.3)
    setPWMServoPulse(6, 1550, 300) 
    time.sleep(0.3)
    setPWMServoPulse(6, 1500, 300) 
    time.sleep(1.5)

if __name__=="__main__":
    test_servos()

    # test gripper
    setPWMServoPulse(1, 1500, 500) 
    time.sleep(2)
    setPWMServoPulse(1, 500, 500) 
    time.sleep(2)
    setPWMServoPulse(1, 2500, 500) 
    time.sleep(2)
    setPWMServoPulse(1, 1000, 500) 
    time.sleep(2)