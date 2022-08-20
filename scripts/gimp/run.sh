# Runs batch perfectly - DNC:
/Applications/GIMP-2.99.app/Contents/MacOS/gimp -s --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import charcoal;charcoal.run('./images')" -b "pdb.gimp_quit(1)"


#Cartoon 
# /Applications/GIMP-2.10.app/Contents/MacOS/gimp -s --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import cartoon;cartoon.run('./images')" # -b "pdb.gimp_quit(1)"