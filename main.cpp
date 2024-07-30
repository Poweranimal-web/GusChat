#include <iostream>
#include <portaudio.h>
#include <boost-1_85/boost/asio.hpp>
#include "audiointerface/device.h"
#include "audiointerface/audio.h"
#include <sstream>
#include <Windows.h>
using namespace std;
using namespace boost::asio;
using ip::tcp;
class MBuf: public std::stringbuf {
public:
    int sync() {
        fputs( str().c_str(), stdout );
        str( "" );
        return 0;
    }
};
int main() {
    SetConsoleOutputCP(CP_UTF8);
    setvbuf(stdout, nullptr, _IONBF, 0);
    MBuf buf;
    std::cout.rdbuf( &buf );
    PaError err;
    Audio audio;
    if (Audio::initialize()) {
        Audio audio;
        if (audio.open() && audio.start()) {
            std::cout << "Audio stream started." << std::endl;
            // Run your audio processing here
            Pa_Sleep(60000); // Keep the stream running for 5 seconds as an example
            audio.stop();
            std::cout << "Audio stream stopped." << std::endl;
        }
        Audio::terminate();
    }

    
    return 0;
}