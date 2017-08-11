# Coffee Conundrum
HTML 5 arcade shooter game with a cute setting, developed with TypeScript and phaser.

Project used [this starter boilerplate](https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project)

## Setup
`npm install`

<b>Run the dev server</b>
`npm run server:dev`

<b>Development build</b>
`npm run build:dev`

This will build the game with a few caveats;
- A compile time flag, DEBUG, set to true; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.js will not be minified

<b>Production build</b>
`npm run build:dist`

This will build the game with a few caveats;
- The compile time flag, DEBUG, set to false; allowing you to include or not include certain code depending on if it's DEBUG build or not.
- The resulting game.min.js will be minified

### Folder Structure:
- **assets/** – This is where your assets that are processed when building goes
- **assets_raw/** – This folder is NOT processed at all and is merely an organizational folder (I use it for things like my individual images that get compiled into a spritesheet, individual sounds that get compiled into an audiosprite, etc...)
- **dist/** – This is where the built game will go
- **node_modules/** – This is where the node modules required for the game will be put with npm install
- **scripts/** – This is where node scripts go
- **src/** – This is where all the games code goes
- **templates/** – This is where the html template that gets built by Webpack goes
- **.gitignore** – List of files and folders that are ignored by git
- **.npmrc** – List of some project wide npm settings
- **electron-main.js** – Entry point and application life controller for electron builds
- **package.json** – Node config for the project
- **README.md** – This is the README displayed ont he GitHub page
- **README_HEADER.png** – This is just the header image for the GitHub README
- **tsconfig.json** – List of some TypeScript settings
- **tslint.json** – List of some TypeScript Linting rules
- **webpack.dev.config.js** – Webpack config for the DEV build
- **webpack.dist.config.js** – Webpack config for the DIST build

## Generate Assets Class:

Drop your assets in assets/ (subdirectories do not matter) and run (you need to run this manually if you change assets while the server is running, otherwise it's run automatically when running a build);

`npm run assets`

or (if your dev GOOGLE_WEB_FONTS is different from your dist);

`npm run assets:dev`

src/assets.ts will be generated which contains sections for all your asset types (the generator is smart enough to distinguish what assets are what !) and classes for every asset, it will also generate an enum containing every frame and sprite in Atlases and AudioSprites respectively!

No need to remember keys, frames, or sprites; which means no more typos resulting in asset not found errors. Just use, for example, Assets.Images.ImagesBackgroundTemplate.getName() or Assets.Audiosprites.AudiospritesSfx.Sprites.Laser1. This also allows the compiler to warn you if you are trying to use an asset that doesn't exist!

The preloader will use this class to load everything, **you don't have to do anything in code to get your assets loading and available (except for any assets you need for your loading screen...)*

Currently supports the following (if you need a new extension or find an issue with one of your assets not exporting correctly, just let me know);

- Images:
  - bmp, gif, jpg, jpeg, png, webp
- Spritesheets:
  - bmp, gif, jpg, jpeg, png, webp
  - \[frameWidth, frameHeight, frameMax, margin, spacing\] - frameWidth & frameHeight are required.
  - Example: spritesheet.\[100, 100\].png
- Atlases:
  - bmp, gif, jpg, jpeg, png, webp
  - json (the loader figures out if it's a JSONArray or JSONHash, no need to remember or care), xml
- Audio:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
- Audiosprites:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
  - json
- Local Fonts:
  - eot, otf, svg, ttf, woff, woff2
  - css
- Bitmap Font:
  - bmp, gif, jpg, jpeg, png, webp
  - xml, fnt
- JSON:
  - json
- XML:
  - xml
- Text:
  - txt
- Scripts:
  - js
- Shaders:
  - frag

Which version of the audio to load is defined in the webpack.dev.config.js and webpack.dist.config.js under the DefinePlugin 'SOUND_EXTENSIONS_PREFERENCE' section;
- Currently I set the order to: webm, ogg, m4a, mp3, aac, ac3, caf, flac, mp4, wav
- The loader will load the audio using this as the preference; the first supported file that is found is used using the order of this list as most preferred to least preferred

## Change the game size and generate a template background:

Note: This is automatically run after running npm install, however you may want to run it again (if you deleted the background.png and want it back, or if you want to change the game size from the default).

Run:

```npm run setupGameSize```

This will run a script that will generate a template background showing the safe and decoration area of your game when it is sized or scaled for different devices as well as updating a couple global values in the webpack configs so that the game knows about the new size when built.

If you do not want the default 800 x 500 with this scaling style, run the following and all will be updated.

**DO NOT MODIFY THE (DEFAULT or MAX)\_GAME\_(WIDTH or HEIGHT) OR SCALE_MODE PLUGINS DEFINED IN THE WEBPACK CONFIGS, OR THIS WILL NOT WORK**;

Run the following for descriptions and default values for all possible options;

```npm run setupGameSize -- -h```

Run the following specifying some or all of the options;

```npm run setupGameSize -- --width [whatever width you want] --height [whatever height you want] --aspect-ratio [If you want a different default aspect ratio] --scale-mode [one of the Phaser Scale Modes] [--no-png]```

**The '--' after setupGameSize is not a mistake; it is required to pass arguments along to the script.**

You can either provide the width **and** height (defaults 800 and 500 respectively) and as long as they result in an aspect ratio of what's set in the script or by --aspect-ratio (default 1.6 or 16:10), or you can provide the width **or** height and the one you didn't provide will be calculated for you.

Providing --scale-mode will set this.game.scale.scaleMode to the corresponding Phaser.ScaleManager.SCALE_MODE (default USER_SCALE).

If you do not want the background to be created just add the flag --no-png (not putting this will let the background generate).

## Google Web Fonts:

Add your desired Google Web Fonts to the webpack.dev.config.js and/or webpack.dist.config.js in the DefinePlugin 'GOOGLE_WEB_FONTS' section and they will then be loaded and available via Assets.GoogleWebFonts.

## Custom/Local Web Fonts:

Add your desired Custom/Local Web Fonts to your assets folder and they will then be loaded and available via Assets.CustomWebFonts
- The various font files, and the css MUST share the same name
- One CSS file per font

I recommend one of the following generators for generating your font files;
- [Font Squirrel Webfont Generator][fontsquirrel]
- [Everything Fonts font-face generator][everythingfonts]
