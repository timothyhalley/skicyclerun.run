#!/bin/bash
#

## --> https://exiftool.org/
## --> install exiftool with brew: brew install exiftool
## --> check version: exiftool -ver

## Extract tags
exiftool ./PhotoLib/SkiCycleRun
##exiftool -filename -gpslatitude -gpslongitude -T ./PhotoLib/Export/BlackWhite

## rename photolib to CNAME value and place in new directory
##
##exiftool -r -ee -ext jpg ./PhotoLib/ | grep 'Create Date'
##exiftool "-FileName<CreateDate" -r -ext jpg \
##-d "../PhotoLib/exifRun/%Y%m%d_%H%M%S%%-c.%%e" ./PhotoLib/

## https://sno.phy.queensu.ca/~phil/exiftool/geotag.html
##exiftool -fileOrder gpsdatetime -p ./exifgpxhtml.fmt ../PhotoLib/exifRun

##exiftool -r ./PhotoLib/Instagram
##exiftool "-FileName<GPSTimeStamp" -r \
##-d "../public/%Y%m%d_%H%M%S.%%e" ./PhotoLib/


##exiftool -r -ext HEIC ./PhotoLib/ | grep 'Create Date'
##exiftool "-FileName<CreateDate" -r -ext HEIC \
##-d "../public/%Y%m%d_%H%M%S.%%e" ./PhotoLib/

##exiftool -r -ee -ext mov ./PhotoLib/ | grep 'Media Create Date'
##exiftool "-FileName<MediaCreateDate" -r -ee -ext mov \
##-d "../public/%Y%m%d_%H%M%S.%%e" ./PhotoLib/


# find ./PhotoLib -not -empty -type d \
# -exec exiftool "-FileName<CreateDate" -d "../public/%Y%m%d_%H%M%S.%%e"  {} +

# Layout
### exiftool -r ext jpg ./PhotoLib/Layout | grep 'File Modification Date/Time'
