#include <iostream>
#include <future>
#include <portaudio.h>
#include "codec.h"
using namespace std;
#ifndef AUDIO
#define AUDIO
class Audio 
{
PaStream *stream;
static int audioCallback(const void *inputBuffer, void *outputBuffer,
                           unsigned long framesPerBuffer,
                           const PaStreamCallbackTimeInfo* timeInfo,
                           PaStreamCallbackFlags statusFlags,
                           void *userData){ // callback function is passed
    Audio* audio = static_cast<Audio*>(userData); 
    G729 encoder;
    G729 decoder;
    uint16_t *out = (uint16_t*)outputBuffer; // audio output array
    const uint16_t *in = (const uint16_t*)inputBuffer; // audio output array
    (void) timeInfo;
    (void) statusFlags;
    int FramesPerBufferCopy = framesPerBuffer;
    uint16_t *audiodata = new uint16_t[FramesPerBufferCopy];
    int counter = 0;
    for (int i = 0; i < framesPerBuffer; i++)
    {
        // Read input, or 0.0 if inputBuffer is NULL
        // std::cout << framesPerBuffer << std::endl;
        // Output the sample (same sample to both channels if output is stereo)
        if (in[i]){
            audiodata[i] = in[i];
        }
        else{
            audiodata[i] = 0;
        }
        out[i] = in[i];

    }
    std::future<uint8_t*> coppressdata = std::async(&G729::start_encoding,ref(encoder),FramesPerBufferCopy,audiodata);
    uint8_t *data = coppressdata.get();
    cout << "hello world" << endl;
    delete[] audiodata;
    return paContinue;          
};
public:
    bool open()
        {
            PaStreamParameters outputParameters;
            PaStreamParameters inputParameters;
    
            outputParameters.device = Pa_GetDefaultOutputDevice();
            inputParameters.device = Pa_GetDefaultInputDevice();
            if (outputParameters.device == paNoDevice) {
                return false;
            }
    
            const PaDeviceInfo* pInfo = Pa_GetDeviceInfo(Pa_GetDefaultOutputDevice());
            if (pInfo != 0)
            {
                printf("Output device name: '%s'\r", pInfo->name);
            }
    
            outputParameters.channelCount = 1;       /* mono output */
            outputParameters.sampleFormat = paInt16; /* 32 bit intenger point output */
            outputParameters.suggestedLatency = Pa_GetDeviceInfo( outputParameters.device )->defaultLowOutputLatency;
            outputParameters.hostApiSpecificStreamInfo = NULL;
            inputParameters.channelCount = 1;       /* mono output */
            inputParameters.sampleFormat = paInt16; /* 16 bit intenger point output */
            inputParameters.suggestedLatency = Pa_GetDeviceInfo( inputParameters.device )->defaultLowOutputLatency;
            inputParameters.hostApiSpecificStreamInfo = NULL;
            PaError err = Pa_OpenStream(
                &stream,
                &inputParameters, 
                &outputParameters,
                48000,
                paFramesPerBufferUnspecified,
                paClipOff,      /* we won't output out of range samples so don't bother clipping them */
                &Audio::audioCallback,
                this           /* Using 'this' for userData so we can cast to Audio* in paCallback method */
            );
           if (err != paNoError)
           {
               /* Failed to open stream to device !!! */
               return false;
           }
   
           return true;
    }
    // Audio(int samples){
    //     numSamples = samples;
    //     databuffer = new float[numSamples];
    // }
    // ~Audio(){
    //     delete databuffer[];
    // }
    bool start()
    {
        PaError err = Pa_StartStream(stream);
        if (err != paNoError) {
            std::cerr << "Error starting stream: " << Pa_GetErrorText(err) << std::endl;
            return false;
        }
        return true;
    }

    void stop()
    {
        Pa_StopStream(stream);
        Pa_CloseStream(stream);
    }
    static bool initialize()
    {
        PaError err = Pa_Initialize();
        if (err != paNoError) {
            std::cerr << "PortAudio initialization error: " << Pa_GetErrorText(err) << std::endl;
            return false;
        }
        return true;
    }
    static void terminate()
    {
        Pa_Terminate();
    }
};
#endif

