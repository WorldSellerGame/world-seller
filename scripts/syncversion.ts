
const packageJson = require('../package.json');
const electronPackageJson = require('../electron/package.json');

electronPackageJson.version = packageJson.version;
require('fs').writeFileSync('./electron/package.json', JSON.stringify(electronPackageJson, null, 2));

console.log('Updated Electron version!');
