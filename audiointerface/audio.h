#include <portaudio.h>
#ifndef AUDIO
#define AUDIO
class Audio 
{
// int numSamples;
// float *databuffer;
PaStream *stream;
static int audioCallback(const void *inputBuffer, void *outputBuffer,
                           unsigned long framesPerBuffer,
                           const PaStreamCallbackTimeInfo* timeInfo,
                           PaStreamCallbackFlags statusFlags,
                           void *userData){
    float *out = (float*)outputBuffer;
    const float *in = (const float*)inputBuffer;
    (void) timeInfo;
    (void) statusFlags;
    (void) userData;
    for (int i = 0; i < framesPerBuffer; i++)
    {
        float sample = in ? in[i] : 0.0f; // Read input, or 0.0 if inputBuffer is NULL
        // Output the sample (same sample to both channels if output is stereo)
        out[i] = sample;
    }
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
            outputParameters.sampleFormat = paFloat32; /* 32 bit floating point output */
            outputParameters.suggestedLatency = Pa_GetDeviceInfo( outputParameters.device )->defaultLowOutputLatency;
            outputParameters.hostApiSpecificStreamInfo = NULL;
            inputParameters.channelCount = 1;       /* mono output */
            inputParameters.sampleFormat = paFloat32; /* 32 bit floating point output */
            inputParameters.suggestedLatency = Pa_GetDeviceInfo( inputParameters.device )->defaultLowOutputLatency;
            inputParameters.hostApiSpecificStreamInfo = NULL;
    
            PaError err = Pa_OpenStream(
                &stream,
                &inputParameters, /* no input */
                &outputParameters,
                44100,
                paFramesPerBufferUnspecified,
                paClipOff,      /* we won't output out of range samples so don't bother clipping them */
                &Audio::audioCallback,
                nullptr            /* Using 'this' for userData so we can cast to Sine* in paCallback method */
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

