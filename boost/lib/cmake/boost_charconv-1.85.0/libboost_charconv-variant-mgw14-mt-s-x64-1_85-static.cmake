# Generated by Boost 1.85.0

# address-model=64

if(CMAKE_SIZEOF_VOID_P EQUAL 4)
  _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "64 bit, need 32")
  return()
endif()

# layout=versioned

# toolset=mgw14

if(Boost_COMPILER)
  if(NOT "mgw14" IN_LIST Boost_COMPILER AND NOT "-mgw14" IN_LIST Boost_COMPILER)
    _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "mgw14, Boost_COMPILER=${Boost_COMPILER}")
    return()
  endif()
else()
  if(BOOST_DETECTED_TOOLSET AND NOT BOOST_DETECTED_TOOLSET STREQUAL "mgw14")
    _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "mgw14, detected ${BOOST_DETECTED_TOOLSET}, set Boost_COMPILER to override")
    return()
  endif()
endif()

# link=static

if(DEFINED Boost_USE_STATIC_LIBS)
  if(NOT Boost_USE_STATIC_LIBS)
    _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "static, Boost_USE_STATIC_LIBS=${Boost_USE_STATIC_LIBS}")
    return()
  endif()
else()
  if(NOT WIN32 AND NOT _BOOST_SINGLE_VARIANT)
    _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "static, default is shared, set Boost_USE_STATIC_LIBS=ON to override")
    return()
  endif()
endif()

# runtime-link=static

if(NOT Boost_USE_STATIC_RUNTIME)
  _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "static runtime, Boost_USE_STATIC_RUNTIME not ON")
  return()
endif()

# runtime-debugging=off

if(Boost_USE_DEBUG_RUNTIME)
  _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "release runtime, Boost_USE_DEBUG_RUNTIME=${Boost_USE_DEBUG_RUNTIME}")
  return()
endif()

# threading=multi

if(DEFINED Boost_USE_MULTITHREADED AND NOT Boost_USE_MULTITHREADED)
  _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "multithreaded, Boost_USE_MULTITHREADED=${Boost_USE_MULTITHREADED}")
  return()
endif()

# variant=release

if(NOT "${Boost_USE_RELEASE_LIBS}" STREQUAL "" AND NOT Boost_USE_RELEASE_LIBS)
  _BOOST_SKIPPED("libboost_charconv-mgw14-mt-s-x64-1_85.a" "release, Boost_USE_RELEASE_LIBS=${Boost_USE_RELEASE_LIBS}")
  return()
endif()

if(Boost_VERBOSE OR Boost_DEBUG)
  message(STATUS "  [x] libboost_charconv-mgw14-mt-s-x64-1_85.a")
endif()

# Create imported target Boost::charconv

if(NOT TARGET Boost::charconv)
  add_library(Boost::charconv STATIC IMPORTED)

  set_target_properties(Boost::charconv PROPERTIES
    INTERFACE_INCLUDE_DIRECTORIES "${_BOOST_INCLUDEDIR}"
    INTERFACE_COMPILE_DEFINITIONS "BOOST_CHARCONV_NO_LIB"
  )
endif()

# Target file name: libboost_charconv-mgw14-mt-s-x64-1_85.a

get_target_property(__boost_imploc Boost::charconv IMPORTED_LOCATION_RELEASE)
if(__boost_imploc)
  message(SEND_ERROR "Target Boost::charconv already has an imported location '${__boost_imploc}', which is being overwritten with '${_BOOST_LIBDIR}/libboost_charconv-mgw14-mt-s-x64-1_85.a'")
endif()
unset(__boost_imploc)

set_property(TARGET Boost::charconv APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)

set_target_properties(Boost::charconv PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE CXX
  IMPORTED_LOCATION_RELEASE "${_BOOST_LIBDIR}/libboost_charconv-mgw14-mt-s-x64-1_85.a"
  )

set_target_properties(Boost::charconv PROPERTIES
  MAP_IMPORTED_CONFIG_MINSIZEREL Release
  MAP_IMPORTED_CONFIG_RELWITHDEBINFO Release
  )

list(APPEND _BOOST_CHARCONV_DEPS headers)

if(CMAKE_CONFIGURATION_TYPES)
  set_property(TARGET Boost::charconv APPEND PROPERTY INTERFACE_LINK_LIBRARIES
    "$<$<CONFIG:release>:quadmath>")
else()
  set_property(TARGET Boost::charconv APPEND PROPERTY INTERFACE_LINK_LIBRARIES
    quadmath)
endif()
