
const path = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');

const validCategories = ['Tools', 'Armor', 'Foods', 'Jewelry', 'Potions', 'Seeds', 'Miscellaneous', 'Raw Materials', 'Refined Materials'];

const validRarities = ['Junk', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

const validItemTypes = ['Pickaxe', 'Axe', 'FishingRod', 'FishingBait', 'Scythe', 'HuntingTool', 'LegArmor', 'ChestArmor', 'HeadArmor', 'FootArmor', 'HandArmor', 'Jewelry', 'Food', 'Potion'];

const loadContent = async () => {

  let hasBad = false;

  const allResources = await fs.readJson('src/assets/content/resources.json');
  const allItems = await fs.readJson('src/assets/content/items.json');

  Object.keys(allResources).forEach(key => {
    const resource = allResources[key];
    if(!validCategories.includes(resource.category)) {
      console.log(`⚠ Resource ${key} has an invalid category ${resource.category}.`);
      hasBad = true;
    }

    if(!validRarities.includes(resource.rarity)) {
      console.log(`⚠ Resource ${key} has an invalid rarity ${resource.rarity}.`);
      hasBad = true;
    }
  });

  Object.keys(allItems).forEach(key => {
    const item = allItems[key];

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
  });

  const isValidItem = (item: string) => {
    return item === 'nothing' || allResources[item] || allItems[item];
  }

  const files = await readdir('src/assets/content', ['items.json', 'resources.json']);
  files.forEach(async (file: string) => {
    const data = await fs.readJson(file);

    const { recipes, transforms, locations } = data;

    (recipes || []).forEach((recipe: any) => {
      const result = recipe.result;

      if(!isValidItem(result)) {
        console.log(`⚠ Recipe result ${result} is not a valid resource or item.`);
        hasBad = true;
      }

      Object.keys(recipe.ingredients).forEach(ingredient => {
        if(!isValidItem(ingredient)) {
          console.log(`⚠ Recipe ingredient ${ingredient} is not a valid resource or item.`);
          hasBad = true;
        }
      });
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

    (locations || []).forEach((location: any) => {
      const resources = location.resources;
      resources.forEach((resource: any) => {
        const name = resource.name;
        if(!isValidItem(name)) {
          console.log(`⚠ Location resource ${name} is not a valid resource or item.`);
          hasBad = true;
        }
      });
    });
  });

  if(hasBad) {
    process.exit(1);
  }

  console.log('☑ Items validated.');
};

loadContent();
