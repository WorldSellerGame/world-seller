
const path = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const { isUndefined, isArray, isNumber } = require('lodash');

const validCategories = ['Tools', 'Armor', 'Foods', 'Jewelry', 'Potions', 'Seeds', 'Miscellaneous', 'Raw Materials', 'Refined Materials', 'Crafting Tables', 'Weapons'];

const validRarities = ['Junk', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

const validItemTypes = ['Pickaxe', 'Axe', 'FishingRod', 'FishingBait', 'Scythe', 'HuntingTool', 'LegArmor', 'ChestArmor', 'HeadArmor', 'FootArmor', 'HandArmor', 'Jewelry', 'Food', 'Potion', 'Weapon'];

const validStats = [
  'pickaxePower', 'axePower', 'fishingPower', 'scythePower', 'huntingPower',
  'pickaxePowerPercent', 'axePowerPercent', 'fishingPowerPercent', 'scythePowerPercent', 'huntingPowerPercent',
  'pickaxeSpeed', 'axeSpeed', 'fishingSpeed', 'scytheSpeed', 'huntingSpeed',
  'pickaxeSpeedPercent', 'axeSpeedPercent', 'fishingSpeedPercent', 'scytheSpeedPercent', 'huntingSpeedPercent',
  'armor', 'mitigation', 'healing', 'energyHealing', 'attack', 'energyBonus', 'healthBonus', 'health', 'speed',
  'healingPerRound', 'healingPerCombat', 'energyPerRound', 'energyPerCombat'
];

const validTargets = ['Single', 'Self', 'AllEnemies', 'Ally', 'All'];

const validStatusTypes = ['StatModification', 'DamageOverTime'];

const validateIcon = (icon: string) => {
  return fs.existsSync(`src/assets/icon/${icon}.svg`);
};

const loadContent = async () => {

  let hasBad = false;

  const allResources = await fs.readJson('src/assets/content/resources.json');
  const allItems = await fs.readJson('src/assets/content/items.json');
  const allAbilities = await fs.readJson('src/assets/content/abilities.json');
  const allEnemies = await fs.readJson('src/assets/content/enemies.json');
  const allThreats = await fs.readJson('src/assets/content/threats.json');
  const allEffects = await fs.readJson('src/assets/content/effects.json');
  const allDungeons = await fs.readJson('src/assets/content/dungeons.json');

  const farming = await fs.readJson('src/assets/content/farming.json');

  const resourceNames: Record<string, boolean> = {};
  Object.keys(allResources).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Resource ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const resource = allResources[key];
    if(!resource.name) {
      console.log(`⚠ Resource ${key} has no name.`);
      hasBad = true;
    }

    if(resource.name && resourceNames[resource.name]) {
      console.log(`⚠ Resource ${key} has a duplicate name ${resource.name}.`);
      hasBad = true;
    }

    resourceNames[resource.name] = true;

    if(resource.name && resource.name.length > 32) {
      console.log(`⚠ Resource ${key} has a name that is too long (>32 characters).`);
      hasBad = true;
    }

    if(!validCategories.includes(resource.category)) {
      console.log(`⚠ Resource ${key} has an invalid category ${resource.category}.`);
      hasBad = true;
    }

    if(!validRarities.includes(resource.rarity)) {
      console.log(`⚠ Resource ${key} has an invalid rarity ${resource.rarity}.`);
      hasBad = true;
    }

    if(!validateIcon(resource.icon)) {
      console.log(`⚠ Resource ${key} has an invalid icon ${resource.icon}.`);
      hasBad = true;
    }

    if(resource.category === 'Seeds') {
      const transform = farming.transforms.find((x: any) => x.startingItem === key);

      if(!transform) {
        console.log(`⚠ Seed ${key} is not used in any farming transforms.`);
        hasBad = true;
      }

      if(transform) {
        transform.becomes.forEach(({ name }: any) => {
          if(!allItems[name] && !allResources[name]) {
            console.log(`⚠ Seed ${key} transforms into ${name} which does not exist.`);
            hasBad = true;
          }
        });
      }
    }
  });

  const itemNames: Record<string, boolean> = {};
  Object.keys(allItems).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Item ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const item = allItems[key];

    if(!item.name) {
      console.log(`⚠ Item ${key} has no name.`);
      hasBad = true;
    }

    if(item.name && itemNames[item.name]) {
      console.log(`⚠ Item ${key} has a duplicate name ${item.name}.`);
      hasBad = true;
    }

    itemNames[item.name] = true;

    if(item.name && item.name.length > 32) {
      console.log(`⚠ Item name ${item.name} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!validCategories.includes(item.category)) {
      console.log(`⚠ Item ${key} has an invalid category ${item.category}.`);
      hasBad = true;
    }

    if(!validRarities.includes(item.rarity)) {
      console.log(`⚠ Item ${key} has an invalid rarity ${item.rarity}.`);
      hasBad = true;
    }

    if(!validItemTypes.includes(item.type)) {
      console.log(`⚠ Item ${key} has an invalid type ${item.type}.`);
      hasBad = true;
    }

    if(isUndefined(item.value)) {
      console.log(`⚠ Item ${key} is missing value.`);
      hasBad = true;
    }

    if(!validateIcon(item.icon)) {
      console.log(`⚠ Item ${key} has an invalid icon ${item.icon}.`);
      hasBad = true;
    }

    Object.keys(item.stats || {}).forEach(stat => {
      if(!validStats.includes(stat)) {
        console.log(`⚠ Item ${key} has an invalid stat ${stat}.`);
        hasBad = true;
      }

      if(!isNumber(item.stats[stat])) {
        console.log(`⚠ Item ${key} has a non-number stat ${stat}.`);
        hasBad = true;
      }
    });
  });

  const abilityNames: Record<string, boolean> = {};
  Object.keys(allAbilities).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Ability ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const skill = allAbilities[key];

    if(!skill.name) {
      console.log(`⚠ Ability ${key} has no name.`);
      hasBad = true;
    }

    if(skill.name && abilityNames[skill.name]) {
      console.log(`⚠ Ability ${key} has a duplicate name ${skill.name}.`);
      hasBad = true;
    }

    abilityNames[skill.name] = true;

    if(skill.name && skill.name.length > 32) {
      console.log(`⚠ Ability ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!skill.description) {
      console.log(`⚠ Ability ${key} has no description.`);
      hasBad = true;
    }

    if(!skill.icon) {
      console.log(`⚠ Ability ${key} has no icon.`);
      hasBad = true;
    }

    if(!validTargets.includes(skill.target)) {
      console.log(`⚠ Ability ${key} has an invalid target.`);
      hasBad = true;
    }

    if(!skill.type) {
      console.log(`⚠ Ability ${key} has an invalid type.`);
      hasBad = true;
    }

    if(!validateIcon(skill.icon)) {
      console.log(`⚠ Ability ${key} has an invalid icon ${skill.icon}.`);
      hasBad = true;
    }

    skill.stats.forEach((stat: any) => {
      if(!stat.stat) {
        console.log(`⚠ Ability ${key} has a stat with no stat set.`);
        hasBad = true;
      }

      if(!stat.multiplier || isNaN(stat.multiplier)) {
        console.log(`⚠ Ability ${key} has a stat with an invalid (non-numeric) multiplier.`);
        hasBad = true;
      }

      if(!stat.variance && isNaN(stat.variance)) {
        console.log(`⚠ Ability ${key} has a stat with an invalid (non-numeric) variance.`);
        hasBad = true;
      }

      if(stat.bonus && isNaN(stat.bonus)) {
        console.log(`⚠ Ability ${key} has a stat with an invalid (non-numeric) bonus.`);
        hasBad = true;
      }
    })

  });

  const enemyNames: Record<string, boolean> = {};
  Object.keys(allEnemies).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Ability ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const enemy = allEnemies[key];

    if(!enemy.name) {
      console.log(`⚠ Enemy ${key} has no name.`);
      hasBad = true;
    }

    if(enemy.name && enemyNames[enemy.name]) {
      console.log(`⚠ Enemy ${key} has a duplicate name ${enemy.name}.`);
      hasBad = true;
    }

    enemyNames[enemy.name] = true;

    if(enemy.name && enemy.name.length > 32) {
      console.log(`⚠ Enemy ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!enemy.description) {
      console.log(`⚠ Enemy ${key} has no description.`);
      hasBad = true;
    }

    if(!enemy.icon) {
      console.log(`⚠ Enemy ${key} has no icon.`);
      hasBad = true;
    }

    if(!enemy.health) {
      console.log(`⚠ Enemy ${key} has no health.`);
      hasBad = true;
    }

    if(!enemy.energy) {
      console.log(`⚠ Enemy ${key} has no energy.`);
      hasBad = true;
    }

    if(!validateIcon(enemy.icon)) {
      console.log(`⚠ Enemy ${key} has an invalid icon ${enemy.icon}.`);
      hasBad = true;
    }

    Object.keys(enemy.stats).forEach(stat => {
      if(!validStats.includes(stat)) {
        console.log(`⚠ Enemy ${key} has an invalid stat ${stat}.`);
        hasBad = true;
      }

      if(!isNumber(enemy.stats[stat])) {
        console.log(`⚠ Item ${key} has a non-number stat ${stat}.`);
        hasBad = true;
      }
    });

    enemy.abilities.forEach((ability: string) => {
      if(!allAbilities[ability]) {
        console.log(`⚠ Enemy ${key} has an ability for ${ability} which is not a valid ability.`);
        hasBad = true;
      }
    });

    enemy.drops.forEach((drop: any) => {
      if(drop.item && !allItems[drop.item]) {
        console.log(`⚠ Enemy ${key} has a drop for ${drop.item} which is not a valid item.`);
        hasBad = true;
      }

      if(drop.resource && !allResources[drop.resource]) {
        console.log(`⚠ Enemy ${key} has a drop for ${drop.resource} which is not a valid resource.`);
        hasBad = true;
      }
    });
  });

  const threatNames: Record<string, boolean> = {};
  Object.keys(allThreats).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Threat ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const threat = allThreats[key];

    if(!threat.name) {
      console.log(`⚠ Threat ${key} has no name.`);
      hasBad = true;
    }

    if(threat.name && threatNames[threat.name]) {
      console.log(`⚠ Threat ${key} has a duplicate name ${threat.name}.`);
      hasBad = true;
    }

    threatNames[threat.name] = true;

    if(threat.name && threat.name.length > 32) {
      console.log(`⚠ Threat ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!threat.description) {
      console.log(`⚠ Threat ${key} has no description.`);
      hasBad = true;
    }

    if(!threat.icon) {
      console.log(`⚠ Threat ${key} has no icon.`);
      hasBad = true;
    }

    if(!threat.maxSkillGainLevel) {
      console.log(`⚠ Threat ${key} has no maxSkillGainLevel.`);
      hasBad = true;
    }

    if(!threat.level.max) {
      console.log(`⚠ Threat ${key} has no level range max.`);
      hasBad = true;
    }

    if(!validateIcon(threat.icon)) {
      console.log(`⚠ Threat ${key} has an invalid icon ${threat.icon}.`);
      hasBad = true;
    }

    threat.enemies.forEach((enemy: string) => {
      if(!allEnemies[enemy]) {
        console.log(`⚠ Threat ${key} has an enemy for ${enemy} which is not a valid enemy.`);
        hasBad = true;
      }
    })
  });

  const effectNames: Record<string, boolean> = {};
  Object.keys(allEffects).forEach(key => {
    if(key.length > 32) {
      console.log(`⚠ Effect ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    const effect = allEffects[key];

    if(!effect.name) {
      console.log(`⚠ Effect ${key} has no name.`);
      hasBad = true;
    }

    if(effect.name && effectNames[effect.name]) {
      console.log(`⚠ Effect ${key} has a duplicate name ${effect.name}.`);
      hasBad = true;
    }

    effectNames[effect.name] = true;

    if(effect.name && effect.name.length > 32) {
      console.log(`⚠ Effect ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!effect.description) {
      console.log(`⚠ Effect ${key} has no description.`);
      hasBad = true;
    }

    if(!effect.icon) {
      console.log(`⚠ Effect ${key} has no icon.`);
      hasBad = true;
    }

    if(!effect.color) {
      console.log(`⚠ Effect ${key} has no color.`);
      hasBad = true;
    }

    if(!effect.turnsLeft) {
      console.log(`⚠ Effect ${key} has no turns left.`);
      hasBad = true;
    }

    if(!validStatusTypes.includes(effect.statusEffectType)) {
      console.log(`⚠ Effect ${key} has an invalid type.`);
      hasBad = true;
    }

    if(!validateIcon(effect.icon)) {
      console.log(`⚠ Effect ${key} has an invalid icon ${effect.icon}.`);
      hasBad = true;
    }

    Object.keys(effect.statModifications || {}).forEach(stat => {
      if(!validStats.includes(stat)) {
        console.log(`⚠ Effect ${key} has an invalid stat ${stat}.`);
        hasBad = true;
      }
    });
  })

  const dungeonNames: Record<string, boolean> = {};
  Object.keys(allDungeons).forEach(key => {
    const dungeon = allDungeons[key];

    if(!dungeon.name) {
      console.log(`⚠ Dungeon ${key} has no name.`);
      hasBad = true;
    }

    if(dungeon.name && dungeonNames[dungeon.name]) {
      console.log(`⚠ Dungeon ${key} has a duplicate name ${dungeon.name}.`);
      hasBad = true;
    }

    dungeonNames[dungeon.name] = true;

    if(dungeon.name && dungeon.name.length > 32) {
      console.log(`⚠ Dungeon ${key} is too long (>32 characters).`);
      hasBad = true;
    }

    if(!dungeon.description) {
      console.log(`⚠ Dungeon ${key} has no description.`);
      hasBad = true;
    }

    if(!dungeon.icon) {
      console.log(`⚠ Dungeon ${key} has no icon.`);
      hasBad = true;
    }

    if(!dungeon.givesPointAtCombatLevel) {
      console.log(`⚠ Dungeon ${key} has no givesPointAtCombatLevel.`);
      hasBad = true;
    }

    if(!dungeon.boss) {
      console.log(`⚠ Dungeon ${key} has no boss.`);
      hasBad = true;
    }

    if(!allThreats[dungeon.boss]) {
      console.log(`⚠ Dungeon ${key} has a boss for ${dungeon.boss} which is not a valid threat.`);
      hasBad = true;
    }

    if(!dungeon.floors || dungeon.floors.length === 0) {
      console.log(`⚠ Dungeon ${key} has no floors.`);
      hasBad = true;
    }

    dungeon.floors.forEach((floor: any) => {
      if(!floor.name) {
        console.log(`⚠ Dungeon ${key} has a floor with no name.`);
        hasBad = true;
      }

      if(!floor.layout || floor.layout.length === 0) {
        console.log(`⚠ Dungeon ${key} has a floor with no layout.`);
        hasBad = true;
      }

      floor.layout.forEach((row: any[]) => {
        row.forEach((cell: any) => {
          const baseCells = ['.', 1, 'e', 'x', 'b', 'f'];
          if(baseCells.includes(cell)) return;

          if(dungeon.threats[cell]) return;
          if(dungeon.treasureChests[cell]) return;

          console.log(`⚠ Dungeon ${key} has a floor with an invalid cell ${cell}.`);
          hasBad = true;
        });
      });
    });

    Object.values(dungeon.threats || {}).forEach(threat => {
      if(!allThreats[threat as string]) {
        console.log(`⚠ Dungeon ${key} has a threat for ${threat} which is not a valid threat.`);
        hasBad = true;
      }
    });

    Object.values(dungeon.treasureChests || {}).forEach((chest: any) => {
      chest.forEach((chestConfig: any) => {
        const { drops } = chestConfig;

        if(!drops || !drops.length) {
          console.log(`⚠ Dungeon ${key} has a chest with no drops.`);
          hasBad = true;
        }

        (drops || []).forEach((drop: any) => {
          if(drop.item && !allItems[drop.item]) {
            console.log(`⚠ Dungeon ${key} has a drop for ${drop.item} which is not a valid item.`);
            hasBad = true;
          }

          if(drop.resource && !allResources[drop.resource]) {
            console.log(`⚠ Dungeon ${key} has a drop for ${drop.resource} which is not a valid resource.`);
            hasBad = true;
          }

          if(!drop.amount) {
            console.log(`⚠ Dungeon ${key} has a drop with no amount.`);
            hasBad = true;
          }
        });
      });
    });
  });

  const isValidResource = (item: string) => {
    return allResources[item];
  }

  const isValidItem = (item: string) => {
    return item === 'nothing' || isValidResource(item) || allItems[item];
  }

  const files = await readdir('src/assets/content', ['items.json', 'resources.json']);
  files.forEach(async (file: string) => {
    const data = await fs.readJson(file);

    const { recipes, transforms, locations } = data;

    const allRecipeResults: Record<string, boolean> = {};

    (recipes || []).forEach((recipe: any) => {
      if(allRecipeResults[recipe.result]) {
        console.log(`⚠ Result ${recipe.result} is a duplicate.`);
        hasBad = true;
      }

      allRecipeResults[recipe.result] = true;

      const result = recipe.result;

      if(!isValidItem(result)) {
        console.log(`⚠ Recipe result ${result} is not a valid resource or item.`);
        hasBad = true;
      }

      if(recipe.require && !isArray(recipe.require)) {
        console.log(`⚠ Recipe ${result} require is not an array.`);
        hasBad = true;
      }

      if(recipe.preserve && !isArray(recipe.preserve)) {
        console.log(`⚠ Recipe ${result} preserve is not an array.`);
        hasBad = true;
      }

      Object.keys(recipe.ingredients).forEach(ingredient => {
        if(!isValidItem(ingredient)) {
          console.log(`⚠ Recipe ingredient ${ingredient} is not a valid resource.`);
          hasBad = true;
        }
      });

      if(isUndefined(recipe.maxWorkers)) {
        console.log(`⚠ Recipe ${recipe.name} is missing maxWorkers.`);
        hasBad = true;
      }
    });

    (transforms || []).forEach((transform: any) => {
      const startingItem = transform.startingItem;
      if(!isValidItem(startingItem)) {
        console.log(`⚠ Transform starting item ${startingItem} is not a valid resource or item.`);
        hasBad = true;
      }

      transform.becomes.forEach(({ name }: any) => {
        if(!isValidItem(name)) {
          console.log(`⚠ Transform result ${name} is not a valid resource or item.`);
          hasBad = true;
        }
      });
    });

    const allLocationNames: Record<string, boolean> = {};

    (locations || []).forEach((location: any) => {
      if(allLocationNames[location.name]) {
        console.log(`⚠ Location ${location.name} is a duplicate.`);
        hasBad = true;
      }

      allLocationNames[location.name] = true;

      const resources = location.resources;
      resources.forEach((resource: any) => {
        const name = resource.name;
        if(!isValidItem(name)) {
          console.log(`⚠ Location resource ${name} is not a valid resource or item.`);
          hasBad = true;
        }
      });

      if(isUndefined(location.maxWorkers)) {
        console.log(`⚠ Location ${location.name} is missing maxWorkers.`);
        hasBad = true;
      }
    });
  });

  if(hasBad) {
    process.exit(1);
  }

  console.log('☑ Items validated.');
};

loadContent();
