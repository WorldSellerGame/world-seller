module.exports = {
  packagerConfig: {
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
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './icons/icon.icns',
        icon: './icons/icon.icns',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './icons/icon.png',
        setupIcon: './icons/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: './icons/icon.png',
        setupIcon: './icons/icon.png',
      },
    },
  ],
};
