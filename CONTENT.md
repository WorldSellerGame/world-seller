# Rarities

* Broken
* Junk
* Common
* Uncommon
* Rare
* Epic
* Legendary

# Item Categories

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

# Stats

* `pickaxePower` - time reduction on mining (a 10 second node with a power of 3 becomes a 7 second node)
* `axePower` - time reduction on logging
* `fishingPower` - time reduction on fishing
* `scythePower` - time reduction on harvesting
* `huntingPower` - time reduction on hunting
* `pickaxeSpeed` - cooldown reduction on mining (a 10 second cooldown with a power of 3 becomes a 7 second cooldown)
* `axeSpeed` - cooldown reduction on logging
* `fishingSpeed` - cooldown reduction on fishing
* `scytheSpeed` - cooldown reduction on harvesting
* `huntingSpeed` - cooldown reduction on hunting
* `armor` - physical damage reduction
* `healing` - boost to healing skills
* `attack` - boost to physical damage
* `speed` - how fast the creature goes in combat, relative to other creatures
* `healthBonus` - boost to the creatures max health
* `energyBonus` - boost to the creatures max energy
* `healingPerRound` - how much health the creature regenerates per round
* `energyPerRound` - how much energy the creature regenerates per round
* `healingPerCombat` - how much health the creature regenerates per combat (at the start)
* `energyPerCombat` - how much energy the creature regenerates per combat (at the start)

# Dungeon Nodes

* `e` - the entrance of the current floor (can be used to go back to the previous floor, or leave)
* `x` - the exit of the current floor (will go to the next floor)
* `f` - a bonfire, will heal the player fully
* `b` - the boss of the dungeon - if there are multiple, any boss killed will end the dungeon
* `.` - wall - non-traversible
* `1` - floor - traversible

# Adding a New Resource

1. Add the resource under the corresponding tradeskill in the `content/resources` folder (file names are used purely for organization).

Resources require:

* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `rarity` - the rarity of the resource (see Rarities)
* `category` - the category of the resource (see Item Categories)


# Adding a New Item

1. Add the item under the corresponding tradeskill in the `content/items` folder (file names are used purely for organization).

Items require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `type` - the type of the item (Pickaxe, Axe, FishingRod, FishingBait, Scythe, HuntingTool, Weapon, LegArmor, ChestArmor, HeadArmor, FootArmor, HandArmor, Jewelry, Food, Potion)
* `category` - the rarity of the item (see Item Categories)
* `durability` - how many uses the item can take (`-1` = infinite)
* `value` - how much the item sells for (base; selling via shop sells it for 3x this value to start)
* `givesAbility` - optional, the ability the item gives (by ability name)
* `stats` - the stats the item gives - see items for how to declare this, and see Stats for the valid stats
* `foodDuration` - optional, if specified, the item can be used as a food for combat and will give its `stats` every combat

# Adding a New Gathering Location

1. Add the location under the corresponding tradeskill in the `content/` folder (file names are used here for the specific tradeskill they give content for).

Gathering requires:

* `name` - shown in game
* `description` - shown in game
* `perGather` - how many resources are gathered per gather (`min`, `max`)
* `level` - the level required to gather here (`min`, `max`)
* `gatherTime` - how long it takes to gather from this node (in seconds)
* `resources` - the resources that can be gathered from this node (by resource name; see other nodes for how to declare this)
* `maxWorkers` - how many workers can gather from this node at once

# Adding a New Recipe

1. Add the recipe under the corresponding tradeskill in the `content/` folder (file names are used here for the specific tradeskill they give content for).

Recipes require:

* `result` - shown in game, the item or resource crafted
* `perCraft` - how many items are crafted per craft (`min`, `max`)
* `level` - the level required to craft this (`min`, `max`)
* `craftTime` - how long it takes to craft this item (in seconds)
* `ingredients` - the ingredients required to craft this item (by resource name; see other recipes for how to declare this)
* `require` - an array of strings, each of which is a requirement for this recipe to be available and visible (see other recipes for examples)
* `preserve` - an array of strings, each of which is NOT consumed when creating this item (crafting tables f.ex.)
* `maxWorkers` - how many workers can craft this item at once

