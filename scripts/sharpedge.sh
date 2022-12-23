#!/bin/bash
# 
# Developed by Fred Weinhaus 3/21/2008 .......... revised 4/25/2015
#
# ------------------------------------------------------------------------------
# 
# Licensing:
# 
# Copyright © Fred Weinhaus
# 
# My scripts are available free of charge for non-commercial use, ONLY.
# 
# For use of my scripts in commercial (for-profit) environments or 
# non-free applications, please contact me (Fred Weinhaus) for 
# licensing arrangements. My email address is fmw at alink dot net.
# 
# If you: 1) redistribute, 2) incorporate any of these scripts into other 
# free applications or 3) reprogram them in another scripting language, 
# then you must contact me for permission, especially if the result might 
# be used in a commercial or for-profit environment.
# 
# My scripts are also subject, in a subordinate manner, to the ImageMagick 
# license, which can be found at: http://www.imagemagick.org/script/license.php
# 
# ------------------------------------------------------------------------------
# 
####
#
# USAGE: sharpedge [-k kind] [-w width] [-f factor] [-e edge] [-t threshold] [-b blur] infile outfile
# USAGE: sharpedge [-st] infile
# USAGE: sharpedge [-h or -help]
# 
# OPTIONS:
# 
# -k              kind            kind of filter; uniform, binomial, gaussian;
#                                 default=uniform
# -w              width           width for gaussian type filter only;
#                             	  See sigma in -blur; float > 0
#                                 default=1
# -f              factor          sharpening gain factor; 
#                                 factor>=0; float; default=2                              
# -e              edge            edge method used to threshold edges;
#                                 edge=0 is grayscale thresholding;
#                                 edge=1 is binary thresholding;
#                                 edge=2 is no edge masking
#                                 default=0
# -t              threshold       percent threshold value; 0 to 100; 
#                                 default=25
# -b              blur            edge blurring distance; float >= 0;
#                                 default=1
# -st                             get image statistics
# -h or -help                     get help
# 
###
# 
# NAME: SHARPEDGE 
# 
# PURPOSE: To sharpen an image adaptively near edges. 
# 
# DESCRIPTION: SHARP is an adaptive technique to sharpen (or blur) an image  
# near edges. It applies an adaptive gain factor based upon the image's local  
# standard deviation to a high pass filtered version of the image and adds that  
# back to the original version of the image. The standard deviation is also 
# thresholded to generate a mask image with is then used to composite the 
# sharpened image near the edges with the original image.
# 
# The adaptive sharpening formula is R = I + G*H. Here R is the resulting image,
# I is the original image and H = (I - M) is the high pass filtered image, which
# is the original image minus the local mean image. The local mean image is 
# generated by applying a (weighted) averaging convolution to the original image. 
# G is the gain image, which is computed as G = (factor*std)/(S + (factor*std/mg)). 
# Here std is the image's global standard deviation, mg is a maximum gain constant 
# and S is the image's standard deviation in the convolution's local area. Once the 
# sharpened image is extracted, an edge mask is generated from the standard 
# deviation image and the original and sharpened images are composited using  
# the edge mask so that the sharpening occurs only at edges.
# 
# Arguments: 
# 
# -h or -help    ---  displays help information. 
# 
# -k kind ... KIND is the kind of weighted averaging filter to use. The choices 
# are uniform (3x3 unweighted average), binomial (3x3 weighted average), gaussian 
# (width determines the local area radius and the weighting coefficient roll-off). 
# See -blur for details on radius and sigma for the gaussian case. The default is 
# simple.
# 
# -w width ... WIDTH is the size of the Gaussian filter. It is the sigma for the 
# -blur Gaussian profile convolution. The radius will be about 3 times as big. The 
# default width is 1. In this case, the size of the filter will then be about 3x3 
# to be consistent with the other two kinds of filters. 

