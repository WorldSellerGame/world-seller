## [0.2.1](https://github.com/WorldSellerGame/world-seller/compare/v0.2.0...v0.2.1) (2023-04-19)


### Bug Fixes

* **combat:** fix issue where sometimes abilityref doesn't exist ([1c6b0dc](https://github.com/WorldSellerGame/world-seller/commit/1c6b0dc8001f03e83dcd5c14e478c3dd51f43828))
* **cooking:** recipes will no longer erroneously consume oven mitts ([3d9b1d8](https://github.com/WorldSellerGame/world-seller/commit/3d9b1d88483dcdcd037504110b6b4effd0b23754))
* **farming:** adjust worker time for farms down to 1800 from 3600 ([4c85556](https://github.com/WorldSellerGame/world-seller/commit/4c85556029a0b2dc5c5aa9fb293ec111916abef0))
* **import:** dont export game object; it can override cloud settings and cause weird interface errors ([8b39e2f](https://github.com/WorldSellerGame/world-seller/commit/8b39e2f3ca3e23a2417cb65cf27e14757f6656c1))
* **import:** importing a character no longer clears farming workers ([39aecb4](https://github.com/WorldSellerGame/world-seller/commit/39aecb4b3dc0e9a738795411defe49d0d3fd7ba6))
* **item:** validator will not let require/preserve pass if the item is invalid. fix adamantite ingot recipe ([5b40af9](https://github.com/WorldSellerGame/world-seller/commit/5b40af91f6d4c0aacc34e8d03bf5a501f6b7b2cd))
* **refining:** adamantite ingot will no longer consume a normal furnace ([1701c1f](https://github.com/WorldSellerGame/world-seller/commit/1701c1f98c32af7076c37c051a9df4af745595a6))
* **refining:** refining items will no longer show ??? as the item name ([4bd026f](https://github.com/WorldSellerGame/world-seller/commit/4bd026fd4cff774e409fe3eba505d1c8b40bf54f))
* **spoon:** spoon theme secondary color is a bit darker ([c9520db](https://github.com/WorldSellerGame/world-seller/commit/c9520db2d29505a8ab2bdbdfb8e1c482e2cbe7aa))


### Features

* **analytics:** track player unlocks ([947926f](https://github.com/WorldSellerGame/world-seller/commit/947926f0ea07d28c478f4628c93f7348c1246507))
* **combat:** add hotkey support to abilities in combat ([1a691fc](https://github.com/WorldSellerGame/world-seller/commit/1a691fc660789716fa251249dbd014801a0ea4d9))
* **combat:** rework combat ui to be less vertical ([0e2d0de](https://github.com/WorldSellerGame/world-seller/commit/0e2d0de20e3d9a1c17e6a396b6c6f450d1be2bd5))
* **core:** allow tradeskill data to be split into multiple files for maintainability ([4f581db](https://github.com/WorldSellerGame/world-seller/commit/4f581dbc203da5962a397ab054de148800624697))
* **food:** food lasts +5 combats longer on average ([7e8dd26](https://github.com/WorldSellerGame/world-seller/commit/7e8dd26f2882cc22f6eb054dcd2eb93a21433248))
* **food:** rework some foods, reorganize them internally, closes [#148](https://github.com/WorldSellerGame/world-seller/issues/148) ([5bb5fa5](https://github.com/WorldSellerGame/world-seller/commit/5bb5fa50579060bbe19b71fd4fd0df974d3b96d7))
* **gathering:** add beginner nodes ([495369e](https://github.com/WorldSellerGame/world-seller/commit/495369e4b9d8bccfe7591e312a667553fc8487e1))
* **gathering:** rebalance gathering tools. add fishing bait. ([d3c964a](https://github.com/WorldSellerGame/world-seller/commit/d3c964abe099330d7e1765e715f0dc8c4c820941))
* **inventory,stockpile:** add select all button ([b360fc8](https://github.com/WorldSellerGame/world-seller/commit/b360fc89575be5083b348f53594ab103f33c7def))
* **inventory,stockpile:** show 'click for actions' on items that are clickable ([87d40f7](https://github.com/WorldSellerGame/world-seller/commit/87d40f713dc165c0d33bc9ed699f60859c5dae5e))
* **jewelcrafting:** reorganize jewelry files. add adamantite jewelry ([da61368](https://github.com/WorldSellerGame/world-seller/commit/da613685e19c740039a9dd19d6f68a8f1bc2362e))
* **ui:** coin gain now shows under mercantile area ([51c4100](https://github.com/WorldSellerGame/world-seller/commit/51c4100a357dac29cb2c88317748d90088d89dd6))
* **workers:** show workers allocated to a tradeskill in sidebar ([3dc0317](https://github.com/WorldSellerGame/world-seller/commit/3dc0317f3cf5b74f4298750a41baf14e9fb54831))



