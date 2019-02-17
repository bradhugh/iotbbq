export PATH=$PATH:$HOME/raspberrypi/tools/arm-bcm2708/arm-rpi-4.9.3-linux-gnueabihf/bin
export LIBRARY_PATH=$HOME/raspberrypi/rootfs/lib:$HOME/raspberrypi/rootfs/usr/lib

export HOST=arm-linux-gnueabihf
export CPP="${HOST}-gcc -E"
export STRIP="${HOST}-strip"
export OBJCOPY="${HOST}-objcopy"
export AR="${HOST}-ar"
export RANLIB="${HOST}-ranlib"
export LD="${HOST}-ld"
export OBJDUMP="${HOST}-objdump"
export CC="${HOST}-gcc"
export CXX="${HOST}-g++"
export NM="${HOST}-nm"
export AS="${HOST}-as"

export LD="$CXX"
export LINK="$CXX"
export GYP_DEFINES="armv7=0"
export CCFLAGS='-march=armv7'
export CXXFLAGS='-march=armv7'
