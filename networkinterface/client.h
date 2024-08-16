#include <boost/asio.hpp>
#include <iostream>
#ifndef CLIENT
#define CLIENT
using boost::asio::ip::udp;
class UdpClient{
private:
char *ip;
char *port;
boost::asio::io_context io_context_;
udp::socket *Socket;
udp::endpoint receiver_endpoint;
public:
UdpClient(char Ip[], char Port[])
{

    try{
        ip = Ip;
        port = Port;
        udp::resolver::query query(*ip,*port);
        udp::resolver resolver(io_context_);
        receiver_endpoint = *resolver.resolve(query).begin();
        udp::socket socket(io_context_);
        Socket = &socket;     
        Socket->open(udp::v4());
    }
    catch (std::exception& e){
        std::cerr << e.what() << std::endl;
    }
}
bool send_to(float samples[]){
    try{
        Socket->send_to(boost::asio::buffer(samples,sizeof(samples)),receiver_endpoint);
    }
    catch (std::exception& e){
        std::cerr << e.what() << std::endl;
        return true;
    }
    return true;
}
float* receive(){
    float *data
    try{
        Socket->receive_from(boost::asio::buffer(samples,sizeof(samples)),receiver_endpoint);
    }
    catch (std::exception& e){
        std::cerr << e.what() << std::endl;
        return nullptr;
    }
    return data;
}
};
#endif