# ########################################################################
# sendgimp
# ########################################################################
#!/bin/bash

##
## Send gimp all the expressions on the command line. Or, if
## no command line, then read from stdin
##

SERVER_HOST=127.0.0.1
SERVER_PORT=8008

function gimp_send {
  expr="$1"
  len=`echo -n $expr | wc -c | cut -d ' ' -f1`
  (perl -e "print pack('an', 'G', $len)" ;
   echo $expr) | nc $SERVER_HOST $SERVER_PORT
}

if [ -z "$1" ] ; then
  expr=`cat`
  gimp_send "$expr"
else
  while [ -n "$1" ]; do
    gimp_send "$1" 
    shift
  done
fi