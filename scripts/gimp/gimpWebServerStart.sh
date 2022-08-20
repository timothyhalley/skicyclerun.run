#!/bin/bash
#
#gimp -i -c -b '(script-fu-helloworld  "Cows can fly too" "Sans" (100 2 1000 1 10 0 1) (0 0 0))' -b '(gimp-quit 0)'
#script-fu-helloworld text font size color
#gimp '-i -b "(script-fu-test)" -b "(gimp-quit 0)" '
# gimp -idf --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import batch;batch.run('./PhotoTmp/*/**')" -b "pdb.gimp_quit(1)"
# gimp -i -c -b '(script-fu-ts-helloworld  "Cows can fly too" "Sans" (100 2 1000 1 10 0 1) (0 0 0))' -b '(gimp-quit 0)


# gimp -idf --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import batch;batch.run('./images')" -b "pdb.gimp_quit(1)"
# curl 127.0.0.1:8008 -H "G\0000\0015(gimp-quit 0)"

# ########################################################################
# startgimp
# ########################################################################
#!/bin/bash

##
## Kick start gimp off just the right way
##
SERVER_LOG=$HOME/Projects/SkiCycleRun/run.skicyclerun.com/gimp.log
# GIMPAPP='/Applications/GIMP-2.10.app/Contents/MacOS/gimp -b "(plug-in-script-fu-server 1 \"127.0.0.1\" 8008 \"$SERVER_LOG\")" "$@"'
# open $GIMPAPP 

/Applications/GIMP-2.10.app/Contents/MacOS/gimp -b "(plug-in-script-fu-server 1 \"127.0.0.1\" 8008 \"$SERVER_LOG\")" "$@"
