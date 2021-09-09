# yell0wsuit's HTML5 games collection

> *Flash is dead, long live HTML!*

A personal collection of HTML5 games with the goal of preserving them in case of being discontinued (and having fun). Some games may require an Internet connection in order to work properly; however, plans to make them offline will be made in case the servers are going to be shut down.

[Play online here](https://yell0wsuit.github.io/html5-games/). Some games are mobile-friendly, which means you can play on your phone (look for the green text).

Instructions for [downloading and playing offline here](https://yell0wsuit.github.io/html5-games/offline.html).

## Changes made to the original code

### Chrome Dino

The game code is from the old version, but added some quality-of-life changes from newer ``offline.js`` version. This includes:
- Make the game adapts to the screen width like the Chrome version (chrome://dino).
- Gamepad support (not tested).

### Cut the Rope
- Fix the bug that makes the game softlock if you finish the last level in a box but not collecting enough star to unlock the next box.
- Added 275 levels from the Microsoft Store version (which is delisted) and 25 levels from Cut the Rope's Round 5 website. To accomodate this, added new assets from the MS Store version.
- Added a 1080p version (requires a fast Internet connection if you play online).
- Upgraded sound quality (requires a fast Internet connection if you play online).
- 2 random in-game music.

### Contre Jour
- Removed ads, trackers and Internet Explorer flyout.
- Updated jQuery to the latest version.
- Added jQuery Migrate since the game does not work on newer jQuery version.

### Cut the Rope: Time Travel (Burger King edition)
- Removed the code input popup.
- Use sound and music from the mobile version.

### Edge's Let's Surf
- Code is tweaked to be able to run without errors.

### Bejeweled (HTML5 edition)
- Removed the "Install Chrome extension" popup since the game was discontinued.
- Updated jQuery to the latest version.

### Microsoft Sudoku (HTML5 edition)
- Obtained necessary puzzle data and tweaked the code to enable the game to run offline.
- Removed tracking links.

### Microsoft Solitaire Collection
- Tweaked the code and obtained the solvable data to be able to choose difficulty offline other than "Random".
- Removed tracking links.

### Microsoft Mahjong (HTML5 edition)
- Make the game adapts to screen size. Can be played on mobile, but a larger screen size is recommended (the game is not optimized for small screen).

### Microsoft Ultimate Word Games (HTML5 edition)
- Added Segoe UI font for non-Microsoft platforms.

### Microsoft Minesweeper (HTML5 edition)
- Removed tracking links.

### Microsoft Jigsaw (HTML5 edition)
- Removed tracking links.
- High-quality pictures and music.
- Added 3 random music.
- Add Segoe UI fonts for non-Microsoft platforms.
- Obtained puzzles and tweaked the code so the game can be run offline.
- Added new puzzles for English (US) from the Microsoft Store version:
	- Ancient Ruins
	- Bowling
	- Colorful Birds
	- Colorful Skies
	- Dinosaurs 3
	- Everglades
	- Fun & Games
	- Hong Kong
	- How It's Made 2
	- Madagascar
	- Model Railways
	- Museum Animals
	- Reef Life 2
	- Seamed Perfect
	- See a Face
	- Sri Lanka
	- Thailand 2
	- Tokyo
	- Topiary

### Microsoft Bubble (HTML5 edition)
- Removed tracking link

### Microsoft Jewel (HTML5 edition)
- Removed tracking links
- Removed ads

## Credits
- **Cut the Rope**, **Cut the Rope: Time Travel**: [https://www.cuttherope.net](https://www.cuttherope.net)
- **Contre Jour**: [http://contrejour.ie/](http://contrejour.ie/) (dead link as of 08/31)
- **Let's Surf**: surf.bundle.js workaround from [https://github.com/jackbuehner/MicrosoftEdge-S.U.R.F.](https://github.com/jackbuehner/MicrosoftEdge-S.U.R.F.)
- **Bejeweled (HTML5 edition)**: archived from Chrome Store, [https://github.com/scientihark/beautyofH5](https://github.com/scientihark/beautyofH5)
- **Microsoft Sudoku**, **Microsoft Solitaire Collection**, **Microsoft Mahjong**, **Microsoft Ultimate Word Games**, **Microsoft Minesweeper**, **Microsoft Jigsaw**, **Microsoft Bubble**, **Microsoft Jewel**: [MSN Games](https://zone.msn.com/), [Game Distribution](https://gamedistribution.com/)
- **Chrome Dino**: https://source.chromium.org/chromium/chromium/src/+/master:components/neterror/resources/

## Issues, discussions and pull requests (PRs)
Feel free to open an issue if you find some problems with the game, or make a PR if you know how to fix it.  
If you simply want to ask for help, use the Discussions tab.
