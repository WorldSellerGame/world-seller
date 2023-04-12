# [0.2.0](https://github.com/WorldSellerGame/world-seller/compare/v0.1.10...v0.2.0) (2023-04-12)


### Bug Fixes

* **asset:** fix moss svg. update svg validator to factor in other strange potential circumstances ([10a9852](https://github.com/WorldSellerGame/world-seller/commit/10a98527c2a986edaca0ea1a8554b332b399d4ac))
* **cloud:** cloud savefiles should use latest save, not highest level ([8cc1b2d](https://github.com/WorldSellerGame/world-seller/commit/8cc1b2ddfbfef8d3fd473dfe2857820566c959c9))
* **combat:** only add log messages if a combat is going on ([4fd0430](https://github.com/WorldSellerGame/world-seller/commit/4fd0430b727c51bb1f8b17f702bdf1ef6c762eca))
* **content:** quartz copper tongue piercing should require the copper tongue piercing ([c4bc2f7](https://github.com/WorldSellerGame/world-seller/commit/c4bc2f7566a832dcc6665bdd262a2bbd4bba2027))
* **core:** content service should load before the rest of the app ([f1e6573](https://github.com/WorldSellerGame/world-seller/commit/f1e6573820c7b9528daa627f65098d43d05a7f17))
* **core:** discovering things works again ([7d16ae5](https://github.com/WorldSellerGame/world-seller/commit/7d16ae543ca53cff087b67dd73762e63a947e0f6))
* **error:** error handler will no longer fire on .netlify.app; somehow this triggers a lot of random errors, probably since it's a headless browser ([8a52bcc](https://github.com/WorldSellerGame/world-seller/commit/8a52bccf00f9bb9b7cb8621896e5271df95a0ab9))
* **gathering:** remove change detection because cooldown number doesnt go down correctly ([3cac7b8](https://github.com/WorldSellerGame/world-seller/commit/3cac7b8d42ea2831ece64626a17b0e7adcb1b7fd))
* **import:** importing a character will no longer reset all options and mods; it will preserve whatever options and mods are currently locally set/installed, but it still will not save them ([babefa4](https://github.com/WorldSellerGame/world-seller/commit/babefa401977a67fa10994728219d69b5dd8f940))
* **item,resource:** add real-name component to look up real names of items ([da1939b](https://github.com/WorldSellerGame/world-seller/commit/da1939ba499276132d24adf46a630f2610559183))
* **item:** add blank item stats for reasons ([e926c2f](https://github.com/WorldSellerGame/world-seller/commit/e926c2f6f21f9c16be86b760a4394a52ff2976b5))
* **item:** items should show the lower sell value to reduce confusion ([2bcdb1f](https://github.com/WorldSellerGame/world-seller/commit/2bcdb1fa201e230f3138e99e96d940fe5394345d))
* **mod:** mods shouldnt break the ui anymore ([79e545d](https://github.com/WorldSellerGame/world-seller/commit/79e545d533870459890b0c92490ff80a63c8e01b))
* **refining:** time resource should have commas ([0d066ec](https://github.com/WorldSellerGame/world-seller/commit/0d066ec7c8209967a87c8556209a04c52fd763a4))
* **theme:** specify white for refining form field edits, hopefully make them show up correctly ([76490f7](https://github.com/WorldSellerGame/world-seller/commit/76490f7811b1f293af6aba5b2a10b58348ffb84e))
* **transmutation:** add item rarity to transmutation page ([00a4e1c](https://github.com/WorldSellerGame/world-seller/commit/00a4e1ca9f5c3f7754c5272926b5c57b22a18962))
* **worker:** workers will not take preserved items ([30bf04f](https://github.com/WorldSellerGame/world-seller/commit/30bf04f27a32d25edef5270ca182f73be2d9e883))


### Features

* **cloud:** add cloud save syncing ([d0d2142](https://github.com/WorldSellerGame/world-seller/commit/d0d21423f2e2f45125422f00c8b52f5ad75a18bb))
* **equip:** improve equip interface ([9c996ed](https://github.com/WorldSellerGame/world-seller/commit/9c996ede2e81152bf46966d887a3f894e6cd503a))
* **farming:** farming now supports workers and an upgrade for it ([cc2f076](https://github.com/WorldSellerGame/world-seller/commit/cc2f076ce04d94a715d9f54a09a20a7dcd6aafb5))
* **gathering:** gathering will tell you if you're gathering somewhere else ([496fbf1](https://github.com/WorldSellerGame/world-seller/commit/496fbf1c1bddc4a0665e62b54d3f52157fc09587))
* **settings:** add setting to hide notifications ([23c529e](https://github.com/WorldSellerGame/world-seller/commit/23c529e17bd4318d14b645f0221ac4e59392d0e9))
* **ui:** better inline-notify per tradeskill ([907cf33](https://github.com/WorldSellerGame/world-seller/commit/907cf3345632734c1e2389fc9b4a38ee0ff15025))
* **updates:** add download/play link at bottom of auto update notes ([475af7b](https://github.com/WorldSellerGame/world-seller/commit/475af7b3b9e616c99379657a1a1601ff638cf8c3))
* **validator:** add validation to make sure everything in game is creatable ([c76c90f](https://github.com/WorldSellerGame/world-seller/commit/c76c90f5344b80b2bce3fccca1c0d78faa9002e1))
* **worker:** workers will now show what ingredients they're missing when crafting ([d61fea0](https://github.com/WorldSellerGame/world-seller/commit/d61fea058366bf0311c692496e98c5c7365397bd))



