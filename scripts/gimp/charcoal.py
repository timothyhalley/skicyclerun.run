import glob
import os
import sys
import time

from gimpfu import *


def process(infile):
    print("Processing file %s " % infile)
    image = pdb.gimp_file_load(infile, infile, run_mode=RUN_NONINTERACTIVE)
    drawable = image.active_layer

    print("File %s loaded OK" % infile)
    pdb.plug_in_photocopy(image, drawable, 8.0, 0.8, 0.2, 0.2)
    pdb.plug_in_cartoon(image, drawable, 7.0, 0.2)
    outfile = os.path.join("processed", os.path.basename(infile))
    outfile = os.path.join(os.path.dirname(infile), outfile)
    print("Saving to %s" % outfile)
    pdb.file_jpeg_save(
        image, drawable, outfile, outfile, "0.5", 0, 1, 0, "", 0, 1, 0, 0
    )
    print("Saved to %s" % outfile)
    pdb.gimp_image_delete(image)


def run(directory):
    start = time.time()
    print('\nSTART:\n\tRunning on directory "%s"' % directory)
    #   os.mkdir(os.path.join(directory,'processed'))
    for infile in glob.glob(os.path.join(directory, "*.jpeg")):
        process(infile)
    end = time.time()
    print("\nFinished:\n\tTotal processing time: %.2f seconds") % (end - start)


# if __name__ == "__main__":
#     print("\n\bRunning as __main__ with args: %s") % sys.argv
