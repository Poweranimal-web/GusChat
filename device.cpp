#include <iostream>
#include <portaudio.h>
#include "audiointerface/device.h"
using namespace std;
int Device::getnumdevices(){
    int numDevices = Pa_GetDeviceCount();
    if( numDevices < 0 )
    {
        printf("ERROR: Pa_CountDevices returned 0x%x\n", numDevices);
        return 0;
        
    }
    else{
        cout << "Total number of device: " << numDevices << endl;
        return numDevices;

    }
}
void Device::getdetailinfodevice(int numdevice){
    const PaDeviceInfo *deviceInfo = Pa_GetDeviceInfo(numdevice);
    cout << "Name: " << deviceInfo->name << endl;
    cout << "Host API: " << deviceInfo->hostApi << endl;


}
void Device::getlistinfodevices(int numdevices){
    const PaDeviceInfo *deviceInfo;
    for (int numdevice = 0; numdevice < numdevices; numdevice++)
    {
        deviceInfo = Pa_GetDeviceInfo(numdevice);
        cout << "Name: " << deviceInfo->name << endl;
        cout << "Host API: " << deviceInfo->hostApi << endl;
    }
}

