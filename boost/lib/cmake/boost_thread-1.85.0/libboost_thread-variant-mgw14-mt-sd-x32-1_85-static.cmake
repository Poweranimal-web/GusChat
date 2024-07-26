# Generated by Boost 1.85.0

# address-model=32

if(CMAKE_SIZEOF_VOID_P EQUAL 8)
  _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "32 bit, need 64")
  return()
endif()

# layout=versioned

# toolset=mgw14

if(Boost_COMPILER)
  if(NOT "mgw14" IN_LIST Boost_COMPILER AND NOT "-mgw14" IN_LIST Boost_COMPILER)
    _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "mgw14, Boost_COMPILER=${Boost_COMPILER}")
    return()
  endif()
else()
  if(BOOST_DETECTED_TOOLSET AND NOT BOOST_DETECTED_TOOLSET STREQUAL "mgw14")
    _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "mgw14, detected ${BOOST_DETECTED_TOOLSET}, set Boost_COMPILER to override")
    return()
  endif()
endif()

# link=static

if(DEFINED Boost_USE_STATIC_LIBS)
  if(NOT Boost_USE_STATIC_LIBS)
    _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "static, Boost_USE_STATIC_LIBS=${Boost_USE_STATIC_LIBS}")
    return()
  endif()
else()
  if(NOT WIN32 AND NOT _BOOST_SINGLE_VARIANT)
    _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "static, default is shared, set Boost_USE_STATIC_LIBS=ON to override")
    return()
  endif()
endif()

# runtime-link=static

if(NOT Boost_USE_STATIC_RUNTIME)
  _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "static runtime, Boost_USE_STATIC_RUNTIME not ON")
  return()
endif()

# runtime-debugging=on

if(NOT "${Boost_USE_DEBUG_RUNTIME}" STREQUAL "" AND NOT Boost_USE_DEBUG_RUNTIME)
  _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "debug runtime, Boost_USE_DEBUG_RUNTIME=${Boost_USE_DEBUG_RUNTIME}")
  return()
endif()

# threading=multi

if(DEFINED Boost_USE_MULTITHREADED AND NOT Boost_USE_MULTITHREADED)
  _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "multithreaded, Boost_USE_MULTITHREADED=${Boost_USE_MULTITHREADED}")
  return()
endif()

# variant=debug

if(NOT "${Boost_USE_DEBUG_LIBS}" STREQUAL "" AND NOT Boost_USE_DEBUG_LIBS)
  _BOOST_SKIPPED("libboost_thread-mgw14-mt-sd-x32-1_85.a" "debug, Boost_USE_DEBUG_LIBS=${Boost_USE_DEBUG_LIBS}")
  return()
endif()

if(Boost_VERBOSE OR Boost_DEBUG)
  message(STATUS "  [x] libboost_thread-mgw14-mt-sd-x32-1_85.a")
endif()

# Create imported target Boost::thread

if(NOT TARGET Boost::thread)
  add_library(Boost::thread STATIC IMPORTED)

  set_target_properties(Boost::thread PROPERTIES
    INTERFACE_INCLUDE_DIRECTORIES "${_BOOST_INCLUDEDIR}"
    INTERFACE_COMPILE_DEFINITIONS "BOOST_THREAD_NO_LIB"
  )
endif()

# Target file name: libboost_thread-mgw14-mt-sd-x32-1_85.a

get_target_property(__boost_imploc Boost::thread IMPORTED_LOCATION_DEBUG)
if(__boost_imploc)
  message(SEND_ERROR "Target Boost::thread already has an imported location '${__boost_imploc}', which is being overwritten with '${_BOOST_LIBDIR}/libboost_thread-mgw14-mt-sd-x32-1_85.a'")
endif()
unset(__boost_imploc)

set_property(TARGET Boost::thread APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)

set_target_properties(Boost::thread PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_DEBUG CXX
  IMPORTED_LOCATION_DEBUG "${_BOOST_LIBDIR}/libboost_thread-mgw14-mt-sd-x32-1_85.a"
  )

list(APPEND _BOOST_THREAD_DEPS chrono headers)
