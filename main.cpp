#include <iostream>
#include <portaudio.h>
#include <boost-1_85/boost/asio.hpp>
#include "audiointerface/device.h"
#include "audiointerface/audio.h"
// #include "networkinterface/client.h"
#include <sstream>
#include <Windows.h>
using namespace std;
class MBuf: public std::stringbuf {
public:
    int sync() {
        fputs( str().c_str(), stdout );
        str( "" );
        return 0;
    }
};
int main() 
{
    SetConsoleOutputCP(CP_UTF8);
    setvbuf(stdout, nullptr, _IONBF, 0);
    MBuf buf;
    std::cout.rdbuf( &buf );
    PaError err;
    Audio audio;
    if (Audio::initialize()) {
        if (audio.open() && audio.start()) {
            cout << "Audio stream started." << std::endl;
            // Run your audio processing here
            Pa_Sleep(40000); // Keep the stream running for 5 seconds as an example
            audio.stop();
            cout << "Audio stream stopped." << std::endl;
        }
        Audio::terminate();
    }
    return 0;
}