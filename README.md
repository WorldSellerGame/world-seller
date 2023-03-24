# World Seller

## Getting Started

Ensure you have NodeJS v18 (needed for structuredClone).

1. `npm i`
2. `npm run load:content`

## Running the Game

`npm start`


## Development-related Topics

### Debug Commands

You must have debug mode enabled for any of these to work.

* `window.gainItem(itemName, quantity)` - gain an item in X quantity. For items, quantity should be 1. Resources can be set to any value.
* `window.discover(itemOrResourceName)` - discover an item or resource. Can make things show up quicker on the exchange, or anything else that requires discovery.
* `window.fightThreat(threatName)` - begin combat against a specific threat.
* `window.applyCombatEffectToPlayer(effect)` - add a specifically named effect to the player in combat.
* `window.gainLevel(tradeskill, levels)` - gain a number of levels for a tradeskill (levels can be negative).
* `window.setCombatHealth(value)` - set the player's health in combat to the specified value.
* `window.setCombatEnergy(value)` - set the player's energy in combat to the specified value.

### Reloading Game Content

`npm run load:content`

### Creating a New Page

`npx @ionic/cli g page pages/[page-name]`

### Creating a New Service

`npx @ionic/cli g service services/[service-name]`

### Creating a New Data Store

1. Create the 5 files in any category in `stores/`
1. Add the store to `stores/index.ts`
1. Add the migrations file to `stores/migrations.ts`

### Adding a New Sound Effect

1. Make the sound effect (BFXR)
1. Compress the sound effect [here](https://www.freeconvert.com/wav-compressor) (if it doesn't compress, use the original)
1. Place it in `src/assets/sfx`

### Adding a New SVG

1. Find the SVG [here](https://seiyria.com/gameicons-font/).
1. Copy the SVG locally to `src/assets/icon`.
1. Remove the SVGs `fill` attribute.
1. Names of svgs are generally as follows object, a dash, and then a property of the image if relevant. Inverses of this rule are frequent and should be fixed over time.

### Creating Content

See CONTENT.md.
