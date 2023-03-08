/* eslint-disable */
const path = require('path');
const fs = require('fs');

module.exports = {
  packagerConfig: {
    executableName: 'world-seller',
    appBundleId: 'com.world.seller',
    appCopyright: 'World Seller Team',
    appCategoryType: 'public.app-category.games',
    icon: './icons/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: './icons/icon.ico',
        setupIcon: './icons/icon.ico',
        setupExe: 'World Seller.exe'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './icons/icon.icns',
        setupIcon: './icons/icon.icns',
      },
    }
  ],
  hooks: {
    postMake: (config, makeResults) => {
      makeResults.forEach(result => {
        result.artifacts.forEach(artifactPath => {
          const fileName = path.basename(artifactPath);
          const dirName = path.dirname(artifactPath);
          const extName = path.extname(fileName);

          const finalPath = path.join(dirName, `WorldSeller${extName}`);
          fs.copyFileSync(artifactPath, finalPath);
          fs.rmSync(artifactPath);
        });
      });

      return makeResults;
    }
  }
};
