## [0.1.10](https://github.com/WorldSellerGame/world-seller/compare/v0.1.9...v0.1.10) (2023-03-31)


### Bug Fixes

* **analytics:** fix analytics not sending correct events in some cases ([02feb89](https://github.com/WorldSellerGame/world-seller/commit/02feb89dd31b7c918111c23d1cfca1a2f273cce1))
* **analytics:** worker page should track alloc/unalloc ([e8a863b](https://github.com/WorldSellerGame/world-seller/commit/e8a863bca5b7c2ff17a447777ce0ae468a9d941e))
* **beginner:** beginner notifications for unlocking various content will no longer fire multiple times ([8dd47b1](https://github.com/WorldSellerGame/world-seller/commit/8dd47b1296e44a7236829e582b068152f5ca50ac))
* **character:** health/energy maxes are now reflected properly when changing gear; remove health bonus/energy bonus stat from equipment dropdown ([60f2e19](https://github.com/WorldSellerGame/world-seller/commit/60f2e19ccb6169bdc24bef6fd5c339395bfac1fc))
* **combat:** cauterize can actually kill you ([d27907d](https://github.com/WorldSellerGame/world-seller/commit/d27907d193e7244956d79288be399897bec70fc3))
* **combat:** display turnsLeft=-1 as ∞ ([db6f070](https://github.com/WorldSellerGame/world-seller/commit/db6f070b71fbe46a613e928c3fe396e45c55e26a))
* **combat:** if an ability is removed from the game, it will not cause loadout errors ([ce8a90e](https://github.com/WorldSellerGame/world-seller/commit/ce8a90ea5a99dfc23d6c034586886d42322b2546))
* **dungeon:** can no longer heal by entering a dungeon ([6ad963b](https://github.com/WorldSellerGame/world-seller/commit/6ad963bb933c7ab7121044c4901401aea932ccc8))
* **dungeon:** you can no longer change equipment while in a dungeon ([a55e534](https://github.com/WorldSellerGame/world-seller/commit/a55e534eb573bb3bd66d211e497805241dd6fe53))
* **gathering:** add scrollbar to gathering cards ([50a133f](https://github.com/WorldSellerGame/world-seller/commit/50a133f41abd96dd8284a68a66d27658a36c1bb3))
* **gathering:** inconsistent card heights ([2fffecb](https://github.com/WorldSellerGame/world-seller/commit/2fffecba97485a27e844ba84b5f9c980afacd6bc))
* **gathering:** show hhmmss for gathering nodes ([8bf133b](https://github.com/WorldSellerGame/world-seller/commit/8bf133b3c2ca936c50607b308b4083ddd911c288))
* **mercantile:** shop multiplier should multiply correctly ([21fa11f](https://github.com/WorldSellerGame/world-seller/commit/21fa11fc797d0871806fc52e85f73714f8f99761))
* **mercantile:** upgrading stockpile will no longer do it twice for one click ([ccb48d0](https://github.com/WorldSellerGame/world-seller/commit/ccb48d08941bd8121e76b51b0dd640a9b79ebb49))
* **ui:** alerts should be wider in some cases, and confirms should be correctly-sized ([4a74e4f](https://github.com/WorldSellerGame/world-seller/commit/4a74e4f07deda2119d77622b253e2e73d54bc0ab))
* **ui:** improved rarity color readability ([902dd7f](https://github.com/WorldSellerGame/world-seller/commit/902dd7f9d3d048fafa2c71570f7263d880a6083b))
* **worker:** workers will now correctly craft items ([f677838](https://github.com/WorldSellerGame/world-seller/commit/f67783859e372f829eb1f79aaf2968a4a0cb1827))
* **worker:** workers will now take from stockpile instead of inventory ([40585d6](https://github.com/WorldSellerGame/world-seller/commit/40585d607d2494906a0903e4ec12db866d52d895))


### Features

* **analytics:** better tracking of coin gain/loss ([c8bf441](https://github.com/WorldSellerGame/world-seller/commit/c8bf44156e297eda5b831fe00113d2745c332cc0))
* **analytics:** track achievement stat gains globally ([f28d318](https://github.com/WorldSellerGame/world-seller/commit/f28d318f925ecc7d49e075743cda0843ae3192b8))
* **analytics:** track worker activity ([64eef39](https://github.com/WorldSellerGame/world-seller/commit/64eef393aec9c8c7ca0b607c8fbd358af4a286ce))
* **combat:** show buff duration on bar instead of hiding in tooltip ([13d70e4](https://github.com/WorldSellerGame/world-seller/commit/13d70e4388514c0b88bf5bdbcfa523cadf493b3e))
* **debug:** add debugging tools to get every item and resource ([2f6cc42](https://github.com/WorldSellerGame/world-seller/commit/2f6cc42fc474dcdd7779cdc0718399f2d10fcbe6))
* **farming:** increase farming plots. change design to be cooler and more epic. ([f3b767e](https://github.com/WorldSellerGame/world-seller/commit/f3b767e96f1ed91f7345da655c9b02a7bed487bd))
* **gathering:** better indicators for allocated workers ([6a2aed2](https://github.com/WorldSellerGame/world-seller/commit/6a2aed24f46ee78e2854b6e02914c4d334822344))
* **gathering:** show worker progress on nodes; slim cooldown text ([ffc7b89](https://github.com/WorldSellerGame/world-seller/commit/ffc7b8941f884b4ad72a3e70a5bd574db8e73fdc))
* **mercantile,inventory:** add functionality to multi select and send items/sell items ([4a71290](https://github.com/WorldSellerGame/world-seller/commit/4a71290904c2e8730e9e4a32207d255c5920dc45))
* **mercantile:** add shopkeep recovery speed ([905deca](https://github.com/WorldSellerGame/world-seller/commit/905decab697e4f93b7158145107a52c225687500))
* **mercantile:** workers scale their mercantile efforts based on the work they put in for an item ([f9136c1](https://github.com/WorldSellerGame/world-seller/commit/f9136c1449756304216dbab5f6a588bdff3acdc4))
* **refining:** refining can now type in numbers ([411eb0f](https://github.com/WorldSellerGame/world-seller/commit/411eb0ffc14f63c957c89602f46ccb83e90f2e1b))
* **sfx:** add unique sfx categories for each tradeskill [not yet utilized]. add sfx for farming/prospecting ([6e04b49](https://github.com/WorldSellerGame/world-seller/commit/6e04b49d8930b8abc7cd5cd4658f9110f76f219d))
* **skills:** notify user when they learn a new skill ([7b4bee2](https://github.com/WorldSellerGame/world-seller/commit/7b4bee2610cf2b8baee1f330a83e2974dd8b2e2b))
* **ui:** add 'you' indicator so the player knows that inventory/resources are theirs ([88d567e](https://github.com/WorldSellerGame/world-seller/commit/88d567e96abf0ef3abc47784bebf623c411c73d6))
* **ui:** add message history area ([709963b](https://github.com/WorldSellerGame/world-seller/commit/709963beb752d3bbe9d9241f13976e0a6b4ca53c))
* **worker:** workers will never consume items needed for another workers refinement process ([391ded7](https://github.com/WorldSellerGame/world-seller/commit/391ded777b665598488afe9432f9fc78a3f312f5))



