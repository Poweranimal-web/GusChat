cmake_minimum_required(VERSION 3.10)
project(VOIP)
include_directories(portaudio/include boost/include)
set(CMAKE_PREFIX_PATH boost/lib/cmake/Boost-1.85.0 portaudio/cmake/portaudio)
set(SOURCE_FILES main.cpp device.cpp)
find_package(portaudio)
find_package(Boost 1.85 REQUIRED COMPONENTS system)
add_executable(VOIP ${SOURCE_FILES})
target_link_libraries(VOIP portaudio ws2_32)
add_custom_command(TARGET VOIP POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_SOURCE_DIR}/portaudio/libportaudio.dll $<TARGET_FILE_DIR:VOIP>)