# -f factor ... FACTOR is the sharpening gain factor. It is a multiplier to the 
# image's actual standard deviation. The value for factor must be greater than 
# or equal to 0. A value of 0 leaves the image unchanged. A larger value sharpens 
# the image. Factor is floating point number. The default=2.
# 
# -e edge ... EDGE is the method used to threshold the standard  
# deviation image to get an edge mask image for use in compositing the 
# original and sharpened image. Vaules may be 0, 1 or 2. A value of 0 
# indicates that thresholding will be done using -black-threshold so that any  
# value below the threshold is black, but values above remain grayscale edges. 
# A value of 1 indicates that thresholding will be done using -threshold to 
# generate a binary edge mask image. A value of 2 indicates that no mask will  
# be used. Thus sharpening will be done throughout the image. Value 0 produces 
# the least edge sharpening for a given value of factor. Value 1 produces a 
# greater amount of edge sharpening for the same value of factor. Value 2 
# sharpens throughout the image. The default is 0.
# 
# -t threshold ... THRESHOLD is the percentage threshold value to use. Values 
# are integers between 0 and 100. The lower the threshold the more edges will 
# be sharpened. Threshold is not needed or ignored for edge=2. The default 
# is 25.
# 
# -b blur ... BLUR is the edge blurring distance to spread the edges wider 
# by a small amount. Values are floats >= 0. The default is 1.
# 
# CAVEAT: No guarantee that this script will work on all platforms, 
# nor that trapping of inconsistent parameters is complete and 
# foolproof. Use At Your Own Risk. 
# 
######
# 
# set default values
kind="uniform"
width=1
edge=0
thresh=25
factor=2
stats="false"
mg=5.0
bd=1.0
#
# set directory for temporary files
dir="."    # suggestions are dir="." or dir="/tmp"
#
#
# set up functions to report Usage and Usage with Description
PROGNAME=`type $0 | awk '{print $3}'`  # search for executable on path
PROGDIR=`dirname $PROGNAME`            # extract directory of program
PROGNAME=`basename $PROGNAME`          # base name of program
usage1() 
	{
	echo >&2 ""
	echo >&2 "$PROGNAME:" "$@"
	sed >&2 -e '1,/^####/d;  /^###/g;  /^#/!q;  s/^#//;  s/^ //;  4,$p' "$PROGDIR/$PROGNAME"
	}
usage2() 
	{
	echo >&2 ""
	echo >&2 "$PROGNAME:" "$@"
	sed >&2 -e '1,/^####/d;  /^######/g;  /^#/!q;  s/^#*//;  s/^ //;  4,$p' "$PROGDIR/$PROGNAME"
	}
#
# function to report error messages
errMsg()
	{
	echo ""
	echo $1
	echo ""
	usage1
	exit 1
	}
#
# function to test for minus at start of value of second part of option 1 or 2
checkMinus()
	{
	test=`echo "$1" | grep -c '^-.*$'`   # returns 1 if match; 0 otherwise
    [ $test -eq 1 ] && errMsg "$errorMsg"
	}
