#include <iostream>
#include <future>
extern "C" {
#include <libavformat/avformat.h>
#include <libavcodec/avcodec.h>
#include <libavutil/opt.h>
#include <libavutil/error.h>
}
#ifndef CODEC
#define CODEC
class G729
{
const AVCodec *codec;
AVCodecContext *contextOrigin= NULL;
AVFrame *frame;
AVPacket *pkt;
uint8_t *packetArray;
public:
uint8_t* start_encoding(int framesize,uint16_t *data){
    codec = avcodec_find_encoder(AV_CODEC_ID_OPUS);
    if (!codec) {
        fprintf(stderr, "Codec not found\n");
        return 0;
    }
    contextOrigin = avcodec_alloc_context3(codec);
    if (!contextOrigin) {
        fprintf(stderr, "Could not allocate audio codec context\n");
        return 0;
    }
    contextOrigin->bit_rate = 8000;
    contextOrigin->sample_rate = 48000;
    contextOrigin->sample_fmt = AV_SAMPLE_FMT_S16;
    contextOrigin->frame_size = framesize;
    contextOrigin->channel_layout = AV_CH_LAYOUT_MONO;
    contextOrigin->channels = av_get_channel_layout_nb_channels(contextOrigin->channel_layout);
    if (avcodec_open2(contextOrigin, codec, NULL) < 0) {
        std::cerr << "Could not open codec" << std::endl;
        return 0;
    }
    frame = av_frame_alloc();
    if (!frame) {
        std::cerr << "Could not allocate audio frame" << std::endl;
        return 0;
    }
    frame->nb_samples = contextOrigin->frame_size;
    frame->format = contextOrigin->sample_fmt;
    frame->channel_layout = contextOrigin->channel_layout;
    int ret = av_frame_get_buffer(frame, 0);
    if (ret < 0) {
        std::cerr << "Could not allocate audio data buffers: " << av_err2str(ret) << std::endl;
        av_frame_free(&frame);
        return 0;
    }
    AVPacket *pkt = av_packet_alloc();
    if (!pkt) {
        std::cerr << "Could not allocate audio packet" << std::endl;
        return 0;
    }
    fill_frame(data);
    apply_codec(contextOrigin,frame,pkt);
    copy_pkt_to_uint8_array(); 
    std::cout << "hello World" << std::endl;
    av_frame_free(&frame);
    avcodec_free_context(&contextOrigin);
    av_packet_unref(pkt);
    return packetArray;
}
uint16_t* start_decoding(int framesize,uint8_t data[]){
    codec = avcodec_find_decoder(AV_CODEC_ID_OPUS);
    if (!codec) {
        fprintf(stderr, "Codec not found\n");
        return 0;
    }
    contextOrigin = avcodec_alloc_context3(codec);
    if (!contextOrigin) {
        fprintf(stderr, "Could not allocate audio codec context\n");
        return 0;
    }
    contextOrigin->bit_rate = 8000;
    contextOrigin->sample_rate = 48000;
    contextOrigin->sample_fmt = AV_SAMPLE_FMT_S16;
    contextOrigin->frame_size = framesize;
    if (avcodec_open2(contextOrigin, codec, NULL) < 0) {
        std::cerr << "Could not open codec" << std::endl;
        return 0;
    }
    frame = av_frame_alloc();
    if (!frame) {
        std::cerr << "Could not allocate audio frame" << std::endl;
        return 0;
    }
    frame->nb_samples = contextOrigin->frame_size;
    frame->format = contextOrigin->sample_fmt;
    int ret = av_frame_get_buffer(frame, 0);
    if (ret < 0) {
        std::cerr << "Could not allocate audio data buffers: " << av_err2str(ret) << std::endl;
        av_frame_free(&frame);
        return 0;
    }
    AVPacket *pkt = av_packet_alloc();
    if (!pkt) {
        std::cerr << "Could not allocate audio packet" << std::endl;
        return 0;
    }
    fill_frame(data);
    apply_codec(contextOrigin,frame,pkt);
    uint16_t *array = copy_pkt_to_uint16_array();
    return array;

}
bool fill_frame(uint16_t data[]){
    for (int i = 0; i < frame->nb_samples; i++)
    {
        ((uint16_t*)frame->data[0])[i] = data[i];
    }
    return true;
}
bool fill_frame(uint8_t data[]){
    for (int i = 0; i < frame->nb_samples; i++)
    {
        ((uint8_t*)frame->data[0])[i] = data[i];
    }
    return true;
}
bool apply_codec(AVCodecContext *enc_ctx, AVFrame *frame, AVPacket *pkt){
    int ret = avcodec_send_frame(enc_ctx, frame);
    if (ret < 0) {
        std::cerr << "Error sending the frame to the encoder: " << av_err2str(ret) << std::endl;
        exit(1);
    }
    // Receive packet
    while (ret >= 0) {
        ret = avcodec_receive_packet(enc_ctx, pkt);
        if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF)
            return false;
        else if (ret < 0) {
            std::cerr << "Error encoding audio frame: " << av_err2str(ret) << std::endl;
            exit(1);
        }
        std::cout << "Encoded packet size: " << pkt->size << std::endl;
        return true; 
    }  
}
void copy_pkt_to_uint8_array(){
    packetArray = new uint8_t[pkt->size];
    for (int i = 0; i < pkt->size; i++)
    {
        std::cout << pkt->data[i] << std::endl; 
        packetArray[i] = pkt->data[i];
    }
}
uint16_t* copy_pkt_to_uint16_array(){
    uint16_t packetArray[pkt->size];
    for (int i = 0; i < pkt->size; i++)
    {
        packetArray[i] = pkt->data[i];
    }
    return packetArray;
}
~G729(){
    delete[] packetArray;
}

};
#endif