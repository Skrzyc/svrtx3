# fruit-knight-game

Simple web game with `pixi.js` - for recruitment purposes

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
- [ ] - loading page
- [ ] - startFromGame

## Development ideas

1. Home

- high scores page with api/other provider integration
- home music
- player name input field - auto generated id on start (e.g player_3242389572)

2. Game

- random bombs - which takes player hp if u catch/near - (hazard)
- blocks u need to jump over - (hazard)
- something like ghost/bats/birds that takes the collectable and translate it on x-axis (hindrance)
- wind logic - (hindrance)
- special collectables - with buffs (eg. points multiplier, slow time , etc) - (buff)

- Better assets

3. Performance

- home animation on keyframes - plain css
- pack all assets on spritesheets
