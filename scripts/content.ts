
const path = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const yaml = require('js-yaml');

const loadItems = async () => {
  fs.ensureDirSync('src/assets/content');

  const files = await readdir('content/data');
  files.forEach((file: any) => {
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    fs.writeJson(`src/assets/content/${path.basename(file, '.yml')}.json`, data);
  });

  console.log('☑ Content loaded.');
};

loadItems();
