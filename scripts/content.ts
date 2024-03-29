const { merge } = require('lodash');

const path = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const yaml = require('js-yaml');

const loadItems = async () => {
  fs.ensureDirSync('src/assets/content');

  const gatheringFiles = fs.readdirSync('content/data/tradeskills/gathering');
  gatheringFiles.forEach(async (gatheringSkill: string) => {
    const files = await readdir(`content/data/tradeskills/gathering/${gatheringSkill}`);
    const data: any[] = [];

    files.forEach((file: string) => {
      const fileData = yaml.load(fs.readFileSync(file, 'utf8'));
      data.push(...fileData);
    });

    fs.writeJson(`src/assets/content/${gatheringSkill}.json`, { locations: data });
  });

  const refiningFiles = fs.readdirSync('content/data/tradeskills/refining');
  refiningFiles.forEach(async (refiningSkill: string) => {
    const files = await readdir(`content/data/tradeskills/refining/${refiningSkill}`);
    const data: any[] = [];

    files.forEach((file: string) => {
      const fileData = yaml.load(fs.readFileSync(file, 'utf8'));
      data.push(...fileData);
    });

    fs.writeJson(`src/assets/content/${refiningSkill}.json`, { recipes: data });
  });

  ['farming', 'prospecting'].forEach(async transformTradeskill => {
    const files = await readdir(`content/data/tradeskills/peripheral/${transformTradeskill}`);
    const data: any[] = [];

    files.forEach((file: string) => {
      const fileData = yaml.load(fs.readFileSync(file, 'utf8'));
      data.push(...fileData);
    });

    fs.writeJson(`src/assets/content/${transformTradeskill}.json`, { transforms: data });
  });

  await Promise.all(['items', 'resources'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['misc'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);
    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      fs.writeJson(`src/assets/content/${path.basename(file, '.yml')}.json`, data);
    });
  }));

  await Promise.all(['abilities'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['enemies'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['effects'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['threats'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['dungeons'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData: Record<string, any> = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      allData[data.name] = data;
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  await Promise.all(['achievements'].map(async folder => {
    const files = await readdir(`content/data/${folder}`);

    const allData: Record<string, any> = {};

    files.forEach((file: string) => {
      const data = yaml.load(fs.readFileSync(file, 'utf8'));
      merge(allData, data);
    });

    fs.writeJson(`src/assets/content/${folder}.json`, allData);
  }));

  console.log('☑ Content loaded.');
};

loadItems();
