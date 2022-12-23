#!/bin/bash

echo $0

IN_PATH=$(realpath $1)
DIR_PATH="dirname $path"
FILES="../PhotoLib/**/*.jpeg"

for f in $FILES
do

  echo "Processing $f file..."
  FILE_PATH=$(dirname $f)
  FILE_NAME=$(basename -s .jpeg $f)
  OUT_DIR=$FILE_PATH/sketching
  OUT_FILE=$OUT_DIR/$FILE_NAME.jpeg
  # echo "PATH: " $FILE_PATH "FILE: " $FILE_NAME "OUT: " $OUT_FILE
  mkdir -p $OUT_DIR
  ./sketching.sh $f $OUT_FILE

done