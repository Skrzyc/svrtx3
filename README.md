# fruit-knight-game

![](./public/icons/icon-180.png)

Simple web game with `pixi.js` - for recruitment purposes

- developed from scratch
- underdeveloped
- unbalanced
- with some bugs and issues

---

![](./public/opg/og-image.png)

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

- run in dev `npm run dev`
- run in prod mode `npm run build-preview` / `npm run start`

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

- [ ] - readme better game description
- [ ] - unit tests
- [ ] - privacy policy page

## BUGS

- [ ] - game elements(floor, hero) - resize method - fix
- [ ] - fix scale
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