#
#
# test for correct number of arguments and get values
if [ $# -eq 0 ]
	then
	# help information
	echo ""
	usage2
	exit 0
elif [ $# -eq 3 -o $# -eq 5 -o $# -eq 7 -o $# -eq 9 -o $# -eq 11 -o $# -eq 13 -o $# -gt 14 ]
	then
	errMsg "--- TOO MANY ARGUMENTS WERE PROVIDED ---"
else
	while [ $# -gt 0 ]
		do
		# get parameters
		case "$1" in
	  -h|-help)    # help information
				   echo ""
				   usage2
				   ;;
		   -st)    # image statistics
				   stats="true"
				   ;;
			-k)    # kind
				   shift  # to get the next parameter - kind
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID FILTER KIND SPECIFICATION ---"
				   checkMinus "$1"
				   kind="$1"
				   [ "$kind" != "uniform" -a "$kind" != "binomial" -a "$kind" != "gaussian" ] && errMsg "--- KIND=$kind MUST BE EITHER UNIFORM, BINOMIAL OR GAUSSIAN ---"
				   ;;
			-w)    # get width
				   shift  # to get the next parameter - radius,sigma
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID WIDTH SPECIFICATION ---"
				   checkMinus "$1"
				   width=`expr "$1" : '\([.0-9]*\)'`
				   [ "$width" = "" ] && errMsg "--- WIDTH=$width MUST BE A POSITIVE FLOATING POINT VALUE (with no sign) ---"
				   widthtest=`echo "$width <= 0" | bc`
				   [ $widthtest -eq 1 ] && errMsg "--- WIDTH=$width MUST BE A POSITIVE FLOATING POINT VALUE ---"
				   ;;
			-e)    # edge method
				   shift  # to get the next parameter - edge
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID EDGE METHOD SPECIFICATION ---"
				   checkMinus "$1"
				   edge="$1"
				   [ $edge -ne 0 -a $edge -ne 1 -a $edge -ne 2 ] && errMsg "--- EDGE=$edge MUST BE EITHER 0, 1 OR 2 ---"
				   ;;
			-f)    # factor
				   shift  # to get the next parameter - factor
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID FACTOR SPECIFICATION ---"
				   checkMinus "$1"
				   factor=`expr "$1" : '\([.0-9]*\)'`
				   [ "$factor" = "" ] && errMsg "--- FACTOR=$factor MUST BE A NON-NEGATIVE FLOATING POINT VALUE (with no sign) ---"
				   factortest=`echo "$factor < 0" | bc`
				   [ $factortest -eq 1 ] && errMsg "--- FACTOR=$factor MUST BE A NON-NEGATIVE FLOATING POINT VALUE ---"
				   ;;
			-t)    # threshold
				   shift  # to get the next parameter - thresh
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID THRESHOLD SPECIFICATION ---"
				   checkMinus "$1"
				   thresh=`expr "$1" : '\([0-9]*\)'`
				   [ "$thresh" = "" ] && errMsg "--- THRESHOLD=$thresh MUST BE A NON-NEGATIVE INTEGER ---"
				   thresholdtestA=`echo "$thresh < 0" | bc`
				   thresholdtestB=`echo "$thresh > 100" | bc`
				   [ $thresholdtestA -eq 1 -o $thresholdtestB -eq 1 ] && errMsg "--- THRESHOLD=$thresh MUST BE AN INTEGER BETWEEN 0 AND 100 ---"
				   ;;
			-b)    # blur
				   shift  # to get the next parameter - bd
				   # test if parameter starts with minus sign 
				   errorMsg="--- INVALID BLUR DISTANCE SPECIFICATION ---"
				   checkMinus "$1"
				   bd=`expr "$1" : '\([.0-9]*\)'`
				   [ "$bd" = "" ] && errMsg "--- BLUR=$bd MUST BE A NON-NEGATIVE FLOATING POINT VALUE (with no sign) ---"
				   bdtest=`echo "$bd < 0" | bc`
				   [ $bdtest -eq 1 ] && errMsg "--- BLUR=$bd MUST BE A NON-NEGATIVE FLOATING POINT VALUE ---"
				   ;;
			 -)    # STDIN and end of arguments
				   break
				   ;;
			-*)    # any other - argument
				   errMsg "--- UNKNOWN OPTION ---"
				   ;;
			 *)    # end of arguments
				   break
				   ;;
		esac
		shift   # next option
	done
	#
	# get infile and outfile
	infile="$1"
	[ "$stats" = "false" ] && outfile="$2"
fi


# test that infile provided
[ "$infile" = "" ] && errMsg "NO INPUT FILE SPECIFIED"

# test that outfile provided
if [ "$stats" = "false" ]
	then
	[ "$outfile" = "" ] && errMsg "NO OUTPUT FILE SPECIFIED"
fi


# setup temporary images and auto delete upon exit
# use mpc/cache to hold input image temporarily in memory
tmpA="$dir/sharpedge_$$.mpc"
tmpB="$dir/sharpedge_$$.cache"
tmpM="$dir/sharpedge_mean_$$.miff"
tmpS="$dir/sharpedge_std_$$.miff"
tmp0="$dir/sharpedge_0_$$.png"
tmp1="$dir/sharpedge_1_$$.png"
trap "rm -f $tmpA $tmpB $tmpM $tmpS $tmp0 $tmp1;" 0
trap "rm -f $tmpA $tmpB $tmpM $tmpS $tmp0 $tmp1; exit 1" 1 2 3 15
trap "rm -f $tmpA $tmpB $tmpM $tmpS $tmp0 $tmp1; exit 1" ERR


