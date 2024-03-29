
# World Seller Modding

We use mod.io for our mod hosting. You can find the World Seller mod page [here](https://mod.io/g/world-seller). This is where you'll be hosting and managing mods.

## Anatomy of a Mod

A mod is composed of one more files. Content files are stored in JSON, and icons are SVGs. All JSON files are merged together into a single blob and then loaded into the game, so feel free to separate your content as needed. A recommended folder structure is as follows:

```
mod.zip
  - content
    - mycontentupdate.json

  - icons
    - myicon1.svg
    - myicon2.svg

  - sfx
    - sound-1.wav
    - sound-2.wav

  - themes
    - file1.css
    - file2.css
```

### Content

A JSON file can optionally have any of the following properties:

```json
{
  "fishing": GatheringLocation[],
  "foraging": GatheringLocation[],
  "hunting": GatheringLocation[],
  "logging": GatheringLocation[],
  "mining": GatheringLocation[],

  "alchemy": CraftingRecipe[],
  "blacksmithing": CraftingRecipe[],
  "cooking": CraftingRecipe[],
  "jewelcrafting": CraftingRecipe[],
  "weaving": CraftingRecipe[],

  "resources": Map<ResourceName, ResourceData>,
  "items": Map<ItemName, ItemData>,
  "abilities": Map<AbilityName, AbilityData>,
  "effects": Map<EffectName, EffectData>,

  "enemies": Map<EnemyName, EnemyData>,
  "threats": Map<ThreatName, ThreatData>,
  "dungeons": Map<DungeonName, DungeonData>,

  "themes": Array<{ name: string, value: string }>
}
```

#### Content Types

##### Rarities

* Broken
* Junk
* Common
* Uncommon
* Rare
* Epic
* Legendary

##### Item Categories

* Armor
* Crafting Tables
* Foods
* Jewelry
* Miscellaneous
* Potions
* Raw Materials
* Refined Materials
* Seeds
* Tools
* Weapons

##### Stats

* `pickaxePower` - time reduction on mining (a 10 second node with a power of 3 becomes a 7 second node)
* `axePower` - time reduction on logging
* `fishingPower` - time reduction on fishing
* `scythePower` - time reduction on harvesting
* `huntingPower` - time reduction on hunting
* `pickaxePowerPercent` - time reduction on mining (a 10 second node with a power of 50% becomes a 5 second node)
* `axePowerPercent` - time reduction on logging
* `fishingPowerPercent` - time reduction on fishing
* `scythePowerPercent` - time reduction on harvesting
* `huntingPowerPercent` - time reduction on hunting
* `pickaxeSpeed` - cooldown reduction on mining (a 10 second cooldown with a power of 3 becomes a 7 second cooldown)
* `axeSpeed` - cooldown reduction on logging
* `fishingSpeed` - cooldown reduction on fishing
* `scytheSpeed` - cooldown reduction on harvesting
* `huntingSpeed` - cooldown reduction on hunting
* `pickaxeSpeedPercent` - cooldown reduction on mining (a 10 second cooldown with a power of 50% becomes a 5 second cooldown)
* `axeSpeedPercent` - cooldown reduction on logging
* `fishingSpeedPercent` - cooldown reduction on fishing
* `scytheSpeedPercent` - cooldown reduction on harvesting
* `huntingSpeedPercent` - cooldown reduction on hunting
* `armor` - physical damage reduction
* `mitigation` - physical damage reduction (%, capped at 75%)
* `healing` - boost to healing skills
* `attack` - boost to physical damage
* `speed` - how fast the creature goes in combat, relative to other creatures
* `healthBonus` - boost to the creatures max health
* `energyBonus` - boost to the creatures max energy
* `healingPerRound` - how much health the creature regenerates per round
* `energyPerRound` - how much energy the creature regenerates per round
* `healingPerCombat` - how much health the creature regenerates per combat (at the start)
* `energyPerCombat` - how much energy the creature regenerates per combat (at the start)

##### Dungeon Nodes

* `e` - the entrance of the current floor (can be used to go back to the previous floor, or leave)
* `x` - the exit of the current floor (will go to the next floor)
* `f` - a bonfire, will heal the player fully
* `b` - the boss of the dungeon - if there are multiple, any boss killed will end the dungeon
* `.` - wall - non-traversible
* `1` - floor - traversible

##### Adding a New Resource

Resources require:

* `description` - shown in game
* `icon` - the name of the SVG file
* `rarity` - the rarity of the resource (see Rarities)
* `category` - the category of the resource (see Item Categories)


##### Adding a New Item

Items require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `type` - the type of the item (Pickaxe, Axe, FishingRod, FishingBait, Scythe, HuntingTool, Weapon, LegArmor, ChestArmor, HeadArmor, FootArmor, HandArmor, Jewelry, Food, Potion)
* `category` - the rarity of the item (see Item Categories)
* `durability` - how many uses the item can take (`-1` = infinite)
* `value` - how much the item sells for (base; selling via shop sells it for 3x this value to start)
* `givesPlayerAbility` - optional, the ability the item gives (by ability name)
* `stats` - the stats the item gives - see items for how to declare this, and see Stats for the valid stats
* `foodDuration` - optional, if specified, the item can be used as a food for combat and will give its `stats` every combat
* `oocHealth` - optional, if specified, will let the player use this item out of combat (if it's `type='Food'`) and restore this value to health
* `oocEnergy` - optional, if specified, will let the player use this item out of combat (if it's `type='Food'`) and restore this value to energy
* `effects` - optional, if specified, these effects will apply to the player when they enter combat (if it's `type='Food'`). Format: `{ effect: 'ApplyEffect', effectName: 'EffectToApply' }`
* `abilities` - optional, if specified, these abilities will happen when the player uses the item in combat (food, potions, etc)

###### Creating Food

Food is a particularly flexible item type. It can be used in combat to give a boost to the player, or out of combat to restore health or energy. With food, you have a few knobs you can twist to get the desired effect:

Out of combat:

- `oocHealth` - how much health the food restores out of combat
- `oocEnergy` - how much energy the food restores out of combat

When entering combat:

- `stats` - the stats the food gives to the player when starting combat
- `foodDuration` - how many combats the food lasts for
- `effects` - the effects the food gives to the player when starting combat

When in combat:

- `abilities` - the abilities the food gives to the player when used in combat as an item

##### Adding a New Gathering Location

Gathering requires:

* `name` - shown in game
* `description` - shown in game
* `perGather` - how many resources are gathered per gather (`min`, `max`)
* `level` - the level required to gather here (`min`, `max`)
* `gatherTime` - how long it takes to gather from this node (in seconds)
* `resources` - the resources that can be gathered from this node (by resource name; see other nodes for how to declare this)
* `maxWorkers` - how many workers can gather from this node at once

##### Adding a New Recipe

Recipes require:

* `result` - shown in game, the item or resource crafted
* `perCraft` - how many items are crafted per craft (`min`, `max`)
* `level` - the level required to craft this (`min`, `max`)
* `craftTime` - how long it takes to craft this item (in seconds)
* `ingredients` - the ingredients required to craft this item (by resource name; see other recipes for how to declare this)
* `require` - an array of strings, each of which is a requirement for this recipe to be available and visible (see other recipes for examples)
* `preserve` - an array of strings, each of which is NOT consumed when creating this item (crafting tables f.ex.)
* `maxWorkers` - how many workers can craft this item at once

##### Adding a New Ability

Abilities require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `target` - the target of the ability (Self, Ally [for enemies], Single [single target, opposite side], All, AllEnemies)
* `type` - the type of the ability (Physical, Magical)
* `cooldown` - how long the ability is on cooldown for (in turns)
* `energyCost` - how much energy the ability costs
* `stats` - the stats the ability scales from, in no particular order (see Ability Stat Sub-object)
* `effects` - the effects the ability has, in order (`effect` can be BasicAttack, UtilityEscape, SingleTargetAttack, SingleTargetHeal, SingleTargetEnergyHeal, ApplyEffect. if `effectName` is specified in conjuction with ApplyEffect, it will apply that effect to the target)
* `requires` - the tradeskills and levels required to know this skill. 
* `replaces` - optional, the skill this one replaces (by ability id)

###### Ability Stat Sub-object

* `stat` - the stat to scale from
* `multiplier` - the multiplier of the scaling (1.5 = 150% of the `stat`)
* `variance` - the variance of the scaling (0.5 = 50% of the `total`)
* `bonus` - the bonus to add at the end of the math

###### Targetting Information

You _can_ specify `target=All` and `target=AllEnemies` with an effect of `SingleTargetAttack` or `SingleTargetHeal` or `SingleTargetEnergyHeal` or `ApplyEffect`. These are _separate_ things. `SingleTargetAttack` with `target=All` will attack all enemies (and yourself). Think of the effect as the kind of action happening, and the targetting being who it's happening to. 

##### Adding a New Status Effect

Effects require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `color` - a hex color to be shown for the status effect
* `turnsLeft` - how many turns the status effect should last - set to -1 to make it last forever
* `statusEffectType` - the type of the status effect (StatModification, DamageOverTime)
* `statModifications` - if `statusEffectType` is StatModification, this can be specified to boost the stats of the target by the specified amounts
* `damageOverTime` - if `statusEffectType` is DamageOverTime, this can be specified to deal the specified amount of damage to the target each turn (negative values = healing)

Note:

If you choose to modify speed, it works the opposite of other stats - negative speed = faster.

##### Adding a New Enemy

Enemies require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `health` - the max health of the enemy
* `energy` - the max energy of the enemy
* `idleChance` - the chance the enemy will idle (do nothing) each turn
* `stats` - the stats the enemy has - see enemies for how to declare this, and see Stats for the valid stats
* `abilities` - the abilities the enemy has - see enemies for how to declare this, and see Abilities for the valid abilities
* `drops` - the items the enemy drops - see enemies for how to declare this, and see Items for the valid items, and Resource for the valid resources

##### Adding a New Threat

Threats require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `maxSkillGainLevel` - the level at which the threat stops giving skill gain
* `level` - the range of levels the threat will be valid for the player (`min`, `max`)
* `enemies` - the enemies the threat will spawn - see threats for how to declare this, and see Enemies for the valid enemies

##### Adding a New Dungeon

Dungeons require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file
* `givesPointAtCombatLevel` - the level at which the dungeon will give a point
* `floors` - the floors the dungeon has - see dungeons for how to declare this, and see Dungeon Nodes for a listing of valid node names
* `boss` - the threat name of the boss of the dungeon (when beaten, the player will be given a point and exit the dungeon)
* `threats` - a mapping of keys to threat names - the keys will be placed in the floor layout, and the threat names must be threats that exist
* `treasureChests` - a mapping of keys to the possible rewards given by the chest - each type of chest can have a randomized set of rewards, and they can have multiple rewards (see examples)



### Icons

Icons must be SVGs (at this time). When adding an SVG, please make sure there are no `fill` attributes in it - this will make it so the browser can style them correctly to match the theme of the game.

### Themes

Themes must use CSS, and should encapsulate their variables and other global changes under the global theme class. The theme `value` should be in one of the CSS files, as `theme-${value}`. See the Hackerman theme for an example.

### Sound Effects

Sound effects must be named the same as the what they are in the game. They can't be configured otherwise, and must match to override the default sound effects. The list of sounds in the game are as follows:

- `action-sell.wav`
- `combat-effect.wav`
- `combat-hit-enemy.wav`
- `combat-hit-player.wav`
- `combat-lose.wav`
- `combat-win.wav`
- `dungeon-win.wav`
- `tradeskill-finish-alchemy.wav`
- `tradeskill-finish-blacksmithing.wav`
- `tradeskill-finish-cooking.wav`
- `tradeskill-finish-farming.wav`
- `tradeskill-finish-fishing.wav`
- `tradeskill-finish-foraging.wav`
- `tradeskill-finish-hunting.wav`
- `tradeskill-finish-jewelcrafting.wav`
- `tradeskill-finish-logging.wav`
- `tradeskill-finish-mining.wav`
- `tradeskill-finish-prospecting.wav` (used when failing)
- `tradeskill-finish-weaving.wav`
- `tradeskill-finish.wav` (unused)
- `tradeskill-start-alchemy.wav`
- `tradeskill-start-blacksmithing.wav`
- `tradeskill-start-cooking.wav`
- `tradeskill-start-farming.wav`
- `tradeskill-start-fishing.wav`
- `tradeskill-start-foraging.wav`
- `tradeskill-start-hunting.wav`
- `tradeskill-start-jewelcrafting.wav`
- `tradeskill-start-logging.wav`
- `tradeskill-start-mining.wav`
- `tradeskill-start-prospecting.wav`
- `tradeskill-start-weaving.wav`
- `tradeskill-start.wav` (unused)

### Zip File

Once you have your mod ready to go, make sure to zip it up as a zip file.

## Submitting a Mod

Set up [a new mod on mod.io](https://mod.io/g/world-seller/m/add/), and make sure to upload your zip file here. Additionally, **make sure you use the version field**. If you don't, the game won't know to prompt the user to update your mod. By default, the version will be imported as `0.0.0`, and will not be updateable until the mod has a different version available.

Once the mod is submitted, it should show up in the game!

## Sample Mods

You can find some sample mods [on the test.mod.io site](https://worldseller.test.mod.io/). These are mods that we used to test the system, and are fairly simple, but can show you how to structure a mod or set up the content.