# Adding a New Ability

1. Add the ability under any file in the `content/abilities` folder (file names are used here are purely organizational).

Abilities require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `target` - the target of the ability (Self, Ally [for enemies], Single [single target, opposite side], All, AllEnemies)
* `type` - the type of the ability (Physical, Magical)
* `cooldown` - how long the ability is on cooldown for (in turns)
* `energyCost` - how much energy the ability costs
* `stats` - the stats the ability scales from, in no particular order (see Ability Stat Sub-object)
* `effects` - the effects the ability has, in order (`effect` can be BasicAttack, UtilityEscape, SingleTargetAttack, SingleTargetHeal, ApplyEffect. if `effectName` is specified in conjuction with ApplyEffect, it will apply that effect to the target)
* `requires` - the tradeskills and levels required to know this skill. 
* `replaces` - optional, the skill this one replaces (by ability id)

## Ability Stat Sub-object

* `stat` - the stat to scale from
* `multiplier` - the multiplier of the scaling (1.5 = 150% of the `stat`)
* `variance` - the variance of the scaling (0.5 = 50% of the `stat`)
* `bonus` - the bonus to add at the end of the math

## Targetting Information

You _can_ specify `target=All` and `target=AllEnemies` with an effect of `SingleTargetAttack` or `SingleTargetHeal` or `ApplyEffect`. These are _separate_ things. `SingleTargetAttack` with `target=All` will attack all enemies (and yourself). Think of the effect as the kind of action happening, and the targetting being who it's happening to. 



# Adding a New Status Effect

1. Add the effect under any file in the `content/effects` folder (file names are used here are purely organizational).

Effects require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `color` - a hex color to be shown for the status effect
* `turnsLeft` - how many turns the status effect should last
* `statusEffectType` - the type of the status effect (StatModification, DamageOverTime)
* `statModifications` - if `statusEffectType` is StatModification, this can be specified to boost the stats of the target by the specified amounts
* `damageOverTime` - if `statusEffectType` is DamageOverTime, this can be specified to deal the specified amount of damage to the target each turn (negative values = healing)

Note:

If you choose to modify speed, it works the opposite of other stats - negative speed = faster.

# Adding a New Enemy

1. Add the enemy under any file in the `content/enemies` folder (file names are used here are purely organizational).

Enemies require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `health` - the max health of the enemy
* `energy` - the max energy of the enemy
* `idleChance` - the chance the enemy will idle (do nothing) each turn
* `stats` - the stats the enemy has - see enemies for how to declare this, and see Stats for the valid stats
* `abilities` - the abilities the enemy has - see enemies for how to declare this, and see Abilities for the valid abilities
* `drops` - the items the enemy drops - see enemies for how to declare this, and see Items for the valid items, and Resource for the valid resources

# Adding a New Threat

1. Add the threat under any file in the `content/threats` folder (file names are used here are purely organizational).

Threats require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `maxSkillGainLevel` - the level at which the threat stops giving skill gain
* `level` - the range of levels the threat will be valid for the player (`min`, `max`)
* `enemies` - the enemies the threat will spawn - see threats for how to declare this, and see Enemies for the valid enemies

# Adding a New Dungeon

1. Add the dungeon under any file in the `content/dungeons` folder (file names are used here are purely organizational, _but_ consider naming them in order with a brief description, e.g. `1-goblin` for "level 1" and "there are goblins here").

Dungeons require:

* `name` - shown in game
* `description` - shown in game
* `icon` - the name of the SVG file in `src/assets/icon`
* `givesPointAtCombatLevel` - the level at which the dungeon will give a point
* `floors` - the floors the dungeon has - see dungeons for how to declare this, and see Dungeon Nodes for a listing of valid node names
* `boss` - the threat name of the boss of the dungeon (when beaten, the player will be given a point and exit the dungeon)
* `threats` - a mapping of keys to threat names - the keys will be placed in the floor layout, and the threat names must be threats that exist
* `treasureChests` - a mapping of keys to the possible rewards given by the chest - each type of chest can have a randomized set of rewards, and they can have multiple rewards (see examples)