# function to get min, max, mean, std from Brightness channel (or Graylevel image)
function imagestats
	{
	data=`convert \( $1 -colorspace Gray \) -verbose info:`
	min=`echo "$data" | sed -n 's/^.*[Mm]in:.*[(]\([0-9.]*\).*$/\1/p ' | head -1`
	[ "$min" = "" ] && errMsg "--- MIN NOT FOUND --- "
	max=`echo "$data" | sed -n 's/^.*[Mm]ax:.*[(]\([0-9.]*\).*$/\1/p ' | head -1`
	[ "$max" = "" ] && errMsg "--- MAX NOT FOUND --- "
	mean=`echo "$data" | sed -n 's/^.*[Mm]ean:.*[(]\([0-9.]*\).*$/\1/p ' | head -1`
	[ "$mean" = "" ] && errMsg "--- MEAN NOT FOUND --- "
	std=`echo "$data" | sed -n 's/^.*[Ss]tandard.*[(]\([0-9.]*\).*$/\1/p ' | head -1`
	[ "$std" = "" ] && errMsg "--- STD NOT FOUND --- "
	#
	# express as percent
	# Note: divide by 1 needed to force bc to honor scale=1; otherwise get 6 digits after decimal point
	min=`echo "scale=1; $min * 100 / 1" | bc`
	max=`echo "scale=1; $max * 100 / 1" | bc`
	mean=`echo "scale=1; $mean * 100 / 1" | bc`
	std=`echo "scale=1; $std * 100 / 1" | bc`
	}


ave="1,1,1,1,1,1,1,1,1"
bin3="1,2,1,2,4,2,1,2,1"

if [ "$stats" = "true" ]
	then
	imagestats $infile
	echo ""
	echo "Min (0-100) = $min"
	echo "Max (0-100) = $max"
	echo "Mean (0-100) = $mean"
	echo "Std (0-...) = $std"
	echo ""
	exit 0
else
	echo ""
	echo "Please Wait - This May Take Some Time"
	echo ""
	# convert $infile to mpc format
	if convert -quiet "$infile" +repage "$tmpA"
		then
		: 'do nothing special'
	else
		errMsg "--- FILE $infile DOES NOT EXIST OR IS NOT AN ORDINARY FILE, NOT READABLE OR HAS ZERO SIZE ---"
	fi
fi
	
# get image stats
imagestats $tmpA	

if [ "$kind" = "uniform" ]
	then
echo "uniform"
	mean="-define convolve:scale=1 -convolve $ave"
elif [ "$kind" = "binomial" ]
	then
echo "binomial"
	mean="-define convolve:scale=1 -convolve $bin3"
elif [ "$kind" = "gaussian" ]
	then
echo "gaussian"
	mean="-blur 0x$width"
fi

# get mean
convert $tmpA $mean $tmpM


# get std = sqrt( ave(x^2) - ave(x)^2 )
# -gamma 2 is equivalent to sqrt
convert \( $tmpA $tmpA -compose multiply -composite $mean \) \
	\( $tmpM $tmpM -compose multiply -composite \) +swap \
	-compose minus -composite -gamma 2 $tmpS

if [ "$bd" = "0" ]
	then
	blurstr=""
else
	blurstr="-blur 0x$bd"
fi

echo "edge=$edge"

# get thresholded edge image
if [ $edge -eq 0 ]
	then
	convert $tmpS -colorspace Gray $blurstr -contrast-stretch 0% -black-threshold $thresh% $tmp0
elif [ $edge -eq 1 ]
	then
	convert $tmpS -colorspace Gray $blurstr -contrast-stretch 0%  -threshold $thresh% $tmp0
fi
	
# compute gain and sharpened image
dstd=`echo "scale=5; $factor * $std / 100" | bc`
dsdmg=`echo "scale=5; $dstd / $mg" | bc`
gain="gn=($dstd)/(u[2]+($dsdmg));"
convert $tmpA $tmpM $tmpS -monitor -fx "$gain (u+(gn*(u-v)))" $tmp1

# composite input image and sharpened image using edge mask image
if [ $edge != 2 ]
	then
	convert $tmpA $tmp1 $tmp0 -composite "$outfile"
else
	convert $tmp1 "$outfile"
fi

FILESIZE=$(stat -f%z "$outfile")
echo "$FILESIZE"
exit 0