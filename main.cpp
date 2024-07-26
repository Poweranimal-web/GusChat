#include <iostream>
#include <portaudio.h>
#include <boost-1_85/boost/asio.hpp>
#include "audiointerface/device.h"
using namespace std;
using namespace boost::asio;
using ip::tcp;

int main() {
    PaError err;
    err = Pa_Initialize();
    if( err != paNoError ) {
        Pa_Terminate();     
        fprintf( stderr, "Error number: %d\n", err );
        fprintf( stderr, "Error message: %s\n", Pa_GetErrorText( err ));
        return err;
    }
    Device device;
    int numdevices = device.getnumdevices();
    device.getlistinfodevices(numdevices);
    err = Pa_Terminate( );
    if( err != paNoError ) {
        fprintf( stderr, "Error number: %d\n", err );
        fprintf( stderr, "Error message: %s\n", Pa_GetErrorText( err ));
        return err;
    }
    return 0;
}