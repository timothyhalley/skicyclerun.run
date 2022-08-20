#!/bin/bash

# Watercolor
# http://www.fmwconcepts.com/imagemagick/watercolor/index.php
# USAGE: watercolor [-s smoothing] [-e edge] [-m mixing] [-c contrast] infile outfile

FILES="../PhotoTmp/2_ScalePhotos/**/*.jpeg"
for f in $FILES
do
  echo "Processing $f file... & out: "${f/2_ScalePhotos/4_GMRepo}""

#   echo "BASENAME: $(basename $(dirname $f))"
#   echo "REALPATH: $(realpath $(dirname $f))"
#   echo "DIRNAME: $(dirname $f)"
  mkdir -p $(dirname "${f/2_ScalePhotos/4_GMRepo}")
  ./scripts/watercolor.sh -s 3 -e 5 -m 33 -c 1 $f ${f/2_ScalePhotos/4_GMRepo}
#   cat "$f"
done