# SkiCycleRun - RUN

RUN is a supportive repo to take photos from your MAC Photo app and publish them, fully ready & optimized, to a public AWS S3 bucket for use.

## Quick start

- Clone repo from GitHub
  - Have all prerequisites installed: nodejs/npm
- Install libraries: npm i
- Get API keys into .env file
  - GoogleAPI (see below for required APIs)
  - AWS S3
  - eg: .env file -->

    GOOGLE_API_KEY=[value]
    aws_access_key_id = [value] 
    aws_secret_access_key = [value]

- Albums: select albums from osxPhotoExporter
- Run: npm run start

## Active URL

[https://skicyclerun.com](https://skicyclerun.com)

## AWS DevOps

This repo ties the necessary artifacts to the front end - not part of a DevOps pipeline but could be coupled at a later time.

## AWS Location Services - Not yet implemented! Have everthing in the AWS eco-system
This is a stretch to consolidate everything to one platform. So instead of GoogleAPI,
use AWS location map services:
 * https://us-west-2.console.aws.amazon.com/location/home?c=lc&p=pm&region=us-west-2&z=1#/

## AWS S3 Access
Need to setup access for CLI to access S3 services. Proceed to AWS console and create new keys in IAM that has access to write files to the S3 bucket that photos will be pushed to.
 - Run: `aws configure`
 - Edit: `cat ~/.aws/creditials >>.env` or add AWS keys manually to .env file


## del - Delete files and directories using globs

https://www.npmjs.com/package/del

## transform-coordinates - Transform coordinates from one coordinate system to another. Just a wrapper around proj4 and epsg-index.

https://www.npmjs.com/package/transform-coordinates

## Github Actions for CI/CD - Note: none defined as this project uses GULP locally

https://github.com/timothyhalley/run.skicyclerun.com

- Note: See section below for github cloning of project below

## Installation

1. Clone the repo: `git clone https://github.com/timothyhalley/run.skicyclerun.com [local directory]`
2. 'cd into project folder: run'
3. `npm i` & `npm audit fix`
4. Install image packages:
  * brew install imagemagick
  * brew install graphicsmagick
  * npm upgrade
  * setup necessary keys in ".env" file. This is excluded from GIT repo. See below for google APIs 

## Google API for geo processing

1. Need to register for a developer key to run google API. One should already have a GCP portal / console account available: 'https://console.cloud.google.com'
2. Go to the project selector page in this case 'Project: SkiCycleRun'
3. Select or Search for section: 'APIs & Services' - 'https://console.cloud.google.com/apis/credentials'
  * Geocoding API
  * Geolocation API
  * Maps Elevation API
  * Maps JavaScript API
  * Maps Static API
  * Places API
  * Time Zone API
4. Create a new key or copy already existing key to clipboard.
5. Place key into ".env" file for 'googleAPI:key'
  * GOOGLE_API_KEY="API_KEY_FROM_CONSOLE"
6. Verify google API url thru the GCP API finder. There are a lot of catagories for APIs. Locate the Geolocation API url: 'https://console.cloud.google.com/google/maps-apis/' & place reference into JSON file under: googleAPI:url. Note: Google will changes these url to later / better versions.

## Publish Photos

- Have necessary albums orgainized first in MAC Photo app. Suggest having primary album called 'HomePage' for root level photos Subsiquent albums can be selected for subfolders.
  - Open `./osxPhotoExporter.scpt` with AppleScript editor.
    - Note: In the MAC Photos App - make sure under Preferences: Metadata [Include location information] is selected.
  - Select 'run' to open Album Selector dialog. Select serveral albums to export into defaul library: './PhotoLib' for processing with GULP.

## Process Photos

1. Run gulp tasks. This will process all photos (JPEG) located in the project folder ./PhotoLib - temporary or intermediate photos will be placed in the project folder ./PhotoTmp. Once complete, all website ready photos will be placed into the folder: ./PhotoPub. All album folders will be maintained.

- Photo Processing Steps:
  - Start & Clean: This step will purge the ./PhotoTmp & ./PhotoWeb folders
  - rnImages: This step will read photos, rename each photo using its EXIF data.
    - Note: This makes use of GoogleAPI Geolocation Services
    - Input: ./PhotoLib/ --> Output: ./PhotoTmp/rnPhotos
  - fxImages: This step will use several filters to modify original pictures.
    - Input: ./PhotoTmp/1_RenamePhotos --> Output: ./PhotoTmp/2_FXImages
      - Charcol filter
      - Sepia filter
      - Solar filter
      - Swirl filter
  - Copyright Photos: This step will write a signature on each photo
    - Input: ./PhotoTmp/1_RenamePhotos & ./PhotoTmp/2_FXImages --> Output: ./PhotoTmp/3_CopyrightImages
  - Add Photos Boarder: This will paint a boarder around photo to create separation
    - Input: ./PhotoTmp/3_CopyrightImages --> Output: ./PhotoTmp/4_Boarders
  - Scale Photos to web: Using maximum size based on photo scale
    https://www.npmjs.com/package/gulp-scale-images
  - Images are then optimized for web using MOZ compression.
    - Input: ./PhotoTmp/3_CopyrightImages --> Output: ./PhotoWeb
  - Publish to AWS S3 web bucket for website

## GITHUB - setup github and add to existing repo for this project

- Setup project in github

  - In terminal at root directory - run the following commands:

    - git init
    - git add .
    - git commit -m "satus novum iter"

  - Add project to your github repo

    - go to github & create a new repo, button top right area.
    - create new repo empty - without README.md as you should have one in project
    - note the help from github on adding files to new repo via commands starting with git remote
    - git remote add origin https://github.com/[repo-owner]/[repo-name].git
    - git push -u origin master
    - one should now have a new [master --> master] branch ready for use

  - Setup Static Web app - clean

    - goto Azure Portal and create a new resource: static web app
    - select required details: name; region, SKU
    - Sign in with GitHub
    - Enter in necessary Source Control Details: Organization (you), repo, branch
    - Next: Build >
      - App location = /
      - API location = api
      - App artifiact = dist (use same as your build scripts)
    - Next: tags >
    - Review & Create >
    - Review & create
      - Details
        - Subscription = [number]
        - Resource Group = CascadeZen
        - Name = www
        - Region = westus2
        - SKU = Free
        - Repository = https://github.com/timothyhalley/skicyclerun.com
        - Branch = master
        - App location = /
        - API location = api
        - App artifact location = dist
    - Add Custom Domain to Web App

      - Custom Domain
        - review the CNAME value and create/update in your DNS settings the record for this value
        - DNS Zone - update the alias of your CNAME record with the webapp value
        - Return to Web App Custom domain once positive confirmation is received to continue
        - Be aware of any changes may take awhile (up to 48 hours)

    - Static web app is not liked to Github repo for builds!

## Image Scripts

- Uses imagemagick and scripts from repo:
  -- http://www.fmwconcepts.com/imagemagick/textdeskew/index.php
  -- Note: Adjusted scripts to exit with return code for task runner.
- Tools for SVG
  -- https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Tools_for_SVG

## Sources & Ideas

- Help and gridsome docs

  - https://gridsome.org/docs/

- Deploy with GITHUB Actions to Azure

  - https://www.giftegwuenu.com/deploy-a-gridsome-app-on-azure-static-web-apps/

- Awesome gridsome

  - https://github.com/lokecarlsson/awesome-gridsome

- Tailwinds (a gridsome CSS plugin)

  - https://tailwindcss.com

- Origin branch

  - https://github.com/drehimself/gridsome-portfolio-starter.git
  - https://www.youtube.com/watch?v=uF3K3IpRfhE

- Inspirational

  - https://en.wikipedia.org/wiki/Siddhartha_(novel)

- Javascript
  - https://github.com/lydiahallie/javascript-questions#readme

## API data store

- Solar System data
  - https://api.le-systeme-solaire.net/rest/bodies

## SVG Help

- SVG repo
  - https://www.svgrepo.com/
- Viso / Mural like too for SVG diags
  - https://vecta.io
- NPM module for Bitmap --> SVG:
  - https://www.npmjs.com/package/imagetracerjs
- NPM package for image converter
  - https://www.npmjs.com/package/gulp-image
- Grok
  - https://zverok.space/blog/2021-12-28-grok-shan-shui.html
  - https://alistairshepherd.uk/writing/svg-generative-ridges/

## Notes

- Illustrations from [unDraw](https://undraw.co)
- Search is based on [Fuse.js](https://fusejs.io) and [vue-fuse](https://github.com/shayneo/vue-fuse). It only searches the title and summary of posts for now. Some tweaking may be necessary to get it to search to your liking. Check out the fuse documentation for search settings. [This PR](https://github.com/drehimself/gridsome-portfolio-starter/pull/104) added the ability to search both "Post" and "Documentation" types.
- Other Gridsome Starters and BPs:
  - [Gridsome Starter Blog](https://github.com/gridsome/gridsome-starter-blog)
  - [Gridsome Starter Bleda](https://github.com/cossssmin/gridsome-starter-bleda)
  - [Jigsaw Starter Blog](https://jigsaw.tighten.co/docs/starter-templates/) - I got a lot of design inspiration from this starter theme.

# NPM sites

- https://node.dev/post/11-simple-npm-tricks-that-will-knock-your-wombat-socks-off
