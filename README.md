# fruit-knight-game

Simple web game with `pixi.js` - for recruitment purposes

- developed from scratch
- underdeveloped
- unbalanced
- with some bugs and issues

---

- project deployed here : `https://mytestdomain.pl`

---

features :

**pages**

- home
- loading
- game
- error
- 404 (not found)
- privacy-policy

**tools**

- post build script - (running after the build)
- deployment script - via ftp (see SETUP FOR DEPLOYMENT)
- playground.js/ts - (for testing/running small chunks of code)

## DEV

**url params**

- `gameMode` - `easy/medium/hard/hell`
- `startFromGame` - if `true` move directly to game
- `audio` - `true`/`false` - default `true`

## SETUP

- `npm install`

## SETUP FOR DEPLOYMENT

- create .env file with `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR`
- make sure u add `python` as global variable
- make sure build folder is `/dist`

## TODO

**overall**

- [ ] - readme better game description

**home**

- [ ] - some graphics links
- [ ] - og-image
- [ ] - privacy policy page

**game**

- sound system
- key events
- game logic
- resize handler
- floor asset

**sounds**

- [ ] - hp loss
- [ ] - collect
- [ ] - game over
- [ ] - btn click
- [ ] - slice sound

## BUGS

- [ ] - game elements(floor, hero) - resize method - fix
- [ ] - fix scale
- [ ] - optimize for mobile - pause button - touch events
- [ ] - hud elements on mobile devices to large (do not scale with screen width - use min())
- [ ] - remove unused assets/fonts
- [ ] - game should map pos to view

## Development ideas

1. Home

- high scores page with api/other provider integration
- home music
- player name input field - auto generated id on start (e.g player_3242389572)

2. Game

- parallax/animated background
- random bombs - which takes player hp if u catch/near - (hazard)
- blocks u need to jump over - (hazard)
- something like ghost/bats/birds that takes the collectable and translate it on x-axis (hindrance)
- wind logic - (hindrance)
- special collectables - with buffs (eg. points multiplier, slow time , etc) - (buff)
- Better quality assets

3. Performance

- Loading.tsx animation on keyframes - plain css
- pack all assets on spritesheets
- spritesheet whitelist filtering loading - (load sprites from spritesheets only the ones u need - not all of them)
- audio packing

4. Code/Project Structure

- more tests
- isolate large chunks of code for easier testing (e.g GameScene)
