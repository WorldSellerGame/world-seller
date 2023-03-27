## [0.1.4](https://github.com/WorldSellerGame/world-seller/compare/v0.1.3...v0.1.4) (2023-03-27)


### Bug Fixes

* **build:** build process should put files on itch properly ([43c080c](https://github.com/WorldSellerGame/world-seller/commit/43c080ca7c870b8be517f9d08c772e0ec7cae516))
* **combat:** if you have no threats and are level 0, generate some ([4c5ab50](https://github.com/WorldSellerGame/world-seller/commit/4c5ab50dae33da49e90c321a0c48c001b5ee33ad))
* **mod:** modio token should default to 1 year even if not set ([153585c](https://github.com/WorldSellerGame/world-seller/commit/153585c85fde0572cc635140ede082d3230c35be))
* **updates:** blog post update file should be formatted correctly ([3697957](https://github.com/WorldSellerGame/world-seller/commit/3697957b8f70bbe417baedef41e45f81e41e7a48))



## [0.1.3](https://github.com/WorldSellerGame/world-seller/compare/v0.1.2...v0.1.3) (2023-03-27)



## [0.1.2](https://github.com/WorldSellerGame/world-seller/compare/v0.1.1...v0.1.2) (2023-03-27)


### Bug Fixes

* **settings:** re-enable sound options for non-dev environments ([c88be7d](https://github.com/WorldSellerGame/world-seller/commit/c88be7d12eb94f7b0ea6a4f11c75f6c83154c6da))
* **ui:** round timers better in general ([a8cb999](https://github.com/WorldSellerGame/world-seller/commit/a8cb999ce56b96ec984b7bb3a63fccf72efeae4c))
* **workers:** workers now operate at 95% efficiency of the player ([dc8da4f](https://github.com/WorldSellerGame/world-seller/commit/dc8da4f6cd2695a735b72e3092f69b77b2cafb8b))


### Features

* **refining:** clarify UI about items that are preserved vs consumed when crafting ([98d74c2](https://github.com/WorldSellerGame/world-seller/commit/98d74c2839e0bb03b6577eaa00d3a114e0cfc499))



## [0.1.1](https://github.com/WorldSellerGame/world-seller/compare/v0.1.0...v0.1.1) (2023-03-27)



# [0.1.0](https://github.com/WorldSellerGame/world-seller/compare/v0.0.6...v0.1.0) (2023-03-27)


### Bug Fixes

* **achievements:** achievements are now sorted by name ([f9fdd9f](https://github.com/WorldSellerGame/world-seller/commit/f9fdd9f01700c1fa06f93544c2fadfb3c1ae7518))
* **achievements:** canceling recipes should not give achievement progress ([1d5f3b4](https://github.com/WorldSellerGame/world-seller/commit/1d5f3b4935803f349c119ea88140a195389d51bd))
* **analytics:** track navigate analytics better ([c7b4bb4](https://github.com/WorldSellerGame/world-seller/commit/c7b4bb47c77dba746de80f1ee853dbdd7e52acb8))
* **combat:** buffs and debuffs will no longer tick if combat is won by someone. closes [#117](https://github.com/WorldSellerGame/world-seller/issues/117) ([c04771b](https://github.com/WorldSellerGame/world-seller/commit/c04771b1c06df8bacea614d0a5260ca35ec26ced))
* **combat:** can no longer eat food while in combat ([649de45](https://github.com/WorldSellerGame/world-seller/commit/649de450d27d6fe2e12ece2a8d6c732bce0a7a96))
* **combat:** combat items/food in loadout should only color the name, not all of the text ([4af36cb](https://github.com/WorldSellerGame/world-seller/commit/4af36cb46c37f2364216318ccbee5552e429bbf5))
* **combat:** ending combat should clear player buffs ([f8398f7](https://github.com/WorldSellerGame/world-seller/commit/f8398f71ba403270c7dcaf05b5fca0999e924a1c))
* **combat:** energy-changing buffs do not apply current health any longer ([9c0ca4a](https://github.com/WorldSellerGame/world-seller/commit/9c0ca4a496101cb4a10bf2438a31cf8b368ae8b7))
* **combat:** escape should mark combat as ending ([6b66274](https://github.com/WorldSellerGame/world-seller/commit/6b66274b18f8857691fc898c0ba2c087a359e8ff))
* **combat:** fix buff alignment for enemies ([d395f2c](https://github.com/WorldSellerGame/world-seller/commit/d395f2c251a021be2c7ed76352c409d6a99b456b))
* **combat:** healPerRound on enemies should correctly show healing on enemy. closes [#127](https://github.com/WorldSellerGame/world-seller/issues/127) ([4bec6c9](https://github.com/WorldSellerGame/world-seller/commit/4bec6c9fd57efa41e6424cac2dd06207dd1794fa))
* **combat:** items cannot take energy even if their referenced ability does ([7a88e90](https://github.com/WorldSellerGame/world-seller/commit/7a88e90a11833006b9f094f7d04e6fe252c7c411))
* **combat:** items should show the effect name, not key ([47b6ec1](https://github.com/WorldSellerGame/world-seller/commit/47b6ec1baffc1312b3a5cd548abe971f22cf6862))
* **combat:** items with multiple effects will trigger correctly ([d8bb5db](https://github.com/WorldSellerGame/world-seller/commit/d8bb5db806964a87ed88d4c053866c4dc7c59b7e))
* **combat:** NaN should no longer happen for any delta applier. closes [#126](https://github.com/WorldSellerGame/world-seller/issues/126) ([9f6b92f](https://github.com/WorldSellerGame/world-seller/commit/9f6b92f31351acacde0a83b8d0394c54145f12a4))
* **combat:** only some stats have to stay at 1. rest can go back to 0 when an effect unapplies. closes [#111](https://github.com/WorldSellerGame/world-seller/issues/111) ([2123918](https://github.com/WorldSellerGame/world-seller/commit/2123918063371679804963b9d49087c1530469fa))
* **combat:** speed calculations should be correct now. closes [#119](https://github.com/WorldSellerGame/world-seller/issues/119) ([500c0f7](https://github.com/WorldSellerGame/world-seller/commit/500c0f7511301d73f9403f158fa023bac1ee7c88))
* **combat:** undefined mitigation causes problems ([4b545eb](https://github.com/WorldSellerGame/world-seller/commit/4b545eb462c33eee75e4a81787a971b6276d62fb))
* **combat:** using items on self should also not cost energy ([08b749e](https://github.com/WorldSellerGame/world-seller/commit/08b749e65292b39a542d04ecbb5b36ef091edd20))
* **combat:** you can't die from multiple dots at once ([73143d4](https://github.com/WorldSellerGame/world-seller/commit/73143d4c0d20c7a7aa91bb88a9081981e72019fb))
* **core:** instead of watching . and having the CLI refresh every 10 seconds, watch src again and copy the changelog files. laziness ftl. closes [#121](https://github.com/WorldSellerGame/world-seller/issues/121) ([076120b](https://github.com/WorldSellerGame/world-seller/commit/076120b7702f8b34db04c157dd58eb75db908f2e))
* **core:** load all core icons at startup ([735cd3e](https://github.com/WorldSellerGame/world-seller/commit/735cd3eb9ef93ff7eb98384a3e9e16e6b4ba2a44))
* **debug:** debug menu should be position: fixed ([5473633](https://github.com/WorldSellerGame/world-seller/commit/54736331ceb4154bd01ac88b38b5552bbbfc5013))
* **discord:** fix combat discord status attachment ([ae862b7](https://github.com/WorldSellerGame/world-seller/commit/ae862b7202327d2bdc3d705072daab82784a8ab9))
* **dungeon:** dungeon maps will correctly track the players viewport ([b9d9080](https://github.com/WorldSellerGame/world-seller/commit/b9d90806bf313dea497114ecdcbc2e914483e3a8))
* **dungeon:** dungeons no longer let you eat food ([cb0d9a7](https://github.com/WorldSellerGame/world-seller/commit/cb0d9a7b0139d39fce1f882fbfde45d982830f81))
* **dungeon:** embark color should actually indicate when you get a skill point ([ccdbff7](https://github.com/WorldSellerGame/world-seller/commit/ccdbff7ec8f275f33a55ea2bf18ae8e20db9e16e))
* **dungeon:** make fire a more visible color ([a31cfdb](https://github.com/WorldSellerGame/world-seller/commit/a31cfdb0c714f28deba973dfc9a0c1c1eaaf9746))
* **dungeon:** no standing still to heal in a dungeon ([968531d](https://github.com/WorldSellerGame/world-seller/commit/968531de8d12fdc5cacc7fe7c6c4458f29d50f0d))
* **edibles:** items that only restore energy should be able to be eaten ([40e8e14](https://github.com/WorldSellerGame/world-seller/commit/40e8e144929c3228377df64099e5c07fbc722e49))
* **exchange:** default exchange rate for rarity:same is 2:1, closes [#115](https://github.com/WorldSellerGame/world-seller/issues/115) ([ee3af62](https://github.com/WorldSellerGame/world-seller/commit/ee3af629c2108039ebbf6e7ce2d3e178006f024c))
* **gathering:** gathering pages should perform better ([d977d18](https://github.com/WorldSellerGame/world-seller/commit/d977d188232be4d1c11794de7a8813c34196ea52))
* **gathering:** not all gathering is fishing ([d625374](https://github.com/WorldSellerGame/world-seller/commit/d625374ceeba5cc6be2cd42ccf5b6e6c23eacf5d))
* **inventory,mercantile:** inventory/stockpile page will no longer reset category when an item leaves ([61524fd](https://github.com/WorldSellerGame/world-seller/commit/61524fddc004b502a3f0ba44aa7d1d8bb998ecd6))
* **item:** food duration is now migrated correctly ([0cc2b49](https://github.com/WorldSellerGame/world-seller/commit/0cc2b4905681b1bf773a3a66fcafb210a7dcabc1))
* **items:** items now- have separate effects/abilities, are more distinct when in/out of combat ([aa12001](https://github.com/WorldSellerGame/world-seller/commit/aa12001ebedd95c1e6c85d08c3893b7209328cbc))
* **items:** make item healing come from new properties, not stats ([856c600](https://github.com/WorldSellerGame/world-seller/commit/856c600356c3bd9dc53e41b53857f38700547ade))
* **loadout:** can now select potions again for item loadout ([6746983](https://github.com/WorldSellerGame/world-seller/commit/674698351c4d8ba507d2628d06583557fd51dd4d))
* **loadout:** fix learned skills replacing old skills ([3e1d352](https://github.com/WorldSellerGame/world-seller/commit/3e1d35276518d60a15382ce3a0f77493e66374a9))
* **loadout:** loadout page should perform better with larger numbers of items ([ea2e229](https://github.com/WorldSellerGame/world-seller/commit/ea2e2296bfc476e5084063354658a1563b572a78))
* **loadout:** loadout should properly migrate items when they change ([3e43e23](https://github.com/WorldSellerGame/world-seller/commit/3e43e239f250bd55728e8a468b204df3efbbaff2))
* **loadout:** no flicker when unslotting something using x ([cf248cb](https://github.com/WorldSellerGame/world-seller/commit/cf248cba634f0ca6b3581a200b4370f32f28c371))
* **mods:** fix mod unsub for mods that don't have themes ([1ec1c2e](https://github.com/WorldSellerGame/world-seller/commit/1ec1c2ec4cb4aa317e053a05fbdae84034b5ca1c))
* **mods:** mods should load tags correctly from all categories ([b07dd7e](https://github.com/WorldSellerGame/world-seller/commit/b07dd7eeb969286345d228d4bc16e0f92b9cf6c3))
* **recipe:** mortar should preserve, not consume, the table ([8641257](https://github.com/WorldSellerGame/world-seller/commit/8641257dc5639307ba147af0a2a6b2705568b2f3))
* **refining:** perf improvements ([5f0b8af](https://github.com/WorldSellerGame/world-seller/commit/5f0b8af4706a1ba99f5fab4ecdc8c1b699871dc3))
* **refining:** refining should update when hitting craft ([d5e3e42](https://github.com/WorldSellerGame/world-seller/commit/d5e3e42d697319b866581176d8db0ef3d40e3ffd))
* **refining:** wrap when ingredient list is cut off ([4ad2244](https://github.com/WorldSellerGame/world-seller/commit/4ad2244a02d594705f1fbd736f7e751a04dbd9f6))
* **settings:** sound should start at 100% instead of 1%, closes [#114](https://github.com/WorldSellerGame/world-seller/issues/114) ([6a5bf0b](https://github.com/WorldSellerGame/world-seller/commit/6a5bf0b25740d15c1456a6b8da3383d5db6720d8))
* **splash:** add tooltips + better named mods button to homepage ([810d73e](https://github.com/WorldSellerGame/world-seller/commit/810d73e5654b647a62c357b15db6bd36543dd2aa))
* **svg:** add dungeon svgs to preloader. closes [#139](https://github.com/WorldSellerGame/world-seller/issues/139) ([5d2a0d8](https://github.com/WorldSellerGame/world-seller/commit/5d2a0d8ac61c622d8a202bc38c73949f52a15be9))
* **theme:** light theme icons should fill correctly ([73f2383](https://github.com/WorldSellerGame/world-seller/commit/73f2383426d6488d32021e6a7976f72eafaa9259))
* **ui:** better defaults for not overflowing screen size in some pages ([0e974b2](https://github.com/WorldSellerGame/world-seller/commit/0e974b2ceff3094bc23b2ab0d8286b355952af40))
* **ui:** line wrap timers where relevant in app menu ([7f54cb4](https://github.com/WorldSellerGame/world-seller/commit/7f54cb40c919120bd8d84cd47b636825370559f1))
* **validator:** validator disallows duplicate names ([0eff8c5](https://github.com/WorldSellerGame/world-seller/commit/0eff8c5607957338065753051f78a641963647e9))
* **validator:** validator should actually double check names, instead of looking like it double checks duplicate names ([d17b3a2](https://github.com/WorldSellerGame/world-seller/commit/d17b3a2723637738d1b06ed6be9f188e8cffd068))
* **validator:** validator should allow level 0 combat to exist for threats. closes [#113](https://github.com/WorldSellerGame/world-seller/issues/113) ([457972f](https://github.com/WorldSellerGame/world-seller/commit/457972fc2f0f84f45d785cae8cd4e5c9cd15e846))


### Features

* **ability:** add ability bonus damage feature, closes [#140](https://github.com/WorldSellerGame/world-seller/issues/140) ([1e38605](https://github.com/WorldSellerGame/world-seller/commit/1e386053b150796bcaa3e9372de73604f6e77685))
* **achievements:** support hidden achievements. make dungeon achievements hidden. closes [#141](https://github.com/WorldSellerGame/world-seller/issues/141) ([3034963](https://github.com/WorldSellerGame/world-seller/commit/30349635d5c1a0706bd4fe8c49a952090d8ebdf1))
* **automation:** tag workflow should upload to itch now. closes [#120](https://github.com/WorldSellerGame/world-seller/issues/120) ([0de6f81](https://github.com/WorldSellerGame/world-seller/commit/0de6f812637a02aaa971dfc281fac54ceee8a18a))
* **build:** add linux build. ref [#124](https://github.com/WorldSellerGame/world-seller/issues/124) ([3799c0e](https://github.com/WorldSellerGame/world-seller/commit/3799c0e1c60beaf539e623c1b3ee7a260b28bb1f))
* **build:** add osx build. closes [#124](https://github.com/WorldSellerGame/world-seller/issues/124) ([14eb4cf](https://github.com/WorldSellerGame/world-seller/commit/14eb4cf97234730fb171c2c236ce7bc04aee26c2))
* **combat:** combat is now always persisted; you can eat food to heal ooc; new health/energy persistent bars; tooltips are more informative, closes [#144](https://github.com/WorldSellerGame/world-seller/issues/144) ([7b9981c](https://github.com/WorldSellerGame/world-seller/commit/7b9981c39d284362793f6d86a83ff4996b7cbe17))
* **combat:** display equipped foods in combat ([d073f3a](https://github.com/WorldSellerGame/world-seller/commit/d073f3a9ace2ff7a22af854baf9bff7463c86017))
* **combat:** food can now apply effects pre-combat if equipped in food slot ([af1b2d8](https://github.com/WorldSellerGame/world-seller/commit/af1b2d8eb2d978cbe34bde1800e8ba39cd22cfb2))
* **core:** add getStat helper to unify how stats are gotten throughout the game ([29b2018](https://github.com/WorldSellerGame/world-seller/commit/29b20188892fcb248dbec384841f264a156c4c4d))
* **credits:** add credits popup ([d29756b](https://github.com/WorldSellerGame/world-seller/commit/d29756b14c9593ed2b668a686e0393e17d1bb531))
* **debug:** add debug commands to set player health and energy in combat ([592ca74](https://github.com/WorldSellerGame/world-seller/commit/592ca74fdfd49c42f0e5374ab8059fd3274331f4))
* **devtools:** add fightThreat and applyCombatEffectToPlayer, closes [#118](https://github.com/WorldSellerGame/world-seller/issues/118) ([42df3b8](https://github.com/WorldSellerGame/world-seller/commit/42df3b89110c90e21211dadddcd83dfc3efc66a0))
* **devtools:** dev tools go to 600 ticks per tick instead of just 60. closes [#116](https://github.com/WorldSellerGame/world-seller/issues/116) ([c522c79](https://github.com/WorldSellerGame/world-seller/commit/c522c793eeb26f8e23c896056142ad9f71d9129f))
* **dungeon:** can now eat items in dungeon out of combat ([ef2ede2](https://github.com/WorldSellerGame/world-seller/commit/ef2ede25aa672916db60bd4fcb58b4a79e08e81d))
* **equipment:** stats now have a description on the equipment page ([6ec8a47](https://github.com/WorldSellerGame/world-seller/commit/6ec8a47fdb8d16e4927d607dc169e11cbe17deb2))
* **farming:** farming list should perform better ([0b3c7fa](https://github.com/WorldSellerGame/world-seller/commit/0b3c7fa57420af7eaa7d6b3ff49f2649a125bd89))
* **farming:** more clarity on planting page ([e778dad](https://github.com/WorldSellerGame/world-seller/commit/e778dad8a2cdb966b117686338fe757d443ef2e2))
* **farming:** plant area will now have a close option to be consistent ([8f07385](https://github.com/WorldSellerGame/world-seller/commit/8f073859bf868e64edea4fe8135e8e2cde57fd29))
* **food:** food items require durability/duration to be the same; they will go down the same as well ([f342bc8](https://github.com/WorldSellerGame/world-seller/commit/f342bc8037fba3168b610af915170605707dd331))
* **inventory:** add icons to popup for inventory/stockpile views ([c656eb1](https://github.com/WorldSellerGame/world-seller/commit/c656eb170e5028793804b74c1dfd88852d6499b6))
* **item:** stat display for stat lines now matches other stat name displays ([36b12f6](https://github.com/WorldSellerGame/world-seller/commit/36b12f623f8b7318a15cc17e4d9cae9fa5b4ac5e))
* **mercantile:** upgrade stockpile to look like inventory ([1cd9cb2](https://github.com/WorldSellerGame/world-seller/commit/1cd9cb2efe3897898ece5016d5cf4e6f5fe8b8fb))
* **mod:** allow for testing mods locally by uploading a zip file. closes [#137](https://github.com/WorldSellerGame/world-seller/issues/137) ([9e244c8](https://github.com/WorldSellerGame/world-seller/commit/9e244c8a42b84e6dbf5bf7429690ac04850ccad8))
* **mod:** allow mods to add themes ([b5f48cd](https://github.com/WorldSellerGame/world-seller/commit/b5f48cde48c5d88a7a518577b3301bb0c44fbd30))
* **modding:** add mod support ([77c43d7](https://github.com/WorldSellerGame/world-seller/commit/77c43d7ad39758cd60bee356f51a722170e247f0))
* **modding:** add update all mods button. closes [#138](https://github.com/WorldSellerGame/world-seller/issues/138) ([60f8756](https://github.com/WorldSellerGame/world-seller/commit/60f87568ff47989b3beea7b18478e1bd6968ae9f))
* **mods:** mods can now override sound effects ([a4193e6](https://github.com/WorldSellerGame/world-seller/commit/a4193e63be267ec3b254e636435abb009b038dc3))
* **prospecting:** you only get levels in prospecting if you succeed ([2d3ab67](https://github.com/WorldSellerGame/world-seller/commit/2d3ab670e7c0b4257fbfc6743cbe0470a5ad9185))
* **refining:** recipes you havent crafted ~shimmer~ ([71c7cc5](https://github.com/WorldSellerGame/world-seller/commit/71c7cc5f858e8b713bb206f5a97b41fd1733a435))
* **refining:** refining has filters to filter recipes ([960172f](https://github.com/WorldSellerGame/world-seller/commit/960172fc4bc4b7f2fadca4aa5d9067b427b3760d))
* **refining:** refining recipes can now use items [they are consumed whole unless preserved]. closes [#134](https://github.com/WorldSellerGame/world-seller/issues/134) ([05dcec9](https://github.com/WorldSellerGame/world-seller/commit/05dcec947cf750e138ce8d28d0d8968edfb9fbfa))
* **stat:** add single target energy heal option ([a2e39bb](https://github.com/WorldSellerGame/world-seller/commit/a2e39bbd5f08a7ec2fb68cd870e5d0eee63f0e1b))
* **stat:** items can now have % stats that affect gathering speed/reductions ([4824c96](https://github.com/WorldSellerGame/world-seller/commit/4824c9661547bad326b265b04b0a72b74606eac5))
* **stat:** items can now have mitigation, a % damage reduction stat ([e8adc52](https://github.com/WorldSellerGame/world-seller/commit/e8adc529ec45bb5d95f656ce9baf0eec2ab24bdc))
* **tools:** add debug service ([f8fcf61](https://github.com/WorldSellerGame/world-seller/commit/f8fcf6179c25aedc4d28a430811dae9452de6081))
* **ui:** add better tooltips to resources and items in inventory, backpack, stockpile, and refinement interfaces ([3295f51](https://github.com/WorldSellerGame/world-seller/commit/3295f51776ec40966caa864debb60b51576ca8d0))
* **ui:** add version on homepage for easier discerning of current version ([5496250](https://github.com/WorldSellerGame/world-seller/commit/54962501f4d19aba5280f5230203f0763704b053))
* **ui:** refining/gathering should perform better with larger lists ([40ea049](https://github.com/WorldSellerGame/world-seller/commit/40ea04988744a4a9e757b2fe7c2bdc01a395f006))
* **ui:** svgs load instantly and are cached in the browser ([4e641f0](https://github.com/WorldSellerGame/world-seller/commit/4e641f02bb018d0a6d0da45f3b71edea81047017))
* **update:** prompt users in download version to update ([a996194](https://github.com/WorldSellerGame/world-seller/commit/a9961945539a3d5a90d8dcb2b689f98b1b592e38))



## [0.0.6](https://github.com/WorldSellerGame/world-seller/compare/v0.0.5...v0.0.6) (2023-02-24)



## [0.0.5](https://github.com/WorldSellerGame/world-seller/compare/v0.0.4...v0.0.5) (2023-02-24)



## [0.0.4](https://github.com/WorldSellerGame/world-seller/compare/v0.0.3...v0.0.4) (2023-02-24)


### Bug Fixes

* **core:** errors on loading empty game and trying to migrate items ([b7cc657](https://github.com/WorldSellerGame/world-seller/commit/b7cc657aa63c683e8d6305b4751f1f78bfb67078))
* **settings:** better tag display etc ([1743ef1](https://github.com/WorldSellerGame/world-seller/commit/1743ef1b4d4b807dbe4843f933371bec3ca86d91))


### Features

* **build:** add windows build, add build to release ([c674170](https://github.com/WorldSellerGame/world-seller/commit/c67417046c3ea3a91139cbde5a936c16897f672b))
* **information:** add changelog button to home/settings so people can see messages like this. closes [#110](https://github.com/WorldSellerGame/world-seller/issues/110) ([1e95b98](https://github.com/WorldSellerGame/world-seller/commit/1e95b9881ce5e0c3dec7deb67d60234885e58dd7))



## [0.0.3](https://github.com/WorldSellerGame/world-seller/compare/v0.0.2...v0.0.3) (2023-02-23)



## [0.0.2](https://github.com/WorldSellerGame/world-seller/compare/223eba92af274e5e5d052bbf5f5f134eb0a2e3f6...v0.0.2) (2023-02-23)


### Bug Fixes

* **achievements:** better protection against duplicate achievement notifications ([a4680ff](https://github.com/WorldSellerGame/world-seller/commit/a4680fff9dedd9d3551588b2408afac26e533976))
* **characters:** you can only have one character now #grinch ([b2a7aad](https://github.com/WorldSellerGame/world-seller/commit/b2a7aaded1c242597c7a09f814f453ebc0ed76e9))
* **char:** save current character when setting their level ([ecb3654](https://github.com/WorldSellerGame/world-seller/commit/ecb365431b3c59d6943d39ea71f9e85c7949781c))
* **combat:** combat level gain should be fixed ([cd085cc](https://github.com/WorldSellerGame/world-seller/commit/cd085cc9d44f5a6475dd2fd9ee41b6f3318b206e))
* **combat:** combat should exit correctly if you refresh while it's ending. closes [#109](https://github.com/WorldSellerGame/world-seller/issues/109) ([6d5cb03](https://github.com/WorldSellerGame/world-seller/commit/6d5cb03b971b8de42ffaaa3aff46fe9aece44aec))
* **combat:** combat works again ([78a5ddd](https://github.com/WorldSellerGame/world-seller/commit/78a5ddd2743785dec29ad93eb8977266fdcb1e88))
* **combat:** give enemies a chance to take a turn before player can gum up the entire turn list. closes [#106](https://github.com/WorldSellerGame/world-seller/issues/106) ([17be12c](https://github.com/WorldSellerGame/world-seller/commit/17be12cd560e22bad693e0e29bfaa670214822de))
* **combat:** healthBonus and energyBonus now apply correctly from effects ([9034653](https://github.com/WorldSellerGame/world-seller/commit/903465358d83d9b86bcfc876f86652cd452a1e2e))
* **combat:** status effects now correctly unapply based on how much they were actually able to apply. closes [#101](https://github.com/WorldSellerGame/world-seller/issues/101) ([9479c49](https://github.com/WorldSellerGame/world-seller/commit/9479c49007548594931c0fd7142e37ea9f158ee2))
* **combat:** threats are now based on combat level instead of total level. closes [#97](https://github.com/WorldSellerGame/world-seller/issues/97) ([718834d](https://github.com/WorldSellerGame/world-seller/commit/718834d129fc16e7ba03cd1831a33cca578398e6))
* **combat:** when changing to combat or dungeon, the game no longer hides the tabs forcibly, making navigation stay functional when exiting dungeon or combat ([524e305](https://github.com/WorldSellerGame/world-seller/commit/524e3057ab5b20faae0b5dc7d3a0778f4581e161))
* **content:** content can no longer have a duplicate name as another of the same type ([44e18e0](https://github.com/WorldSellerGame/world-seller/commit/44e18e0f277e65e970fe4b6fd2a1b12ea3e460fc))
* **core:** add jewelry slot ([f3c1329](https://github.com/WorldSellerGame/world-seller/commit/f3c13296cf27897cc48bd8a5d6d816fc241bc1b4))
* **core:** add new icons. change some internals to use them. add missing icons to sidebar ([918a316](https://github.com/WorldSellerGame/world-seller/commit/918a316e5fb211a62350d9924ee732e8850ba8c9))
* **core:** add types to everything in content service. closes [#94](https://github.com/WorldSellerGame/world-seller/issues/94) ([d8a0dcc](https://github.com/WorldSellerGame/world-seller/commit/d8a0dcc1eb2f69829a7febf7a2018199228bee71))
* **core:** can gain combat levels from 0. closes [#77](https://github.com/WorldSellerGame/world-seller/issues/77) ([c61a2c9](https://github.com/WorldSellerGame/world-seller/commit/c61a2c94e1b5cfc04c3fefb045f9e667b1817591))
* **core:** check top level properties for files to prevent weird white screen situations ([5b083fe](https://github.com/WorldSellerGame/world-seller/commit/5b083fe44d13cf5fe9dd2e19a7c8584fd7b1dd9f))
* **core:** deleting character will reset all game states ([8c39f3c](https://github.com/WorldSellerGame/world-seller/commit/8c39f3c0b963f0a40d692d740164b6dfab089fe4))
* **core:** don't call SetActiveCharacter every time a tab changes. closes [#90](https://github.com/WorldSellerGame/world-seller/issues/90) ([c4197b2](https://github.com/WorldSellerGame/world-seller/commit/c4197b278f65fbd9200e3f553b953283b6a47baa))
* **core:** merge dispatch calls since arrays work for it, closes [#61](https://github.com/WorldSellerGame/world-seller/issues/61) ([59324b2](https://github.com/WorldSellerGame/world-seller/commit/59324b20908d9d44cc731fd2eadd97cf55f49e83))
* **core:** refactor a bunch of redundant code. closes [#23](https://github.com/WorldSellerGame/world-seller/issues/23) ([edde800](https://github.com/WorldSellerGame/world-seller/commit/edde800690d4f7567acebbf5663392ff5ee82a96))
* **core:** rename dashboard -> resources ([b2f4ba9](https://github.com/WorldSellerGame/world-seller/commit/b2f4ba9037655c6c8201bc0c399fbe150be8a66a))
* **core:** resetting character should reset combat state. closes [#78](https://github.com/WorldSellerGame/world-seller/issues/78) ([a393df2](https://github.com/WorldSellerGame/world-seller/commit/a393df28650efee29a710f94bad37c1011b0854a))
* **core:** some weird error fixes ([687589c](https://github.com/WorldSellerGame/world-seller/commit/687589c5879b1194536e41164460917cd0e07d7f))
* **dashboard:** alphabetize categories ([20fec77](https://github.com/WorldSellerGame/world-seller/commit/20fec77953fd8224deea11d8af66184dddebf26e))
* **effect:** speed buffs swap values, add note in readme. closes [#96](https://github.com/WorldSellerGame/world-seller/issues/96) ([9ce456a](https://github.com/WorldSellerGame/world-seller/commit/9ce456aef232257235eb3e0f13a9b4d0270c77f2))
* **export:** don't export settings with character, to prevent unchangeable dev options from following. closes [#87](https://github.com/WorldSellerGame/world-seller/issues/87) ([f9195a9](https://github.com/WorldSellerGame/world-seller/commit/f9195a954c7822863040e2d08d5fbbc48664560a))
* **farming:** seeds grey out when they don't give experience, closes [#29](https://github.com/WorldSellerGame/world-seller/issues/29) ([2547a8b](https://github.com/WorldSellerGame/world-seller/commit/2547a8b571b662701008c2ce239c196c2cbad033))
* **gathering:** durability for gathering tools works. closes [#44](https://github.com/WorldSellerGame/world-seller/issues/44) ([5120601](https://github.com/WorldSellerGame/world-seller/commit/5120601a7d2cf7176562d2e0e861dfc74169e2e1))
* **home:** home page error when character is nonexistent ([072bb63](https://github.com/WorldSellerGame/world-seller/commit/072bb63ede33ec9643e978605be17859c3d190a3))
* **import:** import process will now migrate savefiles. closes [#107](https://github.com/WorldSellerGame/world-seller/issues/107) ([4a03360](https://github.com/WorldSellerGame/world-seller/commit/4a03360144fcef74b81f57d6cc408cf35ae5032e))
* **migration:** char select migration breaks if you dont return the char correctly. obviously. ([e7f6f6e](https://github.com/WorldSellerGame/world-seller/commit/e7f6f6ee3ae266e24367b05ed7ceb85cb482486a))
* **pwa:** short_name manifest listed the wrong name, closes [#45](https://github.com/WorldSellerGame/world-seller/issues/45) ([8b64ad2](https://github.com/WorldSellerGame/world-seller/commit/8b64ad2ce79a48849ce7e476c0b4c8834b7721ab))
* **refining:** refining skills that call for a preserved item will no longer increase in needed quantity, closes [#52](https://github.com/WorldSellerGame/world-seller/issues/52) ([b5cc498](https://github.com/WorldSellerGame/world-seller/commit/b5cc4989ec7659a68bfaba3540c5fab6eb6b5300))
* **refining:** refunding a recipe should not give you bonus preserved materials ([d9c3f5d](https://github.com/WorldSellerGame/world-seller/commit/d9c3f5d89d8a592fec11a8fc8b12ff87318adcd6))
* **refining:** show # of recipes available in a category, don't allow them to be selected if 0, and dont default to empty tabs. closes [#103](https://github.com/WorldSellerGame/world-seller/issues/103) ([6b9c100](https://github.com/WorldSellerGame/world-seller/commit/6b9c10021cd9cb453605d1f2ad1aebac80dcc0b9))
* **resource:** resources default to common rarity to not throw errors ([d061b62](https://github.com/WorldSellerGame/world-seller/commit/d061b624f9b0c92595aa7bfe7e18dec11a2dd8e1))
* **start:** start characters at level 0. closes [#10](https://github.com/WorldSellerGame/world-seller/issues/10) ([8080876](https://github.com/WorldSellerGame/world-seller/commit/808087672e2025926fc7f5880fa146c452d161d4))
* **state:** internal state dispatches should be more consistent, less redundant ([0b0e22d](https://github.com/WorldSellerGame/world-seller/commit/0b0e22dd2f93b147ab4d99014ddebf35c545d116))
* **stat:** health cannot go below 1, energy cannot go below 0 ([00b878d](https://github.com/WorldSellerGame/world-seller/commit/00b878d9cf1b342cb312a5026bb02533410be62a))
* **stats:** speed is always a minimum of 1, closes [#102](https://github.com/WorldSellerGame/world-seller/issues/102) ([298470a](https://github.com/WorldSellerGame/world-seller/commit/298470a078f3bc76f2ed820189ec3b2915520056))
* **stats:** stat calculation using yml stats should work for every stat ([8a1c255](https://github.com/WorldSellerGame/world-seller/commit/8a1c255c00c4aa4bc26109a99e9bc9a3ae53c4da))
* **ui:** adjust active page indicator to be less bad, closes ([85dafcb](https://github.com/WorldSellerGame/world-seller/commit/85dafcb93cbd9b5fff78dcb2f77a01688837e269)), closes [#16](https://github.com/WorldSellerGame/world-seller/issues/16)
* **ui:** adjust gathering location height. closes [#105](https://github.com/WorldSellerGame/world-seller/issues/105) ([92793cf](https://github.com/WorldSellerGame/world-seller/commit/92793cf0205c8358fbfd49e3498abaa8a9520538))
* **ui:** fill in empty spaces above gathering, closes [#22](https://github.com/WorldSellerGame/world-seller/issues/22) ([3a338df](https://github.com/WorldSellerGame/world-seller/commit/3a338dfd3a4ec12c9e0a051c98cbdb3dfbe00881))
* **ui:** fix bug when moving from inventory to settings to home ([73691f8](https://github.com/WorldSellerGame/world-seller/commit/73691f872882091468c913a4cd5bea1ec4f0f912))
* **ui:** inventory/resources will no longer show items with qty=0 or empty categories ([9ca4e65](https://github.com/WorldSellerGame/world-seller/commit/9ca4e65750a4b066db91d6d7836136327f68fe7e))
* **ui:** items with infinite durability no longer appear broken ([7616f8f](https://github.com/WorldSellerGame/world-seller/commit/7616f8f6e5aa41134af2beb7f3210f8434e85571))
* **ui:** make sidebar more appropriately sized ([7be93e9](https://github.com/WorldSellerGame/world-seller/commit/7be93e9b87ff75dd1891d175f48d5937ac88b064))
* **ui:** random console error with icons sometimes not showing up ([3427967](https://github.com/WorldSellerGame/world-seller/commit/3427967b17d75a83deca4496143b2da40badfac5))
* **validator:** validator should check require/preserve to make sure they're arrays ([2fd7388](https://github.com/WorldSellerGame/world-seller/commit/2fd73881743ed9686a72ee08ee8c4cb8c2a069f2))


### Features

* **achievements:** add achievements. closes [#67](https://github.com/WorldSellerGame/world-seller/issues/67) ([efba245](https://github.com/WorldSellerGame/world-seller/commit/efba2453626e472a391bc42ef8bfb0e91587cc1e))
* **announcements:** add announcement to home page. closes [#89](https://github.com/WorldSellerGame/world-seller/issues/89) ([effa7f5](https://github.com/WorldSellerGame/world-seller/commit/effa7f5fd06c522bfbb3f25b9ae143fee38b5dbd))
* **character:** add export/import, closes [#5](https://github.com/WorldSellerGame/world-seller/issues/5) ([43a3693](https://github.com/WorldSellerGame/world-seller/commit/43a3693f05af49601b5a43420767adc52c8fee70))
* **ci:** add process to make sure seeds have transforms, and that everything about them is valid ([9d7b2ea](https://github.com/WorldSellerGame/world-seller/commit/9d7b2ea5af0ce5f8e657665c36c90bb3d920c4b3))
* **combat:** abilities can now use target=All and target=AllEnemies, closes [#76](https://github.com/WorldSellerGame/world-seller/issues/76) ([b006d25](https://github.com/WorldSellerGame/world-seller/commit/b006d2580ffeb4c24efaa0990148452162339f16))
* **combat:** add 4 new stats. closes [#98](https://github.com/WorldSellerGame/world-seller/issues/98) ([2c90c65](https://github.com/WorldSellerGame/world-seller/commit/2c90c653d8f1d58acad1680802214f43daaa91eb))
* **combat:** add buff support, 4 example buffs ([60abd39](https://github.com/WorldSellerGame/world-seller/commit/60abd391c771713001fed8d6a823826baee8e06c))
* **combat:** add dungeons, closes [#66](https://github.com/WorldSellerGame/world-seller/issues/66) ([808b55e](https://github.com/WorldSellerGame/world-seller/commit/808b55efb62feaca8cb382019eaaa1837d4ed1af))
* **combat:** add food support. closes [#62](https://github.com/WorldSellerGame/world-seller/issues/62) ([b690d48](https://github.com/WorldSellerGame/world-seller/commit/b690d48c354ef3d83b8ab9a497c72f7dddfbfec0))
* **combat:** add item support ([81e2405](https://github.com/WorldSellerGame/world-seller/commit/81e2405ccdbd69ef405d8523a6c4a33d7e8d9dde))
* **combat:** debug mode now shows speed for combat creatures. closes [#100](https://github.com/WorldSellerGame/world-seller/issues/100) ([ab98eca](https://github.com/WorldSellerGame/world-seller/commit/ab98eca7e9a958bbd0f5b3261afd5dbfd543e954))
* **combat:** dungeons will now give points for 10 levels, up until the next dungeon becomes relevant. closes [#99](https://github.com/WorldSellerGame/world-seller/issues/99) ([3133cec](https://github.com/WorldSellerGame/world-seller/commit/3133cec7a92a4fd163a2d38e076b53761e2dbf7c))
* **combat:** items/effects now can be multi-step ([0fe1045](https://github.com/WorldSellerGame/world-seller/commit/0fe10453fbe34a81dab9f1daaf4b2f48ffbeca92))
* **combat:** show floating damage numbers. closes [#85](https://github.com/WorldSellerGame/world-seller/issues/85) ([a093006](https://github.com/WorldSellerGame/world-seller/commit/a093006f98aa489c489454e4114f8bd2da7a7554))
* **combat:** speed will now be random from speed/2 to speed instead of 1..speed ([045ea65](https://github.com/WorldSellerGame/world-seller/commit/045ea6516d3176b1870985ee07ac0cb7d340e591))
* **combat:** status icons now have color, closes [#64](https://github.com/WorldSellerGame/world-seller/issues/64) ([fe3ea88](https://github.com/WorldSellerGame/world-seller/commit/fe3ea884da17482e338225ce0f5b537768928cff))
* **content:** add resource name. closes [#69](https://github.com/WorldSellerGame/world-seller/issues/69) ([2a50d99](https://github.com/WorldSellerGame/world-seller/commit/2a50d996cfc04071c84b9cbe53401a2dd2e58db2))
* **core:** add character creation; update documentation ([223eba9](https://github.com/WorldSellerGame/world-seller/commit/223eba92af274e5e5d052bbf5f5f134eb0a2e3f6))
* **core:** add error handler for debug mode, closes [#60](https://github.com/WorldSellerGame/world-seller/issues/60) ([0f72a5a](https://github.com/WorldSellerGame/world-seller/commit/0f72a5ad6ac3dd5de7433ccc96e3d2ec311316f5))
* **core:** add gameanalytics events for everything. closes [#75](https://github.com/WorldSellerGame/world-seller/issues/75) ([6b86a04](https://github.com/WorldSellerGame/world-seller/commit/6b86a04b5489de816f4efcf2779be1b0df70c403))
* **core:** add more validations ([bcc61bc](https://github.com/WorldSellerGame/world-seller/commit/bcc61bcaa063d23b95dd3be228086aebe13d388d))
* **core:** add svg validation, closes [#39](https://github.com/WorldSellerGame/world-seller/issues/39) ([82b864c](https://github.com/WorldSellerGame/world-seller/commit/82b864c7c0225bf2cc7301ac1cb5aab04fc2f7d5))
* **core:** can now specify stat gain formulae via yaml, closes [#74](https://github.com/WorldSellerGame/world-seller/issues/74) ([a1a835c](https://github.com/WorldSellerGame/world-seller/commit/a1a835c884bb6da45162efbba2f154dc4c5b7336))
* **data:** locations can give more than one per item grab, closes [#25](https://github.com/WorldSellerGame/world-seller/issues/25) ([3ffd67f](https://github.com/WorldSellerGame/world-seller/commit/3ffd67fd8ea135059a7e107222d20cc1582fd2fe))
* **dev:** dev mode timers can go up to 60x faster for quick testing. closes [#24](https://github.com/WorldSellerGame/world-seller/issues/24) ([4eba723](https://github.com/WorldSellerGame/world-seller/commit/4eba7232511a0ecc3b533c8869f3b6022e80ee8c))
* **devtools:** dev tools are enabled for deploy previews ([47e4b37](https://github.com/WorldSellerGame/world-seller/commit/47e4b37e57062ded44c079febd2a54d1c7e19789)), closes [#55](https://github.com/WorldSellerGame/world-seller/issues/55)
* **docs:** document dungeons, dungeon nodes ([3e9a09d](https://github.com/WorldSellerGame/world-seller/commit/3e9a09db1be0389333a03f5109b82f50e1396e4b))
* **equipment:** durability of -1 means it will never break ([4e7a284](https://github.com/WorldSellerGame/world-seller/commit/4e7a284f362b38bae695f33916f244c450f31a80))
* **error:** add error handling. add telemetry opt outs. move global error handler/notifier. add savefile to every error (where possible) for debugging. closes [#83](https://github.com/WorldSellerGame/world-seller/issues/83) ([e0a4ff2](https://github.com/WorldSellerGame/world-seller/commit/e0a4ff2dd6fea85c0322572f62eb02d815cb435d))
* **gathering:** dedicated ui space for status bar, closes [#12](https://github.com/WorldSellerGame/world-seller/issues/12) ([3d19aa5](https://github.com/WorldSellerGame/world-seller/commit/3d19aa5087db1fda0db533cfdade0171ff4e5de6))
* **gathering:** support cooldowns for locations ([946a45a](https://github.com/WorldSellerGame/world-seller/commit/946a45a2c87c5d6b16a1eff11cb0fa2d06e3dff8))
* **home:** add last saved time ([322f2cb](https://github.com/WorldSellerGame/world-seller/commit/322f2cb1315882cdba0e88d469261b94c26a2304))
* **home:** redesign home page a bit, add background ([344ba58](https://github.com/WorldSellerGame/world-seller/commit/344ba5865cb113cd39dda4b810f9d91814eb712b))
* **item:** all items will automatically update/migrate on page load. closes [#59](https://github.com/WorldSellerGame/world-seller/issues/59) ([0058a44](https://github.com/WorldSellerGame/world-seller/commit/0058a44106046fa0d677d4876c843f93c8ac735d))
* **items:** make equipment do stuff. closes [#30](https://github.com/WorldSellerGame/world-seller/issues/30) ([a74abe8](https://github.com/WorldSellerGame/world-seller/commit/a74abe8959658ca47718dd80fe156b04c8041a72))
* **many:** add foraging, fishing, hunting, logging, and updated dashboard view ([525fad9](https://github.com/WorldSellerGame/world-seller/commit/525fad96590f638df2b4598fe139c495f99f17e1))
* **mercantile:** add exchange. closes [#57](https://github.com/WorldSellerGame/world-seller/issues/57) ([b77b3e9](https://github.com/WorldSellerGame/world-seller/commit/b77b3e97b2eb899ba0587c6737c699688f5f9bd4))
* **mercantile:** add workers. add automation. ([72e2cbc](https://github.com/WorldSellerGame/world-seller/commit/72e2cbce5300bd1813bb00bcd2ccf27f4042b5e2))
* **meta:** add good favicon. closes [#2](https://github.com/WorldSellerGame/world-seller/issues/2) ([17aa771](https://github.com/WorldSellerGame/world-seller/commit/17aa77170bd78a5595569180ca7c0644b363e14f))
* **meta:** add meta tags ([1966d67](https://github.com/WorldSellerGame/world-seller/commit/1966d67d08efcb198ac5a4c253bc9d694ce778fa))
* **onboarding:** tradeskills have requirements, which fall back to a discovery system. tradeskills require a player to have discovered a thing now to activate them. there is a new debug option to gracefully migrate to the new system. ([f0f4ae4](https://github.com/WorldSellerGame/world-seller/commit/f0f4ae4930d65f184d0fdfd00b27419bd43515e0)), closes [#65](https://github.com/WorldSellerGame/world-seller/issues/65)
* **ops:** allow for separating resources and items into folders of files. closes [#17](https://github.com/WorldSellerGame/world-seller/issues/17) ([fb8e794](https://github.com/WorldSellerGame/world-seller/commit/fb8e79478d54ee2ed8cc9db9ed829f0b58a0379f))
* **refining:** refining will remember what recipes you know based on if you've discovered the materials rather than if you have them ([e18befc](https://github.com/WorldSellerGame/world-seller/commit/e18befcb023fdb68c32ccd988f433a180541214d))
* **refining:** update refining to show how many of a thing you have. add segmentation to split items/resources. closes [#91](https://github.com/WorldSellerGame/world-seller/issues/91) ([aef52ca](https://github.com/WorldSellerGame/world-seller/commit/aef52cacf43949278713e739d1171e688d748df6))
* **sfx:** add sound effects, closes [#93](https://github.com/WorldSellerGame/world-seller/issues/93) ([fb72c94](https://github.com/WorldSellerGame/world-seller/commit/fb72c94ff0c4e8d945f4daf1e8d2f7a97ab4a6d1))
* **theme:** add world seller default theme ([8e965f3](https://github.com/WorldSellerGame/world-seller/commit/8e965f3188f7f6ac0403d111b05366b3ef4d46da))
* **tradeskill:** add alchemy. add bottles. maybe more stuff. ([24e7da9](https://github.com/WorldSellerGame/world-seller/commit/24e7da9674bab620f9c14aa3e8c9cc4930195cc6))
* **tradeskill:** add combat ([66187dc](https://github.com/WorldSellerGame/world-seller/commit/66187dcb54f33fa01dd2f77f910c5060ae073729))
* **tradeskill:** add cooking ([dbe184f](https://github.com/WorldSellerGame/world-seller/commit/dbe184f4d8cd58541749b4cddb98ae52ca14e127))
* **tradeskill:** add farming ([8d0208e](https://github.com/WorldSellerGame/world-seller/commit/8d0208e2719d584ab95e00ddd2be4cdf8941e3ab))
* **tradeskill:** add jewelcrafting ([631911a](https://github.com/WorldSellerGame/world-seller/commit/631911af75c676d24fbcb622730b7c05776faa83))
* **tradeskill:** add mining, lots of infra ([704fc98](https://github.com/WorldSellerGame/world-seller/commit/704fc98b70126a551d177c381b0235e952ddae09))
* **tradeskill:** added prospecting. farming can now level up. ([01e10a4](https://github.com/WorldSellerGame/world-seller/commit/01e10a4d5477103001480f9f541bca5feae94c6a))
* **tradeskill:** added weaving. refining can now give resources. added new recipes/items. ([78f22b2](https://github.com/WorldSellerGame/world-seller/commit/78f22b25a59ba74d3685266b4af62cf3115cc2c6))
* **tradeskill:** allow for getting nothing, closes [#27](https://github.com/WorldSellerGame/world-seller/issues/27) ([3b85e25](https://github.com/WorldSellerGame/world-seller/commit/3b85e255a02666d39eda0711d78893943da473e7))
* **tradeskill:** can only gather from one place at a time. closes [#42](https://github.com/WorldSellerGame/world-seller/issues/42) ([41a34d8](https://github.com/WorldSellerGame/world-seller/commit/41a34d848f5a8b27b054656f1c52749cab64c301))
* **tradeskill:** refining tradeskills have a queue limit, closes [#36](https://github.com/WorldSellerGame/world-seller/issues/36) ([1fbb1f6](https://github.com/WorldSellerGame/world-seller/commit/1fbb1f6f8c08aac3080f4c87652876940973ea15))
* **tradeskill:** tradeskills can now require items to have a recipe become visible, as well as not spend items in the case of crafting tables or similar ([fd4dbb9](https://github.com/WorldSellerGame/world-seller/commit/fd4dbb98f12141ae0b9b27a85247e681a172b0f2)), closes [#40](https://github.com/WorldSellerGame/world-seller/issues/40) [#41](https://github.com/WorldSellerGame/world-seller/issues/41)
* **ui:** add ability to equip items, closes [#15](https://github.com/WorldSellerGame/world-seller/issues/15) ([2236717](https://github.com/WorldSellerGame/world-seller/commit/22367175f487f79a6aaaa2a3c97bdaaebec0ec4f))
* **ui:** add darker version of background for other parts of app ([870f30e](https://github.com/WorldSellerGame/world-seller/commit/870f30e2295f4e101d2a54d94c9265b0ba763245))
* **ui:** add inventory. add blacksmithing. closes [#14](https://github.com/WorldSellerGame/world-seller/issues/14) ([888a21a](https://github.com/WorldSellerGame/world-seller/commit/888a21a383ac62e43269cb0a1bdcd88cda5c7336))
* **ui:** add mercantile. add upgrades. rework some internals. add value to everything. add maxWorkers to everything. ([18bcba9](https://github.com/WorldSellerGame/world-seller/commit/18bcba94317cad0d15f45bca43e16cc5ca0b81b0))
* **ui:** add new fonts that look good. closes [#104](https://github.com/WorldSellerGame/world-seller/issues/104) ([ac4648c](https://github.com/WorldSellerGame/world-seller/commit/ac4648c142fcf0ff8cbb8693d3e5c79099421409))
* **ui:** add notification for resource gain, closes [#11](https://github.com/WorldSellerGame/world-seller/issues/11) ([f26be05](https://github.com/WorldSellerGame/world-seller/commit/f26be0546cabf903f96a6e08141a8d30360a2c21))
* **ui:** add settings page. it's empty. ([9a36792](https://github.com/WorldSellerGame/world-seller/commit/9a36792a3a1ab2326d59d7a9839e45daabb57a70))
* **ui:** add tooltips in relevant places, closes [#18](https://github.com/WorldSellerGame/world-seller/issues/18) ([c5eb9f6](https://github.com/WorldSellerGame/world-seller/commit/c5eb9f6e4479be6ea4d69c35b3991c6e4f558c1b))
* **ui:** display levels in sidebar, closes [#9](https://github.com/WorldSellerGame/world-seller/issues/9) ([8c1b33c](https://github.com/WorldSellerGame/world-seller/commit/8c1b33c5c7df0ccf59bb00c306dfde27e789e43e))
* **ui:** get version on build of app. add discord/github links in settings. closes [#33](https://github.com/WorldSellerGame/world-seller/issues/33) ([1974379](https://github.com/WorldSellerGame/world-seller/commit/1974379ce39703e844412be92043ed832e67aeaf))
* **ui:** improve usability of resources and inventory page ([58e6ed2](https://github.com/WorldSellerGame/world-seller/commit/58e6ed21cb4074d0a1cc19c6da2c5dca27a681a6))
* **ui:** options screen. option to collapse to just icons. closes [#21](https://github.com/WorldSellerGame/world-seller/issues/21) ([62fab3a](https://github.com/WorldSellerGame/world-seller/commit/62fab3a7506c9dd03ef2334bfa31d8b1377619dd))
* **validate:** nothing can have a name >32 characters, closes [#82](https://github.com/WorldSellerGame/world-seller/issues/82) ([78f434c](https://github.com/WorldSellerGame/world-seller/commit/78f434c244bde3478c0c52df3499cd8526df8a50))
* **workers:** workers require upkeep. closes [#56](https://github.com/WorldSellerGame/world-seller/issues/56) ([e481160](https://github.com/WorldSellerGame/world-seller/commit/e48116043564501450145ca91c58dd87c74e0d9c))



