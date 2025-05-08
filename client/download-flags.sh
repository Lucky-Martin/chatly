#!/bin/bash

# Create flags directory if it doesn't exist
mkdir -p src/assets/images/flags

# Download English flag (UK flag) - higher quality
curl -o src/assets/images/flags/en.png "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/320px-Flag_of_the_United_Kingdom.svg.png"

# Download Bulgarian flag - higher quality
curl -o src/assets/images/flags/bg.png "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/320px-Flag_of_Bulgaria.svg.png"

echo "Flag images have been downloaded to src/assets/images/flags/" 