export type GeneralTerms =
  | "2x.sale"
  | "achievements"
  | "amount.matic"
  | "are.you.sure"
  | "deposit"
  | "add.liquidity"
  | "add"
  | "addSFL"
  | "alr.claim"
  | "alr.completed"
  | "alr.crafted"
  | "alr.minted"
  | "auction"
  | "available"
  | "back"
  | "bait"
  | "balance"
  | "balance.short"
  | "banner"
  | "banners"
  | "basket"
  | "beta"
  | "bid"
  | "bounty"
  | "build"
  | "buy"
  | "bought"
  | "cancel"
  | "card.cash"
  | "check"
  | "chest"
  | "chores"
  | "choose.wisely"
  | "claim.skill"
  | "claim.gift"
  | "claim"
  | "clear"
  | "close"
  | "coins"
  | "collect"
  | "coming.soon"
  | "completed"
  | "complete"
  | "confirm"
  | "congrats"
  | "connecting"
  | "continue"
  | "cook"
  | "copied"
  | "copy.address"
  | "copy.link"
  | "copy.failed"
  | "coupons"
  | "craft"
  | "crops"
  | "danger"
  | "date"
  | "deliver"
  | "deliveries"
  | "delivery"
  | "deliveries.closed"
  | "details"
  | "donate"
  | "donating"
  | "donations"
  | "earn"
  | "easter.eggs"
  | "egg"
  | "empty"
  | "enjoying.event"
  | "equip"
  | "error"
  | "exchange"
  | "exotics"
  | "expand.land"
  | "expand"
  | "expired"
  | "explore"
  | "faction"
  | "farm"
  | "featured"
  | "fee"
  | "feed.bumpkin"
  | "fertilisers"
  | "fish.caught"
  | "fish"
  | "foods"
  | "flowers"
  | "flowers.found"
  | "for"
  | "forbidden"
  | "free"
  | "fruit"
  | "fruits"
  | "gift"
  | "go.home"
  | "gotIt"
  | "grant.wish"
  | "greenhouse"
  | "growing"
  | "guide"
  | "honey"
  | "hungry?"
  | "info"
  | "item"
  | "land"
  | "last.updated"
  | "lets.go"
  | "linked.wallet"
  | "limit"
  | "list.trade"
  | "list"
  | "loading"
  | "locked"
  | "loser.refund"
  | "lvl"
  | "maintenance"
  | "make.wish"
  | "making.wish"
  | "max"
  | "max.reached"
  | "minimum"
  | "mint"
  | "minting"
  | "music"
  | "next"
  | "next.order"
  | "nextSkillPtLvl"
  | "no.delivery.avl"
  | "no.limits.exceeded"
  | "no.mail"
  | "no.obsessions"
  | "no.thanks"
  | "no"
  | "ocean.fishing"
  | "off"
  | "offer.end"
  | "ok"
  | "on"
  | "open"
  | "open.gift"
  | "optional"
  | "pay.attention.feedback"
  | "place"
  | "place.map"
  | "placing.bid"
  | "place.bid"
  | "plant"
  | "player"
  | "play.again"
  | "please.try.again"
  | "print"
  | "purchased"
  | "purchasing"
  | "rank"
  | "read.more"
  | "refresh"
  | "refreshing"
  | "remaining"
  | "remaining.free.listings"
  | "remaining.free.purchases"
  | "remaining.free.listing"
  | "remaining.free.purchase"
  | "remove"
  | "reqSkillPts"
  | "reqSkills"
  | "required"
  | "requires"
  | "requirements"
  | "resources"
  | "restock"
  | "retry"
  | "reward"
  | "reward.discovered"
  | "save"
  | "saving"
  | "searching"
  | "seeds"
  | "selected"
  | "select.resource"
  | "sell.all"
  | "sell.one"
  | "sell.ten"
  | "sell"
  | "session.expired"
  | "sfl/coins"
  | "share"
  | "skillPts"
  | "skills"
  | "skipping"
  | "skip.order"
  | "sound.effects"
  | "start"
  | "submit"
  | "submitting"
  | "success"
  | "swapping"
  | "syncing"
  | "task"
  | "test"
  | "thank.you"
  | "time.remaining"
  | "tools"
  | "total"
  | "trades"
  | "trading"
  | "transfer"
  | "try.again"
  | "uhOh"
  | "unlock.land"
  | "unlocking"
  | "unmute"
  | "use.craft"
  | "verify"
  | "version"
  | "viewAll"
  | "visit"
  | "warning"
  | "welcome"
  | "wish"
  | "wishing.well"
  | "withdraw"
  | "yes.please"
  | "yes"
  | "opensea"
  | "layouts"
  | "labels"
  | "buff"
  | "speed"
  | "treasure"
  | "special"
  | "default"
  | "formula"
  | "chill"
  | "full"
  | "collectibles"
  | "buds"
  | "wearables"
  | "skip"
  | "docs"
  | "exit"
  | "compost"
  | "chicken"
  | "recipes"
  | "unlocked"
  | "reel"
  | "new.species"
  | "buildings"
  | "boosts"
  | "decorations"
  | "vipAccess";

export type TimeUnits =
  // Full Singular
  | "time.second.full"
  | "time.minute.full"
  | "time.hour.full"
  | "time.day.full"

  // Full Plural
  | "time.seconds.full"
  | "time.minutes.full"
  | "time.hours.full"
  | "time.days.full"

  // Medium Singular
  | "time.sec.med"
  | "time.min.med"
  | "time.hr.med"
  | "time.day.med"

  // Medium Plural
  | "time.secs.med"
  | "time.mins.med"
  | "time.hrs.med"
  | "time.days.med"

  // Short
  | "time.second.short"
  | "time.minute.short"
  | "time.hour.short"
  | "time.day.short"

  // Relative time
  | "time.seconds.ago"
  | "time.minutes.ago"
  | "time.hours.ago"
  | "time.days.ago";

export type AchievementsTerms =
  | "breadWinner.description"
  | "breadWinner.one"
  | "breadWinner.two"
  | "breadWinner.three"
  | "sunSeeker.description"
  | "cabbageKing.description"
  | "jackOLantern.description"
  | "coolFlower.description"
  | "farmHand.description"
  | "beetrootBeast.description"
  | "myLifeIsPotato.description"
  | "rapidRadish.description"
  | "twentyTwentyVision.description"
  | "stapleCrop.description"
  | "sunflowerSuperstar.description"
  | "bumpkinBillionaire.description"
  | "patientParsnips.description"
  | "cropChampion.description"
  | "busyBumpkin.description"
  | "busyBumpkin.one"
  | "busyBumpkin.two"
  | "kissTheCook.description"
  | "bakersDozen.description"
  | "brilliantBumpkin.description"
  | "chefDeCuisine.description"
  | "scarecrowMaestro.description"
  | "scarecrowMaestro.one"
  | "scarecrowMaestro.two"
  | "bigSpender.description"
  | "museum.description"
  | "highRoller.description"
  | "timbeerrr.description"
  | "craftmanship.description"
  | "driller.description"
  | "ironEyes.description"
  | "elDorado.description"
  | "timeToChop.description"
  | "canary.description"
  | "somethingShiny.description"
  | "bumpkinChainsawAmateur.description"
  | "goldFever.description"
  | "explorer.one"
  | "expansion.description"
  | "wellOfProsperity.description"
  | "wellOfProsperity.one"
  | "wellOfProsperity.two"
  | "contractor.description"
  | "fruitAficionado.description"
  | "fruitAficionado.one"
  | "fruitAficionado.two"
  | "orangeSqueeze.description"
  | "appleOfMyEye.description"
  | "blueChip.description"
  | "fruitPlatter.description"
  | "crowdFavourite.description"
  | "deliveryDynamo.description"
  | "deliveryDynamo.one"
  | "deliveryDynamo.two"
  | "seasonedFarmer.description"
  | "seasonedFarmer.one"
  | "seasonedFarmer.two"
  | "seasonedFarmer.three"
  | "treasureHunter.description"
  | "treasureHunter.one"
  | "treasureHunter.two"
  | "eggcellentCollection.description"
  | "eggcellentCollection.one"
  | "eggcellentCollection.two";

export type Auction =
  | "auction.title"
  | "auction.bid.message"
  | "auction.reveal"
  | "auction.live"
  | "auction.requirement"
  | "auction.start"
  | "auction.period"
  | "auction.closed"
  | "auction.const"
  | "auction.const.soon";

export type AddSFL =
  | "addSFL.swapDetails"
  | "addSFL.referralFee"
  | "addSFL.swapTitle"
  | "addSFL.minimumReceived";

export type AvailableSeeds =
  | "availableSeeds.select"
  | "availableSeeds.select.plant"
  | "quickSelect.label"
  | "quickSelect.empty"
  | "quickSelect.purchase"
  | "quickSelect.cropSeeds"
  | "quickSelect.greenhouseSeeds";

export type Base = "base.far.away" | "base.iam.far.away";

export type BasicTreasure =
  | "basic.treasure.missingKey"
  | "basic.treasure.needKey"
  | "basic.treasure.getKey"
  | "basic.treasure.congratsKey"
  | "basic.treasure.openChest"
  | "rare.treasure.needKey"
  | "luxury.treasure.needKey"
  | "giftGiver.label"
  | "giftGiver.description"
  | "budBox.open"
  | "budBox.opened"
  | "budBox.title"
  | "budBox.description"
  | "raffle.title"
  | "raffle.description"
  | "raffle.entries"
  | "raffle.noTicket"
  | "raffle.how"
  | "raffle.enter";

export type Beehive =
  | "beehive.harvestHoney"
  | "beehive.noFlowersGrowing"
  | "beehive.beeSwarm"
  | "beehive.pollinationCelebration"
  | "beehive.honeyProductionPaused"
  | "beehive.yield"
  | "beehive.honeyPerFullHive"
  | "beehive.speed"
  | "beehive.fullHivePerDay"
  | "beehive.estimatedFull"
  | "beehive.hive.singular"
  | "beehive.hives.plural";

export type BirdiePlaza =
  | "birdieplaza.birdieIntro"
  | "birdieplaza.admiringOutfit"
  | "birdieplaza.currentSeason"
  | "birdieplaza.collectTickets"
  | "birdieplaza.whatIsSeason"
  | "birdieplaza.howToEarnTickets"
  | "birdieplaza.earnTicketsVariety"
  | "birdieplaza.commonMethod"
  | "birdieplaza.choresAndRewards"
  | "birdieplaza.gatherAndCraft"
  | "birdieplaza.newSeasonIntro"
  | "birdieplaza.seasonQuests"
  | "birdieplaza.craftItems";

export type BoostDescriptions =
  //Mutant Chickens
  | "description.speed.chicken.one"
  | "description.speed.chicken.two"
  | "description.fat.chicken.one"
  | "description.fat.chicken.two"
  | "description.rich.chicken.one"
  | "description.rich.chicken.two"
  | "description.ayam.cemani"
  | "description.el.pollo.veloz.one"
  | "description.el.pollo.veloz.two"
  | "description.banana.chicken"

  //Boosts
  | "description.lab.grow.pumpkin"
  | "description.lab.grown.radish"
  | "description.lab.grown.carrot"
  | "description.purple.trail"
  | "description.obie"
  | "description.maximus"
  | "description.mushroom.house"
  | "description.Karkinos"
  | "description.heart.of.davy.jones"
  | "description.tin.turtle"
  | "description.emerald.turtle"
  | "description.iron.idol"
  | "description.crim.peckster"
  | "description.knight.chicken"
  | "description.skill.shrimpy"
  | "description.soil.krabby"
  | "description.nana"
  | "description.grain.grinder"
  | "description.kernaldo"
  | "description.kernaldo.1"
  | "description.poppy"
  | "description.poppy.1"
  | "description.victoria.sisters"
  | "description.undead.rooster"
  | "description.observatory"
  | "description.engine.core"
  | "description.time.warp.totem"
  | "description.time.warp.totem.expired"
  | "description.time.warp.totem.temporarily"
  | "description.cabbage.boy"
  | "description.cabbage.girl"
  | "description.wood.nymph.wendy"
  | "description.peeled.potato"
  | "description.potent.potato"
  | "description.radical.radish"
  | "description.stellar.sunflower"
  | "description.lady.bug"
  | "description.squirrel.monkey"
  | "description.black.bearry"
  | "description.maneki.neko"
  | "description.easter.bunny"
  | "description.pablo.bunny"
  | "description.foliant"
  | "description.tiki.totem"
  | "description.lunar.calendar"
  | "description.heart.davy.jones"
  | "description.treasure.map"
  | "description.genie.lamp"
  | "description.sir.goldensnout"
  | "description.freya.fox"
  | "description.queen.cornelia"

  //Blacksmith items
  | "description.basic.scarecrow"
  | "description.scary.mike"
  | "description.laurie.chuckle.crow"
  | "description.immortal.pear"
  | "description.bale";

export type BoostEffectDescriptions =
  | "description.obie.boost"
  | "description.purple.trail.boost"
  | "description.freya.fox.boost"
  | "description.sir.goldensnout.boost"
  | "description.maximus.boost"
  | "description.basic.scarecrow.boost"
  | "description.scary.mike.boost"
  | "description.laurie.chuckle.crow.boost"
  | "description.bale.boost"
  | "description.immortal.pear.boost"
  | "description.treasure.map.boost"
  | "description.poppy.boost"
  | "description.kernaldo.boost"
  | "description.grain.grinder.boost"
  | "description.nana.boost"
  | "description.soil.krabby.boost"
  | "description.skill.shrimpy.boost"
  | "description.iron.idol.boost"
  | "description.emerald.turtle.boost"
  | "description.tin.turtle.boost"
  | "description.heart.of.davy.jones.boost"
  | "description.Karkinos.boost"
  | "description.mushroom.house.boost"
  | "description.boost.gilded.swordfish"
  | "description.babyPanda.boost"
  | "description.hungryHare.boost"
  | "description.nancy.boost"
  | "description.scarecrow.boost"
  | "description.kuebiko.boost"
  | "description.gnome.boost"
  | "description.lunar.calendar.boost"
  | "description.peeled.potato.boost"
  | "description.victoria.sisters.boost"
  | "description.easter.bunny.boost"
  | "description.pablo.bunny.boost"
  | "description.cabbage.boy.boost"
  | "description.cabbage.girl.boost"
  | "description.golden.cauliflower.boost"
  | "description.mysterious.parsnip.boost"
  | "description.queen.cornelia.boost"
  | "description.foliant.boost"
  | "description.hoot.boost"
  | "description.hungry.caterpillar.boost"
  | "description.black.bearry.boost"
  | "description.squirrel.monkey.boost"
  | "description.lady.bug.boost"
  | "description.banana.chicken.boost"
  | "description.carrot.sword.boost"
  | "description.stellar.sunflower.boost"
  | "description.potent.potato.boost"
  | "description.radical.radish.boost"
  | "description.lg.pumpkin.boost"
  | "description.lg.carrot.boost"
  | "description.lg.radish.boost"
  | "description.fat.chicken.boost"
  | "description.rich.chicken.boost"
  | "description.speed.chicken.boost"
  | "description.ayam.cemani.boost"
  | "description.el.pollo.veloz.boost"
  | "description.rooster.boost"
  | "description.undead.rooster.boost"
  | "description.chicken.coop.boost"
  | "description.gold.egg.boost"
  | "description.woody.beaver.boost"
  | "description.apprentice.beaver.boost"
  | "description.foreman.beaver.boost"
  | "description.wood.nymph.wendy.boost"
  | "description.tiki.totem.boost"
  | "description.tunnel.mole.boost"
  | "description.rocky.mole.boost"
  | "description.nugget.boost"
  | "description.rock.golem.boost"
  | "description.crimson.carp.boost"
  | "description.battle.fish.boost"
  | "description.crim.peckster.boost"
  | "description.knight.chicken.boost"
  | "description.queen.bee.boost"
  | "description.humming.bird.boost"
  | "description.beehive.boost"
  | "description.walrus.boost"
  | "description.alba.boost"
  | "description.knowledge.crab.boost"
  | "description.maneki.neko.boost"
  | "description.genie.lamp.boost"
  | "description.observatory.boost"
  | "description.blossombeard.boost"
  | "description.desertgnome.boost"
  | "description.christmas.festive.tree.boost"
  | "description.grinxs.hammer.boost"
  | "description.time.warp.totem.boost"
  | "description.radiant.ray.boost"
  | "description.beekeeper.hat.boost"
  | "description.flower.fox.boost"
  | "description.turbo.sprout.boost"
  | "description.soybliss.boost"
  | "description.grape.granny.boost"
  | "description.non.la.hat.boost"
  | "description.oil.can.boost"
  | "description.paw.shield.boost"
  | "description.olive.shield.boost"
  | "description.pan.boost"
  | "description.vinny.boost"
  | "description.rice.panda.boost"
  | "description.olive.shirt.boost"
  | "description.tofu.mask.boost"
  | "description.gourmet.hourglass.boost"
  | "description.harvest.hourglass.boost"
  | "description.timber.hourglass.boost"
  | "description.ore.hourglass.boost"
  | "description.orchard.hourglass.boost"
  | "description.fishers.hourglass.boost"
  | "description.blossom.hourglass.boost"
  | "description.hourglass.expired"
  | "description.hourglass.running";

export type BountyDescription =
  | "description.clam.shell"
  | "description.sea.cucumber"
  | "description.coral"
  | "description.crab"
  | "description.starfish"
  | "description.pirate.bounty"
  | "description.wooden.compass"
  | "description.iron.compass"
  | "description.emerald.compass"
  | "description.old.bottle"
  | "description.pearl"
  | "description.pipi"
  | "description.seaweed";

export type BuildingDescriptions =
  //Buildings
  | "description.water.well"
  | "description.kitchen"
  | "description.compost.bin"
  | "description.hen.house"
  | "description.bakery"
  | "description.greenhouse"
  | "description.turbo.composter"
  | "description.deli"
  | "description.smoothie.shack"
  | "description.warehouse"
  | "description.toolshed"
  | "description.premium.composter"
  | "description.town.center"
  | "description.market"
  | "description.fire.pit"
  | "description.workbench"
  | "description.tent"
  | "description.house"
  | "description.crop.machine"
  | "building.oil.remaining"
  | "cooking.building.oil.description"
  | "cooking.building.oil.boost"
  | "cooking.building.runtime";

export type BumpkinDelivery =
  | "bumpkin.delivery.selectFlower"
  | "bumpkin.delivery.noFlowers"
  | "bumpkin.delivery.thanks"
  | "bumpkin.delivery.waiting"
  | "bumpkin.delivery.proveYourself";

export type BumpkinItemBuff =
  | "bumpkinItemBuff.chef.apron.boost"
  | "bumpkinItemBuff.fruit.picker.apron.boost"
  | "bumpkinItemBuff.angel.wings.boost"
  | "bumpkinItemBuff.devil.wings.boost"
  | "bumpkinItemBuff.eggplant.onesie.boost"
  | "bumpkinItemBuff.golden.spatula.boost"
  | "bumpkinItemBuff.mushroom.hat.boost"
  | "bumpkinItemBuff.parsnip.boost"
  | "bumpkinItemBuff.sunflower.amulet.boost"
  | "bumpkinItemBuff.carrot.amulet.boost"
  | "bumpkinItemBuff.beetroot.amulet.boost"
  | "bumpkinItemBuff.green.amulet.boost"
  | "bumpkinItemBuff.Luna.s.hat.boost"
  | "bumpkinItemBuff.infernal.pitchfork.boost"
  | "bumpkinItemBuff.cattlegrim.boost"
  | "bumpkinItemBuff.corn.onesie.boost"
  | "bumpkinItemBuff.sunflower.rod.boost"
  | "bumpkinItemBuff.trident.boost"
  | "bumpkinItemBuff.bucket.o.worms.boost"
  | "bumpkinItemBuff.luminous.anglerfish.topper.boost"
  | "bumpkinItemBuff.angler.waders.boost"
  | "bumpkinItemBuff.ancient.rod.boost"
  | "bumpkinItemBuff.banana.amulet.boost"
  | "bumpkinItemBuff.banana.boost"
  | "bumpkinItemBuff.deep.sea.helm"
  | "bumpkinItemBuff.bee.suit"
  | "bumpkinItemBuff.crimstone.hammer"
  | "bumpkinItemBuff.crimstone.amulet"
  | "bumpkinItemBuff.crimstone.armor"
  | "bumpkinItemBuff.hornet.mask"
  | "bumpkinItemBuff.honeycomb.shield"
  | "bumpkinItemBuff.flower.crown"
  | "bumpkinItemBuff.goblin.armor"
  | "bumpkinItemBuff.goblin.helmet"
  | "bumpkinItemBuff.goblin.axe"
  | "bumpkinItemBuff.goblin.pants"
  | "bumpkinItemBuff.goblin.sabatons"
  | "bumpkinItemBuff.nightshade.armor"
  | "bumpkinItemBuff.nightshade.helmet"
  | "bumpkinItemBuff.nightshade.sword"
  | "bumpkinItemBuff.nightshade.pants"
  | "bumpkinItemBuff.nightshade.sabatons"
  | "bumpkinItemBuff.sunflorian.armor"
  | "bumpkinItemBuff.sunflorian.helmet"
  | "bumpkinItemBuff.sunflorian.sword"
  | "bumpkinItemBuff.sunflorian.pants"
  | "bumpkinItemBuff.sunflorian.sabatons"
  | "bumpkinItemBuff.bumpkin.armor"
  | "bumpkinItemBuff.bumpkin.helmet"
  | "bumpkinItemBuff.bumpkin.sword"
  | "bumpkinItemBuff.bumpkin.pants"
  | "bumpkinItemBuff.bumpkin.sabatons";

export type BumpkinPart =
  | "equip.background"
  | "equip.hair"
  | "equip.body"
  | "equip.shirt"
  | "equip.pants"
  | "equip.shoes"
  | "equip.tool"
  | "equip.necklace"
  | "equip.coat"
  | "equip.hat"
  | "equip.secondaryTool"
  | "equip.onesie"
  | "equip.suit"
  | "equip.wings"
  | "equip.dress"
  | "equip.beard";

export type BumpkinPartRequirements =
  | "equip.missingHair"
  | "equip.missingBody"
  | "equip.missingShoes"
  | "equip.missingShirt"
  | "equip.missingPants"
  | "equip.missingBackground";

export type BumpkinSkillsDescription =
  //Crops
  | "description.green.thumb"
  | "description.cultivator"
  | "description.master.farmer"
  | "description.golden.flowers"
  | "description.happy.crop"

  //Trees
  | "description.lumberjack"
  | "description.tree.hugger"
  | "description.tough.tree"
  | "description.money.tree"

  //Rocks
  | "description.digger"
  | "description.coal.face"
  | "description.seeker"
  | "description.gold.rush"

  //Cooking
  | "description.rush.hour"
  | "description.kitchen.hand"
  | "description.michelin.stars"
  | "description.curer"

  //Animals
  | "description.stable.hand"
  | "description.free.range"
  | "description.horse.whisperer"
  | "description.buckaroo";

export type BumpkinTrade =
  | "bumpkinTrade.minLevel"
  | "bumpkinTrade.noTradeListed"
  | "bumpkinTrade.sell"
  | "bumpkinTrade.like.list"
  | "bumpkinTrade.purchase"
  | "bumpkinTrade.available"
  | "bumpkinTrade.quantity"
  | "bumpkinTrade.price"
  | "bumpkinTrade.listingPrice"
  | "bumpkinTrade.listingPrice"
  | "bumpkinTrade.pricePerUnit"
  | "bumpkinTrade.price/unit"
  | "bumpkinTrade.tradingFee"
  | "bumpkinTrade.youWillReceive"
  | "bumpkinTrade.cancel"
  | "bumpkinTrade.list"
  | "bumpkinTrade.maxListings"
  | "bumpkinTrade.max"
  | "bumpkinTrade.min"
  | "bumpkinTrade.minimumFloor"
  | "bumpkinTrade.maximumFloor"
  | "bumpkinTrade.floorPrice"
  | "bumpkinTrade.sellConfirmation"
  | "bumpkinTrade.cant.sell.all";

export type GoblinTrade =
  | "goblinTrade.select"
  | "goblinTrade.bulk"
  | "goblinTrade.conversion"
  | "goblinTrade.hoarding"
  | "goblinTrade.vipRequired"
  | "goblinTrade.vipDelivery";

export type BuyFarmHand =
  | "buyFarmHand.howdyBumpkin"
  | "buyFarmHand.confirmBuyAdditional"
  | "buyFarmHand.farmhandCoupon"
  | "buyFarmHand.adoptBumpkin"
  | "buyFarmHand.additionalBumpkinsInfo"
  | "buyFarmHand.notEnoughSpace"
  | "buyFarmHand.buyBumpkin"
  | "buyFarmHand.newFarmhandGreeting";

export type ClaimAchievement =
  | "claimAchievement.alreadyHave"
  | "claimAchievement.requirementsNotMet";

export type Chat = "chat.Fail" | "chat.mute" | "chat.again" | "chat.Kicked";

export type ChickenWinner = "chicken.winner.playagain";

export type ChoresStart =
  | "chores.harvestFields"
  | "chores.harvestFieldsIntro"
  | "chores.earnSflIntro"
  | "chores.reachLevel"
  | "chores.reachLevelIntro"
  | "chores.chopTrees"
  | "chores.helpWithTrees"
  | "chores.noChore"
  | "chores.newSeason"
  | "chores.choresFrozen"
  | "chores.left";

export type ChumDetails =
  | "chumDetails.gold"
  | "chumDetails.iron"
  | "chumDetails.stone"
  | "chumDetails.egg"
  | "chumDetails.sunflower"
  | "chumDetails.potato"
  | "chumDetails.pumpkin"
  | "chumDetails.carrot"
  | "chumDetails.cabbage"
  | "chumDetails.beetroot"
  | "chumDetails.cauliflower"
  | "chumDetails.parsnip"
  | "chumDetails.eggplant"
  | "chumDetails.corn"
  | "chumDetails.radish"
  | "chumDetails.wheat"
  | "chumDetails.kale"
  | "chumDetails.blueberry"
  | "chumDetails.orange"
  | "chumDetails.apple"
  | "chumDetails.banana"
  | "chumDetails.seaweed"
  | "chumDetails.crab"
  | "chumDetails.anchovy"
  | "chumDetails.redSnapper"
  | "chumDetails.tuna"
  | "chumDetails.squid"
  | "chumDetails.wood"
  | "chumDetails.redPansy"
  | "chumDetails.richChicken"
  | "chumDetails.fatChicken"
  | "chumDetails.speedChicken"
  | "chumDetails.horseMackerel"
  | "chumDetails.sunfish";

export type Community = "community.toast" | "community.url" | "comunity.Travel";

export type CompostDescription =
  | "compost.fruitfulBlend"
  | "compost.sproutMix"
  | "compost.sproutMixBoosted"
  | "compost.rapidRoot";

export type ComposterDescription =
  | "composter.compostBin"
  | "composter.turboComposter"
  | "composter.premiumComposter";

export type ConfirmSkill = "confirm.skillClaim";

export type ConfirmationTerms =
  | "confirmation.sellCrops"
  | "confirmation.buyCrops";

export type Conversations =
  | "hank-intro.headline"
  | "hank-intro.one"
  | "hank-intro.two"
  | "hank-intro.three"
  | "hank.crafting.scarecrow"
  | "hank-crafting.one"
  | "hank-crafting.two"
  | "hank.choresFrozen"
  | "betty-intro.headline"
  | "betty-intro.one"
  | "betty-intro.two"
  | "betty-intro.three"
  | "home-intro.one"
  | "home-intro.two"
  | "home-intro.three"
  | "betty.market-intro.one"
  | "betty.market-intro.two"
  | "betty.market-intro.three"
  | "betty.market-intro.four"
  | "firepit-intro.one"
  | "firepit-intro.two"
  | "firepit.increasedXP"
  | "bruce-intro.headline"
  | "bruce-intro.one"
  | "bruce-intro.two"
  | "bruce-intro.three"
  | "blacksmith-intro.headline"
  | "blacksmith-intro.one"
  | "pete.first-expansion.one"
  | "pete.first-expansion.two"
  | "pete.first-expansion.three"
  | "pete.first-expansion.four"
  | "pete.craftScarecrow.one"
  | "pete.craftScarecrow.two"
  | "pete.craftScarecrow.three"
  | "pete.levelthree.one"
  | "pete.levelthree.two"
  | "pete.levelthree.three"
  | "pete.levelthree.four"
  | "pete.help.zero"
  | "pete.pumpkinPlaza.one"
  | "pete.pumpkinPlaza.two"
  | "sunflowerLand.islandDescription"
  | "sunflowerLand.opportunitiesDescription"
  | "sunflowerLand.returnHomeInstruction"
  | "grimbly.expansion.one"
  | "grimbly.expansion.two"
  | "luna.portalNoAccess"
  | "luna.portals"
  | "luna.rewards"
  | "luna.travel"
  | "pete.intro.one"
  | "pete.intro.two"
  | "pete.intro.three"
  | "pete.intro.four"
  | "pete.intro.five"
  | "mayor.plaza.changeNamePrompt"
  | "mayor.plaza.intro"
  | "mayor.plaza.role"
  | "mayor.plaza.fixNamePrompt"
  | "mayor.plaza.enterUsernamePrompt"
  | "mayor.plaza.usernameValidation"
  | "mayor.plaza.niceToMeetYou"
  | "mayor.plaza.congratulations"
  | "mayor.plaza.enjoyYourStay"
  | "mayor.codeOfConduct"
  | "mayor.failureToComply"
  | "mayor.paperworkComplete";

export type CropBoomMessages =
  | "crop.boom.welcome"
  | "crop.boom.reachOtherSide"
  | "crop.boom.bewareExplodingCrops"
  | "crop.boom.newPuzzleDaily"
  | "crop.boom.back.puzzle";

export type CropFruitDescriptions =
  //Crops
  | "description.sunflower"
  | "description.potato"
  | "description.pumpkin"
  | "description.carrot"
  | "description.cabbage"
  | "description.beetroot"
  | "description.cauliflower"
  | "description.parsnip"
  | "description.eggplant"
  | "description.corn"
  | "description.radish"
  | "description.wheat"
  | "description.kale"
  | "description.soybean"

  // Greenhouse
  | "description.rice"
  | "description.olive"
  | "description.grape"

  //Fruit
  | "description.blueberry"
  | "description.orange"
  | "description.apple"
  | "description.banana"

  //Exotic Crops
  | "description.white.carrot"
  | "description.warty.goblin.pumpkin"
  | "description.adirondack.potato"
  | "description.purple.cauliflower"
  | "description.chiogga"
  | "description.golden.helios"
  | "description.black.magic"

  //Flower Seed
  | "description.sunpetal.seed"
  | "description.bloom.seed"
  | "description.lily.seed";

export type CropMachine =
  | "cropMachine.moreOilRequired"
  | "cropMachine.oilTank"
  | "cropMachine.addOil"
  | "cropMachine.oil.description"
  | "cropMachine.machineRuntime"
  | "cropMachine.growTimeRemaining"
  | "cropMachine.paused"
  | "cropMachine.readyToHarvest"
  | "cropMachine.boosted"
  | "cropMachine.totalSeeds"
  | "cropMachine.totalCrops"
  | "cropMachine.harvest"
  | "cropMachine.pickSeed"
  | "cropMachine.addSeeds"
  | "cropMachine.availableInventory"
  | "cropMachine.seeds"
  | "cropMachine.growTime"
  | "cropMachine.addSeedPack"
  | "cropMachine.notStartedYet"
  | "cropMachine.seedPacks"
  | "cropMachine.readyCropPacks"
  | "cropMachine.readyCropPacks.description"
  | "cropMachine.harvestCropPack"
  | "cropMachine.maxRuntime"
  | "cropMachine.oilToAdd"
  | "cropMachine.totalRuntime"
  | "cropMachine.running"
  | "cropMachine.stopped"
  | "cropMachine.idle"
  | "cropMachine.name";

export type DeliveryItem =
  | "deliveryitem.inventory"
  | "deliveryitem.itemsToDeliver"
  | "deliveryitem.deliverToWallet"
  | "deliveryitem.viewOnOpenSea"
  | "deliveryitem.deliver";

export type DefaultDialogue =
  | "defaultDialogue.intro"
  | "defaultDialogue.positiveDelivery"
  | "defaultDialogue.negativeDelivery"
  | "defaultDialogue.noOrder";

export type DecorationDescriptions =
  //Decorations
  | "description.wicker.man"
  | "description.golden bonsai"
  | "description.christmas.bear"
  | "description.war.skull"
  | "description.war.tombstone"
  | "description.white.tulips"
  | "description.potted.sunflower"
  | "description.potted.potato"
  | "description.potted.pumpkin"
  | "description.cactus"
  | "description.basic.bear"
  | "description.bonnies.tombstone"
  | "description.grubnashs.tombstone"
  | "description.town.sign"
  | "description.dirt.path"
  | "description.bush"
  | "description.fence"
  | "description.stone.fence"
  | "description.pine.tree"
  | "description.shrub"
  | "description.field.maple"
  | "description.red.maple"
  | "description.golden.maple"
  | "description.crimson.cap"
  | "description.toadstool.seat"
  | "description.chestnut.fungi.stool"
  | "description.mahogany.cap"
  | "description.candles"
  | "description.haunted.stump"
  | "description.spooky.tree"
  | "description.observer"
  | "description.crow.rock"
  | "description.mini.corn.maze"
  | "description.lifeguard.ring"
  | "description.surfboard"
  | "description.hideaway.herman"
  | "description.shifty.sheldon"
  | "description.tiki.torch"
  | "description.beach.umbrella"
  | "description.magic.bean"
  | "description.giant.potato"
  | "description.giant.pumpkin"
  | "description.giant.cabbage"
  | "description.chef.bear"
  | "description.construction.bear"
  | "description.angel.bear"
  | "description.badass.bear"
  | "description.bear.trap"
  | "description.brilliant.bear"
  | "description.classy.bear"
  | "description.farmer.bear"
  | "description.rich.bear"
  | "description.sunflower.bear"
  | "description.christmas.bear"
  | "description.beta.bear"
  | "description.rainbow.artist.bear"
  | "description.devil.bear"
  | "description.collectible.bear"
  | "description.cyborg.bear"
  | "description.abandoned.bear"
  | "description.turtle.bear"
  | "description.christmas.snow.globe"
  | "description.kraken.tentacle"
  | "description.kraken.head"
  | "description.trex.skull"
  | "description.sunflower.coin"
  | "description.skeleton.king.staff"
  | "description.lifeguard.bear"
  | "description.snorkel.bear"
  | "description.parasaur.skull"
  | "description.goblin.bear"
  | "description.golden.bear.head"
  | "description.pirate.bear"
  | "description.galleon"
  | "description.dinosaur.bone"
  | "description.human.bear"
  | "description.heart.balloons"
  | "description.flamingo"
  | "description.blossom.tree"
  | "description.whale.bear"
  | "description.valentine.bear"
  | "description.easter.bear"
  | "description.easter.bush"
  | "description.giant.carrot"
  | "description.beach.ball"
  | "description.palm.tree"
  | "description.sunflower.amulet"
  | "description.carrot.amulet"
  | "description.beetroot.amulet"
  | "description.green.amulet"
  | "description.warrior.shirt"
  | "description.warrior.pants"
  | "description.warrior.helmet"
  | "description.sunflower.shield"
  | "description.skull.hat"
  | "description.war.tombstone"
  | "description.sunflower.statue"
  | "description.potato.statue"
  | "description.christmas.tree"
  | "description.gnome"
  | "description.homeless.tent"
  | "description.sunflower.tombstone"
  | "description.sunflower.rock"
  | "description.goblin.crown"
  | "description.fountain"
  | "description.nyon.statue"
  | "description.farmer.bath"
  | "description.woody.Beaver"
  | "description.apprentice.beaver"
  | "description.foreman.beaver"
  | "description.egg.basket"
  | "description.mysterious.head"
  | "description.tunnel.mole"
  | "description.rocky.the.mole"
  | "description.nugget"
  | "description.rock.golem"
  | "description.chef.apron"
  | "description.chef.hat"
  | "description.nancy"
  | "description.scarecrow"
  | "description.kuebiko"
  | "description.golden.cauliflower"
  | "description.mysterious.parsnip"
  | "description.carrot.sword"
  | "description.chicken.coop"
  | "description.farm.cat"
  | "description.farm.dog"
  | "description.gold.egg"
  | "description.easter.bunny"
  | "description.rooster"
  | "description.chicken"
  | "description.cow"
  | "description.pig"
  | "description.sheep"
  | "description.basic.land"
  | "description.crop.plot"
  | "description.gold.rock"
  | "description.iron.rock"
  | "description.stone.rock"
  | "description.crimstone.rock"
  | "description.oil.reserve"
  | "description.flower.bed"
  | "description.tree"
  | "description.fruit.patch"
  | "description.boulder"
  | "description.catch.the.kraken.banner"
  | "description.luminous.lantern"
  | "description.radiance.lantern"
  | "description.ocean.lantern"
  | "description.solar.lantern"
  | "description.aurora.lantern"
  | "description.dawn.umbrella"
  | "description.eggplant.grill"
  | "description.giant.dawn.mushroom"
  | "description.shroom.glow"
  | "description.clementine"
  | "description.blossombeard"
  | "description.desertgnome"
  | "description.cobalt"
  | "description.hoot"
  | "description.genie.bear"
  | "description.betty.lantern"
  | "description.bumpkin.lantern"
  | "description.eggplant.bear"
  | "description.goblin.lantern"
  | "description.dawn.flower"
  | "description.kernaldo.bonus"
  | "description.white.crow"
  | "description.sapo.docuras"
  | "description.sapo.travessuras"
  | "description.walrus"
  | "description.alba"
  | "description.knowledge.crab"
  | "description.anchor"
  | "description.rubber.ducky"
  | "description.arcade.token"
  | "description.bumpkin.nutcracker"
  | "description.festive.tree"
  | "description.white.festive.fox"
  | "description.grinxs.hammer"
  | "description.angelfish"
  | "description.halibut"
  | "description.parrotFish"
  | "description.Farmhand"
  | "description.Beehive"
  | "description.battleCryDrum"
  | "description.bullseyeBoard"
  | "description.chessRug"
  | "description.cluckapult"
  | "description.goldenGallant"
  | "description.goldenGarrison"
  | "description.goldenGuardian"
  | "description.noviceKnight"
  | "description.regularPawn"
  | "description.rookieRook"
  | "description.silverSentinel"
  | "description.silverStallion"
  | "description.silverSquire"
  | "description.traineeTarget"
  | "description.twisterRug"

  //Flowers
  | "description.red.pansy"
  | "description.yellow.pansy"
  | "description.purple.pansy"
  | "description.white.pansy"
  | "description.blue.pansy"
  | "description.red.cosmos"
  | "description.yellow.cosmos"
  | "description.purple.cosmos"
  | "description.white.cosmos"
  | "description.blue.cosmos"
  | "description.red.balloon.flower"
  | "description.yellow.balloon.flower"
  | "description.purple.balloon.flower"
  | "description.white.balloon.flower"
  | "description.blue.balloon.flower"
  | "description.red.carnation"
  | "description.yellow.carnation"
  | "description.purple.carnation"
  | "description.white.carnation"
  | "description.blue.carnation"
  | "description.humming.bird"
  | "description.queen.bee"
  | "description.flower.fox"
  | "description.hungry.caterpillar"
  | "description.sunrise.bloom.rug"
  | "description.gauchoRug"
  | "description.blossom.royale"
  | "description.rainbow"
  | "description.enchanted.rose"
  | "description.flower.cart"
  | "description.capybara"
  | "description.prism.petal"
  | "description.celestial.frostbloom"
  | "description.primula.enigma"
  | "description.red.daffodil"
  | "description.yellow.daffodil"
  | "description.purple.daffodil"
  | "description.white.daffodil"
  | "description.blue.daffodil"
  | "description.red.lotus"
  | "description.yellow.lotus"
  | "description.purple.lotus"
  | "description.white.lotus"
  | "description.blue.lotus"

  //Banners
  | "description.goblin.war.banner"
  | "description.human.war.banner"
  | "description.earnAllianceBanner"
  | "description.sunflorian.faction.banner"
  | "description.nightshade.faction.banner"
  | "description.bumpkin.faction.banner"
  | "description.goblin.faction.banner"

  // Clash of Factions
  | "description.turbo.sprout"
  | "description.soybliss"
  | "description.grape.granny"
  | "description.royal.throne"
  | "description.lily.egg"
  | "description.goblet"
  | "description.fancy.rug"
  | "description.clock"
  | "description.vinny"
  | "description.ricePanda"
  | "description.splendorFlag"
  | "description.benevolenceFlag"
  | "description.devotionFlag"
  | "description.generosityFlag"
  | "description.jellyLamp"
  | "description.paintCan";

export type Delivery =
  | "delivery.resource"
  | "delivery.feed"
  | "delivery.fee"
  | "delivery.goblin.comm.treasury";

export type DeliveryHelp =
  | "deliveryHelp.pumpkinSoup"
  | "deliveryHelp.hammer"
  | "deliveryHelp.axe"
  | "deliveryHelp.chest";

export type DepositWallet =
  | "deposit.errorLoadingBalances"
  | "deposit.yourPersonalWallet"
  | "deposit.farmWillReceive"
  | "deposit.depositDidNotArrive"
  | "deposit.goblinTaxInfo"
  | "deposit.sendToFarm"
  | "deposit.toDepositLevelUp"
  | "deposit.level"
  | "deposit.noSflOrCollectibles"
  | "deposit.farmAddress"
  | "question.depositSFLItems";

export type Detail =
  | "detail.how.item"
  | "detail.Claim.Reward"
  | "detail.basket.empty"
  | "detail.view.item";

export type DiscordBonus =
  | "discord.bonus.niceHat"
  | "discord.bonus.attentionEvents"
  | "discord.bonus.bonusReward"
  | "discord.bonus.payAttention"
  | "discord.bonus.enjoyCommunity"
  | "discord.bonus.communityInfo"
  | "discord.bonus.farmingTips"
  | "discord.bonus.freeGift"
  | "discord.bonus.connect"
  | "fontReward.bonus.claim"
  | "fontReward.bonus.intro1"
  | "fontReward.bonus.intro2"
  | "fontReward.bonus.intro3";

export type DraftBid =
  | "draftBid.howAuctionWorks"
  | "draftBid.unsuccessfulParticipants"
  | "draftBid.termsAndConditions";

export type Donation =
  | "donation.one"
  | "donation.specialEvent"
  | "donation.rioGrandeDoSul.one"
  | "donation.rioGrandeDoSul.two"
  | "donation.matic"
  | "donation.minimum"
  | "donation.airdrop";

export type ErrorAndAccess =
  | "errorAndAccess.blocked.betaTestersOnly"
  | "errorAndAccess.denied.message"
  | "errorAndAccess.instructions.part1"
  | "errorAndAccess.sflDiscord"
  | "errorAndAccess.instructions.part2"
  | "error.cannotPlaceInside";

export type ErrorTerms =
  | "error.congestion.one"
  | "error.congestion.two"
  | "error.forbidden.goblinVillage"
  | "error.multipleDevices.one"
  | "error.multipleDevices.two"
  | "error.multipleWallets.one"
  | "error.multipleWallets.two"
  | "error.toManyRequest.one"
  | "error.toManyRequest.two"
  | "error.betaTestersOnly"
  | "error.wentWrong"
  | "error.polygonRPC"
  | "error.connection.one"
  | "error.connection.two"
  | "error.connection.three"
  | "error.connection.four"
  | "error.diagnostic.info"
  | "error.Web3NotFound"
  | "error.clock.not.synced"
  | "error.polygon.cant.connect"
  | "error.composterNotExist"
  | "error.composterNotProducing"
  | "error.composterAlreadyDone"
  | "error.composterAlreadyBoosted"
  | "error.missingEggs"
  | "error.insufficientSFL"
  | "error.dailyAttemptsExhausted"
  | "error.missingRod"
  | "error.missingBait"
  | "error.alreadyCasted"
  | "error.unsupportedChum"
  | "error.insufficientChum"
  | "error.alr.composter"
  | "error.no.alr.composter"
  | "error.missing"
  | "error.no.ready"
  | "error.noprod.composter"
  | "error.buildingNotExist"
  | "error.buildingNotCooking"
  | "error.recipeNotReady"
  | "error.npcsNotExist"
  | "error.noDiscoveryAvailable"
  | "error.obsessionAlreadyCompleted"
  | "error.collectibleNotInInventory"
  | "error.wearableNotInWardrobe"
  | "error.requiredBuildingNotExist"
  | "error.cookingInProgress"
  | "error.insufficientIngredient"
  | "error.insufficientSFL"
  | "error.ClientRPC"
  | "error.walletInUse.one"
  | "error.walletInUse.two"
  | "error.walletInUse.three"
  | "error.notEnoughOil"
  | "error.oilCapacityExceeded";

export type ExoticShopItems =
  | "exoticShopItems.line1"
  | "exoticShopItems.line2"
  | "exoticShopItems.line3"
  | "exoticShopItems.line4";

export type Factions =
  | "faction.join"
  | "faction.description.sunflorians"
  | "faction.description.bumpkins"
  | "faction.description.goblins"
  | "faction.description.nightshades"
  | "faction.countdown"
  | "faction.join.confirm"
  | "faction.cannot.change"
  | "faction.joined.sunflorians.intro"
  | "faction.joined.bumpkins.intro"
  | "faction.joined.goblins.intro"
  | "faction.joined.nightshades.intro"
  | "faction.earn.emblems"
  | "faction.earn.emblems.time.left"
  | "faction.emblems.tasks"
  | "faction.view.leaderboard"
  | "faction.donation.request.message"
  | "faction.donation.label"
  | "faction.donation.sfl"
  | "faction.donation.sfl.max.per.day"
  | "faction.donation.bulk.resources"
  | "faction.donation.bulk.resources.unlimited.per.day"
  | "faction.donation.confirm"
  | "faction.seasonal.delivery.start.at"
  | "faction.points.with.number"
  | "faction.points.title"
  | "faction.points.pledge.warning"
  | "faction.emblemAirdrop"
  | "faction.emblemAirdrop.closes"
  // Kingdom
  | "faction.restrited.area"
  | "faction.not.pledged"
  | "faction.cost"
  | "faction.pledge.reward"
  | "faction.welcome"
  | "faction.greeting.goblins"
  | "faction.greeting.sunflorians"
  | "faction.greeting.bumpkins"
  | "faction.greeting.nightshades"
  | "faction.kitchen.opensIn"
  | "faction.kitchen.notReady"
  | "faction.kitchen.gatherResources"
  | "faction.kitchen.preparing"
  | "faction.kitchen.newRequests"
  // Emblem Airdrop
  | "faction.claimEmblems.alreadyClaimed"
  | "faction.claimEmblems.emblemsEarned"
  | "faction.claimEmblems.yourRank"
  | "faction.claimEmblems.yourPercentile"
  | "faction.claimEmblems.yourEmblems"
  | "faction.claimEmblems.noContribution"
  | "faction.claimEmblems.statistics"
  | "faction.claimEmblems.thankYou"
  | "faction.claimEmblems.claimMessage"
  | "faction.claimEmblems.claim"
  | "faction.claimEmblems.congratulations"
  | "faction.claimEmblems.comparison"
  | "faction.claimEmblems.totalMembers"
  | "faction.claimEmblems.totalEmblems"
  | "faction.claimEmblems.percentile"
  | "faction.claimEmblems.travelNow"
  | "faction.claimEmblems.visitMe"
  | "faction.openingSoon"
  | "faction.emblems"
  | "faction.emblems.intro.one"
  | "faction.emblems.intro.two"
  | "faction.emblems.intro.three"
  | "faction.tradeEmblems"
  | "faction.marksBoost"
  | "faction.shop.onlyFor"
  | "faction.shop.welcome";

export type FactionShopDescription =
  | "description.factionShop.sunflorianThrone"
  | "description.factionShop.nightshadeThrone"
  | "description.factionShop.goblinThrone"
  | "description.factionShop.bumpkinThrone"
  | "description.factionShop.goldenSunflorianEgg"
  | "description.factionShop.goblinMischiefEgg"
  | "description.factionShop.bumpkinCharmEgg"
  | "description.factionShop.nightshadeVeilEgg"
  | "description.factionShop.emeraldGoblinGoblet"
  | "description.factionShop.opalSunflorianGoblet"
  | "description.factionShop.sapphireBumpkinGoblet"
  | "description.factionShop.amethystNightshadeGoblet"
  | "description.factionShop.goldenFactionGoblet"
  | "description.factionShop.rubyFactionGoblet"
  | "description.factionShop.sunflorianBunting"
  | "description.factionShop.nightshadeBunting"
  | "description.factionShop.goblinBunting"
  | "description.factionShop.bumpkinBunting"
  | "description.factionShop.sunflorianCandles"
  | "description.factionShop.nightshadeCandles"
  | "description.factionShop.goblinCandles"
  | "description.factionShop.bumpkinCandles"
  | "description.factionShop.sunflorianLeftWallSconce"
  | "description.factionShop.nightshadeLeftWallSconce"
  | "description.factionShop.goblinLeftWallSconce"
  | "description.factionShop.bumpkinLeftWallSconce"
  | "description.factionShop.sunflorianRightWallSconce"
  | "description.factionShop.nightshadeRightWallSconce"
  | "description.factionShop.goblinRightWallSconce"
  | "description.factionShop.bumpkinRightWallSconce"
  | "description.factionShop.cookingBoost"
  | "description.factionShop.cropBoost"
  | "description.factionShop.woodBoost"
  | "description.factionShop.mineralBoost"
  | "description.factionShop.fruitBoost"
  | "description.factionShop.flowerBoost"
  | "description.factionShop.fishBoost"
  | "description.factionShop.sunflorianFactionRug"
  | "description.factionShop.nightshadeFactionRug"
  | "description.factionShop.goblinFactionRug"
  | "description.factionShop.bumpkinFactionRug"
  | "description.factionShop.goblinArmor"
  | "description.factionShop.goblinHelmet"
  | "description.factionShop.goblinPants"
  | "description.factionShop.goblinSabatons"
  | "description.factionShop.goblinAxe"
  | "description.factionShop.sunflorianArmor"
  | "description.factionShop.sunflorianHelmet"
  | "description.factionShop.sunflorianPants"
  | "description.factionShop.sunflorianSabatons"
  | "description.factionShop.sunflorianSword"
  | "description.factionShop.bumpkinArmor"
  | "description.factionShop.bumpkinHelmet"
  | "description.factionShop.bumpkinPants"
  | "description.factionShop.bumpkinSabatons"
  | "description.factionShop.bumpkinSword"
  | "description.factionShop.nightshadeArmor"
  | "description.factionShop.nightshadeHelmet"
  | "description.factionShop.nightshadePants"
  | "description.factionShop.nightshadeSabatons"
  | "description.factionShop.nightshadeSword"
  | "description.factionShop.knightGambit"
  | "description.factionShop.motley"
  | "description.factionShop.royalBraids";

export type FestiveTree =
  | "festivetree.greedyBumpkin"
  | "festivetree.alreadyGifted"
  | "festivetree.notFestiveSeason";

export type FishDescriptions =
  //Fish
  | "description.anchovy.one"
  | "description.anchovy.two"
  | "description.butterflyfish.one"
  | "description.butterflyfish.two"
  | "description.blowfish.one"
  | "description.blowfish.two"
  | "description.clownfish.one"
  | "description.clownfish.two"
  | "description.seabass.one"
  | "description.seabass.two"
  | "description.seahorse.one"
  | "description.seahorse.two"
  | "description.horsemackerel.one"
  | "description.horsemackerel.two"
  | "description.squid.one"
  | "description.squid.two"
  | "description.redsnapper.one"
  | "description.redsnapper.two"
  | "description.morayeel.one"
  | "description.morayeel.two"
  | "description.oliveflounder.one"
  | "description.oliveflounder.two"
  | "description.napoleanfish.one"
  | "description.napoleanfish.two"
  | "description.surgeonfish.one"
  | "description.surgeonfish.two"
  | "description.zebraturkeyfish.one"
  | "description.zebraturkeyfish.two"
  | "description.ray.one"
  | "description.ray.two"
  | "description.hammerheadshark.one"
  | "description.hammerheadshark.two"
  | "description.tuna.one"
  | "description.tuna.two"
  | "description.mahimahi.one"
  | "description.mahimahi.two"
  | "description.bluemarlin.one"
  | "description.bluemarlin.two"
  | "description.oarfish.one"
  | "description.oarfish.two"
  | "description.footballfish.one"
  | "description.footballfish.two"
  | "description.sunfish.one"
  | "description.sunfish.two"
  | "description.coelacanth.one"
  | "description.coelacanth.two"
  | "description.whaleshark.one"
  | "description.whaleshark.two"
  | "description.barredknifejaw.one"
  | "description.barredknifejaw.two"
  | "description.sawshark.one"
  | "description.sawshark.two"
  | "description.whiteshark.one"
  | "description.whiteshark.two"

  //Marine Marvels
  | "description.twilight.anglerfish"
  | "description.starlight.tuna"
  | "description.radiant.ray"
  | "description.phantom.barracuda"
  | "description.gilded.swordfish"
  | "description.crimson.carp"
  | "description.battle.fish";

export type FishermanModal =
  | "fishermanModal.attractFish"
  | "fishermanModal.fishBenefits"
  | "fishermanModal.baitAndResources"
  | "fishermanModal.crazyHappening"
  | "fishermanModal.fullMoon"
  | "fishermanModal.bonusFish"
  | "fishermanModal.dailyLimitReached"
  | "fishermanModal.needCraftRod"
  | "fishermanModal.craft.beach"
  | "fishermanModal.zero.available"
  | "fishermanmodal.greeting";

export type FishermanQuest = "fishermanQuest.Ohno" | "fishermanQuest.Newfish";

export type FishingChallengeIntro =
  | "fishingChallengeIntro.powerfulCatch"
  | "fishingChallengeIntro.useStrength"
  | "fishingChallengeIntro.stopGreenBar"
  | "fishingChallengeIntro.beQuick";

export type FishingGuide =
  | "fishingGuide.catch.rod"
  | "fishingGuide.bait.earn"
  | "fishingGuide.eat.fish"
  | "fishingGuide.discover.fish"
  | "fishingGuide.condition"
  | "fishingGuide.bait.chum"
  | "fishingGuide.legendery.fish";

export type FishingQuests =
  | "quest.basic.fish"
  | "quest.advanced.fish"
  | "quest.all.fish"
  | "quest.300.fish"
  | "quest.1500.fish"
  | "quest.marine.marvel"
  | "quest.5.fish"
  | "quest.sunpetal.savant"
  | "quest.bloom.bigshot"
  | "quest.lily.luminary";

export type FlowerBed =
  | "flowerBedGuide.buySeeds"
  | "flowerBedGuide.crossbreedWithCrops"
  | "flowerBedGuide.collectAllSpecies"
  | "flowerBedGuide.beesProduceHoney"
  | "flowerBedGuide.fillUpBeehive"
  | "flowerBedGuide.beeSwarmsBoost"
  | "flowerBed.newSpecies.discovered"
  | "flowerBedContent.select.combination"
  | "flowerBedContent.select.seed"
  | "flowerBedContent.select.crossbreed";

export type Flowerbreed =
  | "flower.breed.sunflower"
  | "flower.breed.cauliflower"
  | "flower.breed.beetroot"
  | "flower.breed.parsnip"
  | "flower.breed.eggplant"
  | "flower.breed.radish"
  | "flower.breed.kale"
  | "flower.breed.blueberry"
  | "flower.breed.apple"
  | "flower.breed.banana"
  | "flower.breed.redPansy"
  | "flower.breed.yellowPansy"
  | "flower.breed.purplePansy"
  | "flower.breed.whitePansy"
  | "flower.breed.bluePansy"
  | "flower.breed.redCosmos"
  | "flower.breed.yellowCosmos"
  | "flower.breed.purpleCosmos"
  | "flower.breed.whiteCosmos"
  | "flower.breed.blueCosmos"
  | "flower.breed.prismPetal"
  | "flower.breed.redBalloonFlower"
  | "flower.breed.yellowBalloonFlower"
  | "flower.breed.purpleBalloonFlower"
  | "flower.breed.whiteBalloonFlower"
  | "flower.breed.blueBalloonFlower"
  | "flower.breed.redDaffodil"
  | "flower.breed.yellowDaffodil"
  | "flower.breed.purpleDaffodil"
  | "flower.breed.whiteDaffodil"
  | "flower.breed.blueDaffodil"
  | "flower.breed.celestialFrostbloom"
  | "flower.breed.redCarnation"
  | "flower.breed.yellowCarnation"
  | "flower.breed.purpleCarnation"
  | "flower.breed.whiteCarnation"
  | "flower.breed.blueCarnation"
  | "flower.breed.redLotus"
  | "flower.breed.yellowLotus"
  | "flower.breed.purpleLotus"
  | "flower.breed.whiteLotus"
  | "flower.breed.blueLotus"
  | "flower.breed.primulaEnigma";

export type FlowerShopTerms =
  | "flowerShop.desired.dreaming"
  | "flowerShop.desired.delightful"
  | "flowerShop.desired.wonderful"
  | "flowerShop.desired.setMyHeart"
  | "flowerShop.missingPages.alas"
  | "flowerShop.missingPages.cantBelieve"
  | "flowerShop.missingPages.inABind"
  | "flowerShop.missingPages.sadly"
  | "flowerShop.noFlowers.noTrade"
  | "flowerShop.do.have.trade"
  | "flowerShop.do.have.trade.one";

export type FoodDescriptions =
  //Fire Pit
  | "description.pumpkin.soup"
  | "description.mashed.potato"
  | "description.bumpkin.broth"
  | "description.boiled.eggs"
  | "description.kale.stew"
  | "description.mushroom.soup"
  | "description.reindeer.carrot"
  | "description.kale.omelette"
  | "description.cabbers.mash"
  | "description.popcorn"
  | "description.gumbo"
  | "description.rapidRoast"
  | "description.carrotJuice"
  | "description.fishBasket"
  | "description.fishBurger"
  | "description.fishnChips"
  | "description.fishOmelette"
  | "description.friedCalamari"
  | "description.friedTofu"
  | "description.grapeJuice"
  | "description.oceansOlive"
  | "description.quickJuice"
  | "description.riceBun"
  | "description.slowJuice"
  | "description.steamedRedRice"
  | "description.sushiRoll"
  | "description.theLot"
  | "description.tofuScramble"
  | "description.antipasto"

  //Kitchen
  | "description.roast.veggies"
  | "description.bumpkin.salad"
  | "description.goblins.treat"
  | "description.cauliflower.burger"
  | "description.club.sandwich"
  | "description.mushroom.jacket.potatoes"
  | "description.sunflower.crunch"
  | "description.bumpkin.roast"
  | "description.goblin.brunch"
  | "description.fruit.salad"
  | "description.bumpkin.ganoush"
  | "description.chowder"
  | "description.pancakes"
  | "description.beetrootBlaze"

  //Bakery
  | "description.apple.pie"
  | "description.kale.mushroom.pie"
  | "description.cornbread"
  | "description.sunflower.cake"
  | "description.potato.cake"
  | "description.pumpkin.cake"
  | "description.carrot.cake"
  | "description.cabbage.cake"
  | "description.beetroot.cake"
  | "description.cauliflower.cake"
  | "description.parsnip.cake"
  | "description.radish.cake"
  | "description.wheat.cake"
  | "description.honey.cake"
  | "description.eggplant.cake"
  | "description.orange.cake"
  | "description.pirate.cake"

  //Deli
  | "description.blueberry.jam"
  | "description.fermented.carrots"
  | "description.sauerkraut"
  | "description.fancy.fries"
  | "description.fermented.fish"
  | "description.fermented.shroomSyrup"

  //Smoothie Shack
  | "description.apple.juice"
  | "description.orange.juice"
  | "description.purple.smoothie"
  | "description.power.smoothie"
  | "description.bumpkin.detox"
  | "description.banana.blast"

  //Unused foods
  | "description.roasted.cauliflower"
  | "description.radish.pie";

export type GameDescriptions =
  //Quest Items
  | "description.goblin.key"
  | "description.sunflower.key"
  | "description.ancient.goblin.sword"
  | "description.ancient.human.warhammer"
  //Coupons
  | "description.community.coin"
  | "description.bud.seedling"
  | "description.gold.pass"
  | "description.rapid.growth"
  | "description.bud.ticket"
  | "description.potion.ticket"
  | "description.trading.ticket"
  | "description.block.buck"
  | "description.beta.pass"
  | "description.war.bond"
  | "description.allegiance"
  | "description.jack.o.lantern"
  | "description.golden.crop"
  | "description.red.envelope"
  | "description.love.letter"
  | "description.solar.flare.ticket"
  | "description.dawn.breaker.ticket"
  | "description.crow.feather"
  | "description.mermaid.scale"
  | "description.sunflower.supporter"
  | "description.arcade.coin"
  | "description.farmhand.coupon"
  | "description.farmhand"
  | "description.tulip.bulb"
  | "description.treasure.key"
  | "description.rare.key"
  | "description.luxury.key"
  | "description.prizeTicket"
  | "description.babyPanda"
  | "description.baozi"
  | "description.communityEgg"
  | "description.hungryHare"
  | "description.scroll"
  //Easter Items
  | "description.egg.basket"
  | "description.blue.egg"
  | "description.orange.egg"
  | "description.green.egg"
  | "description.yellow.egg"
  | "description.red.egg"
  | "description.pink.egg"
  | "description.purple.egg"
  //Home
  | "description.homeOwnerPainting"
  | "description.goblin.emblem"
  | "description.sunflorian.emblem"
  | "description.bumpkin.emblem"
  | "description.nightshade.emblem"
  | "description.faction.mark";

export type GameTerms =
  | "auction.winner"
  | "bumpkin.level"
  | "bumpkinBuzz"
  | "dailyLim"
  | "farm.banned"
  | "gobSwarm"
  | "granting.wish"
  | "harvest.number"
  | "level.number"
  | "new.delivery.in"
  | "new.delivery.levelup"
  | "no.sfl"
  | "opensea"
  | "polygonscan"
  | "potions"
  | "proof.of.humanity"
  | "sflDiscord"
  | "in.progress"
  | "compost.complete"
  | "aoe.locked"
  | "sunflowerLandCodex"
  | "visiting.farmId"
  | "stock.left"
  | "stock.inStock";

export type GarbageCollector =
  | "garbageCollector.welcome"
  | "garbageCollector.description";

export type GenieLamp = "genieLamp.ready.wish" | "genieLamp.cannotWithdraw";

export type GetContent =
  | "getContent.error"
  | "getContent.joining"
  | "getContent.accessGranted"
  | "getContent.connectToDiscord"
  | "getContent.connect"
  | "getContent.getAccess"
  | "getContent.requires"
  | "getContent.join";

export type GetInputErrorMessage =
  | "getInputErrorMessage.place.bid"
  | "getInputErrorMessage.cannot.bid";

//Delivery NPC
export type GOBLIN_MESSAGES =
  | "goblinMessages.msg1"
  | "goblinMessages.msg2"
  | "goblinMessages.msg3"
  | "goblinMessages.msg4"
  | "goblinMessages.msg5"
  | "goblinMessages.msg6"
  | "goblinMessages.msg7"
  | "goblinMessages.msg8"
  | "goblinMessages.msg9"
  | "goblinMessages.msg10";

export type GoldTooth = "goldTooth.intro.part1" | "goldTooth.intro.part2";

export type GuideCompost =
  | "guide.compost.addEggs.speed"
  | "guide.compost.addEggs"
  | "guide.compost.eggs"
  | "guide.compost.cropGrowthTime"
  | "guide.compost.fishingBait"
  | "guide.compost.placeCrops"
  | "guide.compost.compostCycle"
  | "guide.compost.yieldsWorms"
  | "guide.compost.useEggs"
  | "guide.compost.addEggs.confirmation";

export type GuideTerms =
  | "guide.intro"
  | "gathering.guide.one"
  | "gathering.guide.two"
  | "gathering.guide.three"
  | "crops.guide.one"
  | "crops.guide.two"
  | "crops.guide.three"
  | "building.guide.one"
  | "building.guide.two"
  | "cooking.guide.one"
  | "cooking.guide.two"
  | "cooking.guide.three"
  | "cooking.guide.four"
  | "cooking.guide.five"
  | "animals.guide.one"
  | "animals.guide.two"
  | "animals.guide.three"
  | "crafting.guide.one"
  | "crafting.guide.two"
  | "crafting.guide.three"
  | "crafting.guide.four"
  | "deliveries.guide.one"
  | "deliveries.guide.two"
  | "deliveries.intro"
  | "deliveries.new"
  | "chores.intro"
  | "scavenger.guide.one"
  | "scavenger.guide.two"
  | "fruit.guide.one"
  | "fruit.guide.two"
  | "fruit.guide.three"
  | "seasons.guide.one"
  | "seasons.guide.two"
  | "pete.teaser.one"
  | "pete.teaser.three"
  | "pete.teaser.four"
  | "pete.teaser.five"
  | "pete.teaser.six"
  | "pete.teaser.seven"
  | "pete.teaser.eight";

export type HalveningCountdown =
  | "halveningCountdown.approaching"
  | "halveningCountdown.description"
  | "halveningCountdown.preparation"
  | "halveningCountdown.title";

export type Harvestflower =
  | "harvestflower.noFlowerBed"
  | "harvestflower.noFlower"
  | "harvestflower.notReady"
  | "harvestflower.alr.plant";

export type HarvestBeeHive =
  | "harvestBeeHive.notPlaced"
  | "harvestBeeHive.noHoney";

export type HayseedHankPlaza =
  | "hayseedHankPlaza.cannotCompleteChore"
  | "hayseedHankPlaza.skipChore"
  | "hayseedHankPlaza.canSkipIn"
  | "hayseedHankPlaza.wellDone"
  | "hayseedHankPlaza.lendAHand";

export type HayseedHankV2 =
  | "hayseedHankv2.dialog1"
  | "hayseedHankv2.dialog2"
  | "hayseedHankv2.action"
  | "hayseedHankv2.title"
  | "hayseedHankv2.newChoresAvailable"
  | "hayseedHankv2.skipChores"
  | "hayseedHankv2.greeting";

export type Helper =
  | "helper.highScore1"
  | "helper.highScore2"
  | "helper.highScore3"
  | "helper.midScore1"
  | "helper.midScore2"
  | "helper.midScore3"
  | "helper.lowScore1"
  | "helper.lowScore2"
  | "helper.lowScore3"
  | "helper.veryLowScore1"
  | "helper.veryLowScore2"
  | "helper.veryLowScore3"
  | "helper.noScore1"
  | "helper.noScore2"
  | "helper.noScore3";

export type HeliosSunflower =
  | "heliosSunflower.title"
  | "heliosSunflower.description"
  | "confirmation.craft";

export type HenHouseTerms =
  | "henHouse.chickens"
  | "henHouse.text.one"
  | "henHouse.text.two"
  | "henHouse.text.three"
  | "henHouse.text.four"
  | "henHouse.text.five"
  | "henHouse.text.six";

export type HowToFarm =
  | "howToFarm.title"
  | "howToFarm.stepOne"
  | "howToFarm.stepTwo"
  | "howToFarm.stepThree"
  | "howToFarm.stepFour"
  | "howToFarm.stepFive";

export type HowToSync =
  | "howToSync.title"
  | "howToSync.description"
  | "howToSync.stepOne"
  | "howToSync.stepTwo";

export type HowToUpgrade =
  | "howToUpgrade.title"
  | "howToUpgrade.stepOne"
  | "howToUpgrade.stepTwo"
  | "howToUpgrade.stepThree"
  | "howToUpgrade.stepFour";

export type Islandupgrade =
  | "islandupgrade.confirmUpgrade"
  | "islandupgrade.warning"
  | "islandupgrade.upgradeIsland"
  | "islandupgrade.newOpportunities"
  | "islandupgrade.confirmation"
  | "islandupgrade.locked"
  | "islandupgrade.exploring"
  | "islandupgrade.welcomePetalParadise"
  | "islandupgrade.welcomeDesertIsland"
  | "islandupgrade.itemsReturned"
  | "islandupgrade.notReadyExpandMore"
  | "islandupgrade.exoticResourcesDescription"
  | "islandupgrade.desertResourcesDescription"
  | "islandupgrade.requiredIsland"
  | "islandupgrade.otherIsland";

export type InteractableModals =
  | "interactableModals.returnhome.message"
  | "interactableModals.fatChicken.message"
  | "interactableModals.lazyBud.message"
  | "interactableModals.bud.message"
  | "interactableModals.walrus.message"
  | "interactableModals.plazaBlueBook.message1"
  | "interactableModals.plazaBlueBook.message2"
  | "interactableModals.plazaOrangeBook.message1"
  | "interactableModals.plazaOrangeBook.message2"
  | "interactableModals.beachGreenBook.message1"
  | "interactableModals.beachGreenBook.message2"
  | "interactableModals.beachBlueBook.message1"
  | "interactableModals.beachBlueBook.message2"
  | "interactableModals.beachBlueBook.message3"
  | "interactableModals.beachOrangeBook.message1"
  | "interactableModals.beachOrangeBook.message2"
  | "interactableModals.plazaGreenBook.message1"
  | "interactableModals.plazaGreenBook.message2"
  | "interactableModals.fanArt.winner"
  | "interactableModals.fanArt1.message"
  | "interactableModals.fanArt2.message"
  | "interactableModals.fanArt2.linkLabel"
  | "interactableModals.fanArt3.message"
  | "interactableModals.clubhouseReward.message1"
  | "interactableModals.clubhouseReward.message2"
  | "interactableModals.plazaStatue.message"
  | "interactableModals.dawnBook1.message1"
  | "interactableModals.dawnBook1.message2"
  | "interactableModals.dawnBook1.message3"
  | "interactableModals.dawnBook2.message1"
  | "interactableModals.dawnBook2.message2"
  | "interactableModals.dawnBook3.message1"
  | "interactableModals.dawnBook3.message2"
  | "interactableModals.dawnBook3.message3"
  | "interactableModals.dawnBook4.message1"
  | "interactableModals.dawnBook4.message2"
  | "interactableModals.dawnBook4.message3"
  | "interactableModals.timmyHome.message"
  | "interactableModals.windmill.message"
  | "interactableModals.igorHome.message"
  | "interactableModals.potionHouse.message1"
  | "interactableModals.potionHouse.message2"
  | "interactableModals.guildHouse.message"
  | "interactableModals.guildHouse.budsCollection"
  | "interactableModals.bettyHome.message"
  | "interactableModals.bertHome.message"
  | "interactableModals.beach.message1"
  | "interactableModals.beach.message2"
  | "interactableModals.castle.message"
  | "interactableModals.woodlands.message"
  | "interactableModals.port.message";

export type Intro =
  | "intro.one"
  | "intro.two"
  | "intro.three"
  | "intro.four"
  | "intro.five";

export type IntroPage =
  | "introPage.welcome"
  | "introPage.description"
  | "introPage.mission"
  | "introPage.tip"
  | "introPage.chaosPotion"
  | "introPage.playButton";

export type IslandName =
  | "island.home"
  | "island.pumpkin.plaza"
  | "island.beach"
  | "island.kingdom"
  | "island.woodlands"
  | "island.helios"
  | "island.goblin.retreat";

export type IslandNotFound =
  | "islandNotFound.message"
  | "islandNotFound.takeMeHome";

export type LandscapeTerms =
  | "landscape.intro.one"
  | "landscape.intro.two"
  | "landscape.intro.three"
  | "landscape.intro.four"
  | "landscape.expansion.one"
  | "landscape.expansion.two"
  | "landscape.timerPopover"
  | "landscape.dragMe"
  | "landscape.expansion.date"
  | "landscape.great.work";

export type LetsGo =
  | "letsGo.title"
  | "letsGo.description"
  | "letsGo.readMore"
  | "letsGo.officialDocs";

export type LevelUpMessages =
  | "levelUp.2"
  | "levelUp.3"
  | "levelUp.4"
  | "levelUp.5"
  | "levelUp.6"
  | "levelUp.7"
  | "levelUp.8"
  | "levelUp.9"
  | "levelUp.10"
  | "levelUp.11"
  | "levelUp.12"
  | "levelUp.13"
  | "levelUp.14"
  | "levelUp.15"
  | "levelUp.16"
  | "levelUp.17"
  | "levelUp.18"
  | "levelUp.19"
  | "levelUp.20"
  | "levelUp.21"
  | "levelUp.22"
  | "levelUp.23"
  | "levelUp.24"
  | "levelUp.25"
  | "levelUp.26"
  | "levelUp.27"
  | "levelUp.28"
  | "levelUp.29"
  | "levelUp.30"
  | "levelUp.31"
  | "levelUp.32"
  | "levelUp.33"
  | "levelUp.34"
  | "levelUp.35"
  | "levelUp.36"
  | "levelUp.37"
  | "levelUp.38"
  | "levelUp.39"
  | "levelUp.40"
  | "levelUp.41"
  | "levelUp.42"
  | "levelUp.43"
  | "levelUp.44"
  | "levelUp.45"
  | "levelUp.46"
  | "levelUp.47"
  | "levelUp.48"
  | "levelUp.49"
  | "levelUp.50"
  | "levelUp.51"
  | "levelUp.52"
  | "levelUp.53"
  | "levelUp.54"
  | "levelUp.55"
  | "levelUp.56"
  | "levelUp.57"
  | "levelUp.58"
  | "levelUp.59"
  | "levelUp.60";

export type Loser = "loser.unsuccess" | "loser.longer" | "loser.refund.one";

export type LostSunflorian =
  | "lostSunflorian.line1"
  | "lostSunflorian.line2"
  | "lostSunflorian.line3";

export type MegaStore =
  | "megaStore.message"
  | "megaStore.month.sale"
  | "megaStore.wearable"
  | "megaStore.collectible"
  | "megaStore.timeRemaining";

export type MilestoneMessages =
  | "milestone.noviceAngler"
  | "milestone.advancedAngler"
  | "milestone.expertAngler"
  | "milestone.fishEncyclopedia"
  | "milestone.masterAngler"
  | "milestone.marineMarvelMaster"
  | "milestone.deepSeaDiver"
  | "milestone.sunpetalSavant"
  | "milestone.bloomBigShot"
  | "milestone.lilyLuminary";

export type ModalDescription =
  | "modalDescription.friend"
  | "modalDescription.love.fruit"
  | "modalDescription.gift"
  | "modalDescription.limited.abilities"
  | "modalDescription.trail";

export type Noaccount =
  | "noaccount.newFarmer"
  | "noaccount.addPromoCode"
  | "noaccount.alreadyHaveNFTFarm"
  | "noaccount.createFarm"
  | "noaccount.noFarmNFTs"
  | "noaccount.createNewFarm"
  | "noaccount.selectNFTID"
  | "noaccount.welcomeMessage"
  | "noaccount.promoCodeLabel"
  | "noaccount.haveFarm"
  | "noaccount.letsGo";

export type NoBumpkin =
  | "noBumpkin.readyToFarm"
  | "noBumpkin.play"
  | "noBumpkin.missingBumpkin"
  | "noBumpkin.bumpkinNFT"
  | "noBumpkin.bumpkinHelp"
  | "noBumpkin.mintBumpkin"
  | "noBumpkin.allBumpkins"
  | "noBumpkin.chooseBumpkin"
  | "noBumpkin.deposit"
  | "noBumpkin.advancedIsland"
  | "noBumpkin.nude"
  | "dequipper.noBumpkins"
  | "dequipper.missingBumpkins"
  | "dequipper.intro"
  | "dequipper.warning"
  | "dequipper.success"
  | "dequipper.nude"
  | "dequipper.dequip";

export type NoTownCenter =
  | "noTownCenter.reward"
  | "noTownCenter.news"
  | "noTownCenter.townCenterPlacement";

export type NotOnDiscordServer =
  | "notOnDiscordServer.intro"
  | "notOnDiscordServer.joinDiscord"
  | "notOnDiscordServer.discordServer"
  | "notOnDiscordServer.completeVerification"
  | "notOnDiscordServer.acceptRules";

export type NFTMinting =
  | "nftminting.mintAccountNFT"
  | "nftminting.mintingYourNFT"
  | "nftminting.almostThere";

export type NPC_MESSAGE =
  //Betty
  | "npcMessages.betty.msg1"
  | "npcMessages.betty.msg2"
  | "npcMessages.betty.msg3"
  | "npcMessages.betty.msg4"
  | "npcMessages.betty.msg5"
  | "npcMessages.betty.msg6"
  | "npcMessages.betty.msg7"
  //Blacksmith
  | "npcMessages.blacksmith.msg1"
  | "npcMessages.blacksmith.msg2"
  | "npcMessages.blacksmith.msg3"
  | "npcMessages.blacksmith.msg4"
  | "npcMessages.blacksmith.msg5"
  | "npcMessages.blacksmith.msg6"
  | "npcMessages.blacksmith.msg7"
  //pumpkin' pete
  | "npcMessages.pumpkinpete.msg1"
  | "npcMessages.pumpkinpete.msg2"
  | "npcMessages.pumpkinpete.msg3"
  | "npcMessages.pumpkinpete.msg4"
  | "npcMessages.pumpkinpete.msg5"
  | "npcMessages.pumpkinpete.msg6"
  | "npcMessages.pumpkinpete.msg7"
  //Cornwell
  | "npcMessages.cornwell.msg1"
  | "npcMessages.cornwell.msg2"
  | "npcMessages.cornwell.msg3"
  | "npcMessages.cornwell.msg4"
  | "npcMessages.cornwell.msg5"
  | "npcMessages.cornwell.msg6"
  | "npcMessages.cornwell.msg7"
  //Raven
  | "npcMessages.raven.msg1"
  | "npcMessages.raven.msg2"
  | "npcMessages.raven.msg3"
  | "npcMessages.raven.msg4"
  | "npcMessages.raven.msg5"
  | "npcMessages.raven.msg6"
  | "npcMessages.raven.msg7"
  //Bert
  | "npcMessages.bert.msg1"
  | "npcMessages.bert.msg2"
  | "npcMessages.bert.msg3"
  | "npcMessages.bert.msg4"
  | "npcMessages.bert.msg5"
  | "npcMessages.bert.msg6"
  | "npcMessages.bert.msg7"
  //Timmy
  | "npcMessages.timmy.msg1"
  | "npcMessages.timmy.msg2"
  | "npcMessages.timmy.msg3"
  | "npcMessages.timmy.msg4"
  | "npcMessages.timmy.msg5"
  | "npcMessages.timmy.msg6"
  | "npcMessages.timmy.msg7"
  //Tywin
  | "npcMessages.tywin.msg1"
  | "npcMessages.tywin.msg2"
  | "npcMessages.tywin.msg3"
  | "npcMessages.tywin.msg4"
  | "npcMessages.tywin.msg5"
  | "npcMessages.tywin.msg6"
  | "npcMessages.tywin.msg7"
  //Tango
  | "npcMessages.tango.msg1"
  | "npcMessages.tango.msg2"
  | "npcMessages.tango.msg3"
  | "npcMessages.tango.msg4"
  | "npcMessages.tango.msg5"
  | "npcMessages.tango.msg6"
  | "npcMessages.tango.msg7"
  //Miranda
  | "npcMessages.miranda.msg1"
  | "npcMessages.miranda.msg2"
  | "npcMessages.miranda.msg3"
  | "npcMessages.miranda.msg4"
  | "npcMessages.miranda.msg5"
  | "npcMessages.miranda.msg6"
  | "npcMessages.miranda.msg7"
  //Finn
  | "npcMessages.finn.msg1"
  | "npcMessages.finn.msg2"
  | "npcMessages.finn.msg3"
  | "npcMessages.finn.msg4"
  | "npcMessages.finn.msg5"
  | "npcMessages.finn.msg6"
  | "npcMessages.finn.msg7"
  | "npcMessages.finn.msg8"
  //indley
  | "npcMessages.findley.msg1"
  | "npcMessages.findley.msg2"
  | "npcMessages.findley.msg3"
  | "npcMessages.findley.msg4"
  | "npcMessages.findley.msg5"
  | "npcMessages.findley.msg6"
  | "npcMessages.findley.msg7"
  | "npcMessages.findley.msg8"
  | "npcMessages.findley.msg9"
  //Corale
  | "npcMessages.corale.msg1"
  | "npcMessages.corale.msg2"
  | "npcMessages.corale.msg3"
  | "npcMessages.corale.msg4"
  | "npcMessages.corale.msg5"
  | "npcMessages.corale.msg6"
  | "npcMessages.corale.msg7"
  //helly
  | "npcMessages.shelly.msg1"
  | "npcMessages.shelly.msg2"
  | "npcMessages.shelly.msg3"
  | "npcMessages.shelly.msg4"
  | "npcMessages.shelly.msg5"
  | "npcMessages.shelly.msg6"
  | "npcMessages.shelly.msg7"
  | "npcMessages.shelly.msg8"
  | "npcMessages.gambit.msg1"
  | "npcMessages.gambit.msg2"
  | "npcMessages.gambit.msg3"
  | "npcMessages.gambit.msg4"
  | "npcMessages.gambit.msg5"
  | "npcMessages.gambit.msg6"
  | "npcMessages.gambit.msg7"
  | "npcMessages.gambit.msg8"
  | "npcMessages.gambit.msg9"
  | "npcMessages.queenVictoria.msg1"
  | "npcMessages.queenVictoria.msg2"
  | "npcMessages.queenVictoria.msg3"
  | "npcMessages.queenVictoria.msg4"
  | "npcMessages.queenVictoria.msg5"
  | "npcMessages.queenVictoria.msg6"
  | "npcMessages.queenVictoria.msg7"
  | "npcMessages.queenVictoria.msg8"
  | "npcMessages.queenVictoria.msg9"
  | "npcMessages.jester.msg1"
  | "npcMessages.jester.msg2"
  | "npcMessages.jester.msg3"
  | "npcMessages.jester.msg4"
  | "npcMessages.jester.msg5"
  | "npcMessages.jester.msg6"
  | "npcMessages.jester.msg7"
  | "npcMessages.jester.msg8"
  | "npcMessages.jester.msg9";

export type Npc =
  | "npc.Modal.Hammer"
  | "npc.Modal.Marcus"
  | "npc.Modal.Billy"
  | "npc.Modal.Billy.one"
  | "npc.Modal.Billy.two"
  | "npc.Modal.Gabi"
  | "npc.Modal.Gabi.one"
  | "npc.Modal.Craig"
  | "npc.Modal.Craig.one";

export type NpcDialogues =
  //Blacksmith Intro
  | "npcDialogues.blacksmith.intro1"
  | "npcDialogues.blacksmith.intro2"
  | "npcDialogues.blacksmith.intro3"
  | "npcDialogues.blacksmith.intro4"
  //Blacksmith Positive Delivery
  | "npcDialogues.blacksmith.positiveDelivery1"
  | "npcDialogues.blacksmith.positiveDelivery2"
  | "npcDialogues.blacksmith.positiveDelivery3"
  | "npcDialogues.blacksmith.positiveDelivery4"
  | "npcDialogues.blacksmith.positiveDelivery5"
  //Blacksmith Negative Delivery
  | "npcDialogues.blacksmith.negativeDelivery1"
  | "npcDialogues.blacksmith.negativeDelivery2"
  | "npcDialogues.blacksmith.negativeDelivery3"
  | "npcDialogues.blacksmith.negativeDelivery4"
  | "npcDialogues.blacksmith.negativeDelivery5"
  //Blacksmith NoOrder
  | "npcDialogues.blacksmith.noOrder1"
  | "npcDialogues.blacksmith.noOrder2"
  //Betty Intro
  | "npcDialogues.betty.intro1"
  | "npcDialogues.betty.intro2"
  | "npcDialogues.betty.intro3"
  | "npcDialogues.betty.intro4"
  | "npcDialogues.betty.intro5"
  //Betty Positive Delivery
  | "npcDialogues.betty.positiveDelivery1"
  | "npcDialogues.betty.positiveDelivery2"
  | "npcDialogues.betty.positiveDelivery3"
  | "npcDialogues.betty.positiveDelivery4"
  | "npcDialogues.betty.positiveDelivery5"
  //Betty Negative Delivery
  | "npcDialogues.betty.negativeDelivery1"
  | "npcDialogues.betty.negativeDelivery2"
  | "npcDialogues.betty.negativeDelivery3"
  | "npcDialogues.betty.negativeDelivery4"
  | "npcDialogues.betty.negativeDelivery5"
  //Betty NoOrder
  | "npcDialogues.betty.noOrder1"
  | "npcDialogues.betty.noOrder2"
  //Grimbly Intro
  | "npcDialogues.grimbly.intro1"
  | "npcDialogues.grimbly.intro2"
  | "npcDialogues.grimbly.intro3"
  | "npcDialogues.grimbly.intro4"
  //Grimbly Positive Delivery
  | "npcDialogues.grimbly.positiveDelivery1"
  | "npcDialogues.grimbly.positiveDelivery2"
  | "npcDialogues.grimbly.positiveDelivery3"
  | "npcDialogues.grimbly.positiveDelivery4"
  //Grimbly Negative Delivery
  | "npcDialogues.grimbly.negativeDelivery1"
  | "npcDialogues.grimbly.negativeDelivery2"
  | "npcDialogues.grimbly.negativeDelivery3"
  | "npcDialogues.grimbly.negativeDelivery4"
  //Grimbly NoOrder
  | "npcDialogues.grimbly.noOrder1"
  | "npcDialogues.grimbly.noOrder2"
  //Grimtootk Intro
  | "npcDialogues.grimtooth.intro1"
  | "npcDialogues.grimtooth.intro2"
  | "npcDialogues.grimtooth.intro3"
  | "npcDialogues.grimtooth.intro4"
  //Grimtootk Positive Delivery
  | "npcDialogues.grimtooth.positiveDelivery1"
  | "npcDialogues.grimtooth.positiveDelivery2"
  | "npcDialogues.grimtooth.positiveDelivery3"
  | "npcDialogues.grimtooth.positiveDelivery4"
  //Grimtootk Negative Delivery
  | "npcDialogues.grimtooth.negativeDelivery1"
  | "npcDialogues.grimtooth.negativeDelivery2"
  | "npcDialogues.grimtooth.negativeDelivery3"
  | "npcDialogues.grimtooth.negativeDelivery4"
  //Grimtootk NoOrder
  | "npcDialogues.grimtooth.noOrder1"
  | "npcDialogues.grimtooth.noOrder2"
  //Old Salty Intro
  | "npcDialogues.oldSalty.intro1"
  | "npcDialogues.oldSalty.intro2"
  | "npcDialogues.oldSalty.intro3"
  //Old Salty Positive
  | "npcDialogues.oldSalty.positiveDelivery1"
  | "npcDialogues.oldSalty.positiveDelivery2"
  | "npcDialogues.oldSalty.positiveDelivery3"
  //Old Salty Negative
  | "npcDialogues.oldSalty.negativeDelivery1"
  | "npcDialogues.oldSalty.negativeDelivery2"
  | "npcDialogues.oldSalty.negativeDelivery3"
  //Old Salty NoOrder
  | "npcDialogues.oldSalty.noOrder1"
  | "npcDialogues.oldSalty.noOrder2"
  //Raven Intro
  | "npcDialogues.raven.intro1"
  | "npcDialogues.raven.intro2"
  | "npcDialogues.raven.intro3"
  | "npcDialogues.raven.intro4"
  //Raven Positive Delivery
  | "npcDialogues.raven.positiveDelivery1"
  | "npcDialogues.raven.positiveDelivery2"
  | "npcDialogues.raven.positiveDelivery3"
  | "npcDialogues.raven.positiveDelivery4"
  //Raven Negative Delivery
  | "npcDialogues.raven.negativeDelivery1"
  | "npcDialogues.raven.negativeDelivery2"
  | "npcDialogues.raven.negativeDelivery3"
  //Raven NoOrder
  | "npcDialogues.raven.noOrder1"
  | "npcDialogues.raven.noOrder2"
  //Tywin Intro
  | "npcDialogues.tywin.intro1"
  | "npcDialogues.tywin.intro2"
  | "npcDialogues.tywin.intro3"
  | "npcDialogues.tywin.intro4"
  //Tywin Positive Delivery
  | "npcDialogues.tywin.positiveDelivery1"
  | "npcDialogues.tywin.positiveDelivery2"
  | "npcDialogues.tywin.positiveDelivery3"
  | "npcDialogues.tywin.positiveDelivery4"
  //Tywin Negative Delivery
  | "npcDialogues.tywin.negativeDelivery1"
  | "npcDialogues.tywin.negativeDelivery2"
  | "npcDialogues.tywin.negativeDelivery3"
  | "npcDialogues.tywin.negativeDelivery4"
  //Tywin NoOrder
  | "npcDialogues.tywin.noOrder1"
  | "npcDialogues.tywin.noOrder2"
  //ert Intro
  | "npcDialogues.bert.intro1"
  | "npcDialogues.bert.intro2"
  | "npcDialogues.bert.intro3"
  | "npcDialogues.bert.intro4"
  | "bert.day"
  //ert Positive Delivery
  | "npcDialogues.bert.positiveDelivery1"
  | "npcDialogues.bert.positiveDelivery2"
  | "npcDialogues.bert.positiveDelivery3"
  | "npcDialogues.bert.positiveDelivery4"
  //ert Negative Delivery
  | "npcDialogues.bert.negativeDelivery1"
  | "npcDialogues.bert.negativeDelivery2"
  | "npcDialogues.bert.negativeDelivery3"
  | "npcDialogues.bert.negativeDelivery4"
  //ert NoOrder
  | "npcDialogues.bert.noOrder1"
  | "npcDialogues.bert.noOrder2"
  //Timmy Intro
  | "npcDialogues.timmy.intro1"
  | "npcDialogues.timmy.intro2"
  | "npcDialogues.timmy.intro3"
  | "npcDialogues.timmy.intro4"
  | "npcDialogues.timmy.intro5"
  //Timmy Positive Delivery
  | "npcDialogues.timmy.positiveDelivery1"
  | "npcDialogues.timmy.positiveDelivery2"
  | "npcDialogues.timmy.positiveDelivery3"
  | "npcDialogues.timmy.positiveDelivery4"
  | "npcDialogues.timmy.positiveDelivery5"
  //Timmy Negative Delivery
  | "npcDialogues.timmy.negativeDelivery1"
  | "npcDialogues.timmy.negativeDelivery2"
  | "npcDialogues.timmy.negativeDelivery3"
  | "npcDialogues.timmy.negativeDelivery4"
  | "npcDialogues.timmy.negativeDelivery5"
  //Timmy NoOrder
  | "npcDialogues.timmy.noOrder1"
  | "npcDialogues.timmy.noOrder2"
  //Cornwell Intro
  | "npcDialogues.cornwell.intro1"
  | "npcDialogues.cornwell.intro2"
  | "npcDialogues.cornwell.intro3"
  | "npcDialogues.cornwell.intro4"
  | "npcDialogues.cornwell.intro5"
  //Cornwell Positive Delivery
  | "npcDialogues.cornwell.positiveDelivery1"
  | "npcDialogues.cornwell.positiveDelivery2"
  | "npcDialogues.cornwell.positiveDelivery3"
  | "npcDialogues.cornwell.positiveDelivery4"
  | "npcDialogues.cornwell.positiveDelivery5"
  //Cornwell Negative Delivery
  | "npcDialogues.cornwell.negativeDelivery1"
  | "npcDialogues.cornwell.negativeDelivery2"
  | "npcDialogues.cornwell.negativeDelivery3"
  | "npcDialogues.cornwell.negativeDelivery4"
  | "npcDialogues.cornwell.negativeDelivery5"
  //Cornwell No Order
  | "npcDialogues.cornwell.noOrder1"
  | "npcDialogues.cornwell.noOrder2"
  | "npcDialogues.cornwell.noOrder3"
  | "npcDialogues.cornwell.noOrder4"
  //Pumpkin Pete Intor
  | "npcDialogues.pumpkinPete.intro1"
  | "npcDialogues.pumpkinPete.intro2"
  | "npcDialogues.pumpkinPete.intro3"
  | "npcDialogues.pumpkinPete.intro4"
  | "npcDialogues.pumpkinPete.intro5"
  //Pumpkin Pete Positive Delivery
  | "npcDialogues.pumpkinPete.positiveDelivery1"
  | "npcDialogues.pumpkinPete.positiveDelivery2"
  | "npcDialogues.pumpkinPete.positiveDelivery3"
  | "npcDialogues.pumpkinPete.positiveDelivery4"
  | "npcDialogues.pumpkinPete.positiveDelivery5"
  //Pumpkin Pete Negative Delivery
  | "npcDialogues.pumpkinPete.negativeDelivery1"
  | "npcDialogues.pumpkinPete.negativeDelivery2"
  | "npcDialogues.pumpkinPete.negativeDelivery3"
  | "npcDialogues.pumpkinPete.negativeDelivery4"
  | "npcDialogues.pumpkinPete.negativeDelivery5"
  //Pumpkin Pete NoOrder
  | "npcDialogues.pumpkinPete.noOrder1"
  | "npcDialogues.pumpkinPete.noOrder2"

  // NPC Gift Dialogue
  | "npcDialogues.default.locked"
  | "npcDialogues.default.flowerIntro"
  | "npcDialogues.default.averageFlower"
  | "npcDialogues.default.badFlower"
  | "npcDialogues.default.goodFlower"
  | "npcDialogues.default.reward"
  | "npcDialogues.pumpkinPete.reward"
  | "npcDialogues.pumpkinPete.flowerIntro"
  | "npcDialogues.pumpkinPete.averageFlower"
  | "npcDialogues.pumpkinPete.badFlower"
  | "npcDialogues.pumpkinPete.goodFlower"
  | "npcDialogues.betty.reward"
  | "npcDialogues.betty.flowerIntro"
  | "npcDialogues.betty.averageFlower"
  | "npcDialogues.betty.badFlower"
  | "npcDialogues.betty.goodFlower"
  | "npcDialogues.blacksmith.reward"
  | "npcDialogues.blacksmith.flowerIntro"
  | "npcDialogues.blacksmith.averageFlower"
  | "npcDialogues.blacksmith.badFlower"
  | "npcDialogues.blacksmith.goodFlower"
  | "npcDialogues.bert.reward"
  | "npcDialogues.bert.flowerIntro"
  | "npcDialogues.bert.averageFlower"
  | "npcDialogues.bert.badFlower"
  | "npcDialogues.bert.goodFlower"
  | "npcDialogues.finn.reward"
  | "npcDialogues.finn.flowerIntro"
  | "npcDialogues.finn.averageFlower"
  | "npcDialogues.finn.badFlower"
  | "npcDialogues.finn.goodFlower"
  | "npcDialogues.finley.reward"
  | "npcDialogues.finley.flowerIntro"
  | "npcDialogues.finley.averageFlower"
  | "npcDialogues.finley.badFlower"
  | "npcDialogues.finley.goodFlower"
  | "npcDialogues.corale.reward"
  | "npcDialogues.corale.flowerIntro"
  | "npcDialogues.corale.averageFlower"
  | "npcDialogues.corale.badFlower"
  | "npcDialogues.corale.goodFlower"
  | "npcDialogues.raven.reward"
  | "npcDialogues.raven.flowerIntro"
  | "npcDialogues.raven.averageFlower"
  | "npcDialogues.raven.badFlower"
  | "npcDialogues.raven.goodFlower"
  | "npcDialogues.miranda.reward"
  | "npcDialogues.miranda.flowerIntro"
  | "npcDialogues.miranda.averageFlower"
  | "npcDialogues.miranda.badFlower"
  | "npcDialogues.miranda.goodFlower"
  | "npcDialogues.cornwell.reward"
  | "npcDialogues.cornwell.flowerIntro"
  | "npcDialogues.cornwell.averageFlower"
  | "npcDialogues.cornwell.badFlower"
  | "npcDialogues.cornwell.goodFlower"
  | "npcDialogues.tywin.reward"
  | "npcDialogues.tywin.flowerIntro"
  | "npcDialogues.tywin.averageFlower"
  | "npcDialogues.tywin.badFlower"
  | "npcDialogues.tywin.goodFlower"

  // Queen Victoria NoOrde
  | "npcDialogues.queenVictoria.intro1"
  | "npcDialogues.queenVictoria.intro2"
  | "npcDialogues.queenVictoria.intro3"
  | "npcDialogues.queenVictoria.intro4"
  | "npcDialogues.queenVictoria.intro5"
  | "npcDialogues.queenVictoria.positiveDelivery1"
  | "npcDialogues.queenVictoria.positiveDelivery2"
  | "npcDialogues.queenVictoria.positiveDelivery3"
  | "npcDialogues.queenVictoria.positiveDelivery4"
  | "npcDialogues.queenVictoria.positiveDelivery5"
  | "npcDialogues.queenVictoria.negativeDelivery1"
  | "npcDialogues.queenVictoria.negativeDelivery2"
  | "npcDialogues.queenVictoria.negativeDelivery3"
  | "npcDialogues.queenVictoria.negativeDelivery4"
  | "npcDialogues.queenVictoria.negativeDelivery5"
  | "npcDialogues.queenVictoria.noOrder1"
  | "npcDialogues.queenVictoria.noOrder2"
  | "npcDialogues.queenVictoria.reward"
  | "npcDialogues.queenVictoria.flowerIntro"
  | "npcDialogues.queenVictoria.averageFlower"
  | "npcDialogues.queenVictoria.badFlower"
  | "npcDialogues.queenVictoria.goodFlower"
  // Gambit
  | "npcDialogues.gambit.intro1"
  | "npcDialogues.gambit.intro2"
  | "npcDialogues.gambit.intro3"
  | "npcDialogues.gambit.intro4"
  | "npcDialogues.gambit.intro5"
  | "npcDialogues.gambit.positiveDelivery1"
  | "npcDialogues.gambit.positiveDelivery2"
  | "npcDialogues.gambit.positiveDelivery3"
  | "npcDialogues.gambit.positiveDelivery4"
  | "npcDialogues.gambit.positiveDelivery5"
  | "npcDialogues.gambit.negativeDelivery1"
  | "npcDialogues.gambit.negativeDelivery2"
  | "npcDialogues.gambit.negativeDelivery3"
  | "npcDialogues.gambit.negativeDelivery4"
  | "npcDialogues.gambit.negativeDelivery5"
  | "npcDialogues.gambit.noOrder1"
  | "npcDialogues.gambit.noOrder2"
  // Jester
  | "npcDialogues.jester.intro1"
  | "npcDialogues.jester.intro2"
  | "npcDialogues.jester.intro3"
  | "npcDialogues.jester.intro4"
  | "npcDialogues.jester.intro5"
  | "npcDialogues.jester.positiveDelivery1"
  | "npcDialogues.jester.positiveDelivery2"
  | "npcDialogues.jester.positiveDelivery3"
  | "npcDialogues.jester.positiveDelivery4"
  | "npcDialogues.jester.positiveDelivery5"
  | "npcDialogues.jester.negativeDelivery1"
  | "npcDialogues.jester.negativeDelivery2"
  | "npcDialogues.jester.negativeDelivery3"
  | "npcDialogues.jester.negativeDelivery4"
  | "npcDialogues.jester.negativeDelivery5"
  | "npcDialogues.jester.noOrder1"
  | "npcDialogues.jester.noOrder2"
  | "npcDialogues.jester.reward"
  | "npcDialogues.jester.flowerIntro"
  | "npcDialogues.jester.averageFlower"
  | "npcDialogues.jester.badFlower"
  | "npcDialogues.jester.goodFlower"
  | "npcDialogues.tywin.goodFlower";

export type NyeButton = "plaza.magicButton.query";

export type ObsessionDialogue =
  | "obsessionDialogue.line1"
  | "obsessionDialogue.line2"
  | "obsessionDialogue.line3"
  | "obsessionDialogue.line4"
  | "obsessionDialogue.line5";

export type Offer =
  | "offer.okxOffer"
  | "offer.beginWithNFT"
  | "offer.getStarterPack"
  | "offer.newHere"
  | "offer.getStarted"
  | "offer.not.enough.BlockBucks";

export type Onboarding =
  | "onboarding.welcome"
  | "onboarding.step.one"
  | "onboarding.step.two"
  | "onboarding.step.three"
  | "onboarding.intro.one"
  | "onboarding.intro.two"
  | "onboarding.cheer"
  | "onboarding.form.one"
  | "onboarding.form.two"
  | "onboarding.duplicateUser.one"
  | "onboarding.duplicateUser.two"
  | "onboarding.starterPack"
  | "onboarding.settingWallet"
  | "onboarding.wallet.one"
  | "onboarding.wallet.two"
  | "onboarding.wallet.haveWallet"
  | "onboarding.wallet.createButton"
  | "onboarding.wallet.acceptButton"
  | "onboarding.buyFarm.title"
  | "onboarding.buyFarm.one"
  | "onboarding.buyFarm.two"
  | "onboarding.wallet.already";

export type OnCollectReward =
  | "onCollectReward.Missing.Seed"
  | "onCollectReward.Market"
  | "onCollectReward.Missing.Shovel"
  | "onCollectReward.Missing.Shovel.description";

export type OrderHelp =
  | "orderhelp.Skip.hour"
  | "orderhelp.New.Season"
  | "orderhelp.New.Season.arrival"
  | "orderhelp.Wisely"
  | "orderhelp.SkipIn"
  | "orderhelp.NoRight"
  | "orderhelp.ticket.deliveries.closed";

export type Pending = "pending.calcul" | "pending.comeback";

export type PersonHood =
  | "personHood.Details"
  | "personHood.Identify"
  | "personHood.Congrat";

export type PirateChest =
  | "piratechest.greeting"
  | "piratechest.refreshesIn"
  | "piratechest.warning";

export type PirateQuest =
  | "questDescription.farmerQuest1"
  | "questDescription.fruitQuest1"
  | "questDescription.fruitQuest2"
  | "questDescription.fruitQuest3"
  | "questDescription.pirateQuest1"
  | "questDescription.pirateQuest2"
  | "questDescription.pirateQuest3"
  | "questDescription.pirateQuest4"
  | "piratequest.welcome"
  | "piratequest.finestPirate";

export type Pickserver =
  | "pickserver.server"
  | "pickserver.full"
  | "pickserver.explore"
  | "pickserver.built";

export type PlayerTrade =
  | "playerTrade.no.trade"
  | "playerTrade.max.item"
  | "playerTrade.Progress"
  | "playerTrade.transaction"
  | "playerTrade.Please"
  | "playerTrade.sold"
  | "playerTrade.sale"
  | "playerTrade.title.congrat";

export type Portal =
  | "portal.wrong"
  | "portal.unauthorised"
  | "portal.example.intro"
  | "portal.example.purchase"
  | "portal.example.claimPrize";

export type PurchaseableBaitTranslation =
  | "purchaseableBait.fishingLure.description";

export type Quest =
  | "quest.mint.free"
  | "quest.equipWearable"
  | "quest.congrats";

export type Questions = "questions.obtain.MATIC" | "questions.lowCash";

export type Reaction =
  | "reaction.bumpkin"
  | "reaction.bumpkin.10"
  | "reaction.bumpkin.30"
  | "reaction.bumpkin.40"
  | "reaction.sunflowers"
  | "reaction.crops"
  | "reaction.goblin"
  | "reaction.crown";

export type ReactionBud =
  | "reaction.bud.show"
  | "reaction.bud.select"
  | "reaction.bud.noFound";

export type Refunded = "refunded.itemsReturned" | "refunded.goodLuck";

export type RemoveHungryCaterpillar =
  | "removeHungryCaterpillar.title"
  | "removeHungryCaterpillar.description"
  | "removeHungryCaterpillar.confirmation"
  | "removeHungryCaterpillar.removeFlowerSeeds";

export type RemoveKuebiko =
  | "removeKuebiko.title"
  | "removeKuebiko.description"
  | "removeKuebiko.removeSeeds";

export type RemoveCropMachine =
  | "removeCropMachine.title"
  | "removeCropMachine.description";

export type Resale = "resale.actionText";

export type ResourceTerms =
  | "chicken.description"
  | "magicMushroom.description"
  | "wildMushroom.description"
  | "honey.description";

export type Restock =
  | "restock.one.buck"
  | "restock.sure"
  | "restock.tooManySeeds"
  | "seeds.reachingInventoryLimit";

export type RetreatTerms =
  | "retreatTerms.lookingForRareItems"
  | "retreatTerms.resale.one"
  | "retreatTerms.resale.two"
  | "retreatTerms.resale.three";

export type Resources =
  | "resources.recoversIn"
  | "resources.boulder.rareMineFound"
  | "resources.boulder.advancedMining";

export type RewardTerms =
  | "reward.daily.reward"
  | "reward.streak"
  | "reward.comeBackLater"
  | "reward.nextBonus"
  | "reward.unlock"
  | "reward.open"
  | "reward.lvlRequirement"
  | "reward.whatCouldItBe"
  | "reward.streakBonus"
  | "reward.found"
  | "reward.spendWisely"
  | "reward.wearable"
  | "reward.woohoo"
  | "reward.promo.code"
  | "reward.connectWeb3Wallet"
  | "reward.factionPoints";

export type RulesGameStart =
  | "rules.gameStart"
  | "rules.chaosPotionRule"
  | "rules.potion.feedback"
  | "BloomBoost.description"
  | "DreamDrip.description"
  | "EarthEssence.description"
  | "FlowerPower.description"
  | "SilverSyrup.description"
  | "HappyHooch.description"
  | "OrganicOasis.description";

export type RulesTerms =
  | "game.rules"
  | "rules.oneAccountPerPlayer"
  | "rules.gameNotFinancialProduct"
  | "rules.noBots"
  | "rules.termsOfService";

export type PwaInstall =
  | "install.app"
  | "magic.link"
  | "generating.link"
  | "generating.code"
  | "install.app.desktop.description"
  | "install.app.mobile.metamask.description"
  | "do.not.share.link"
  | "do.not.share.code"
  | "qr.code.not.working";

export type SceneDialogueKey = "sceneDialogues.chefIsBusy";

export type SeasonTerms =
  | "season.access"
  | "season.banner"
  | "season.bonusTickets"
  | "season.boostXP"
  | "season.buyNow"
  | "season.discount"
  | "season.exclusiveOffer"
  | "season.goodLuck"
  | "season.includes"
  | "season.limitedOffer"
  | "season.wearableAirdrop"
  | "season.place.land"
  | "season.megastore.discount"
  | "season.supporter.gift"
  | "season.free.season.passes"
  | "season.vip.access"
  | "season.vip.description"
  | "season.vip.claim"
  | "season.mystery.gift"
  | "season.xp.boost"
  | "season.free.season.passes.description"
  | "season.lifetime.farmer"
  | "season.free.with.lifetime";

export type Share =
  | "share.TweetText"
  | "share.ShareYourFarmLink"
  | "share.ShowOffToFarmers"
  | "share.FarmNFTImageAlt"
  | "share.CopyFarmURL"
  | "share.Tweet"
  | "share.chooseServer"
  | "share.FULL"
  | "share.exploreCustomIslands"
  | "share.buildYourOwnIsland";

export type SharkBumpkinDialogues =
  | "sharkBumpkin.dialogue.shhhh"
  | "sharkBumpkin.dialogue.scareGoblins";

export type Shelly =
  | "shelly.Dialogue.one"
  | "shelly.Dialogue.two"
  | "shelly.Dialogue.three"
  | "shelly.Dialogue.four"
  | "shelly.Dialogue.five"
  | "shelly.Dialogue.letsgo";

export type ShellyDialogue =
  | "shellyPanelContent.tasksFrozen"
  | "shellyPanelContent.canTrade"
  | "shellyPanelContent.cannotTrade"
  | "shellyPanelContent.swap"
  | "krakenIntro.congrats"
  | "krakenIntro.noMoreTentacles"
  | "krakenIntro.gotIt"
  | "krakenIntro.appetiteChanges"
  | "krakenIntro.currentHunger"
  | "krakenIntro.catchInstruction";

export type ShopItems =
  | "betty.post.sale.one"
  | "betty.post.sale.two"
  | "betty.post.sale.three"
  | "betty.welcome"
  | "betty.buySeeds"
  | "betty.sellCrops";

export type ShowingFarm = "showing.farm" | "showing.wallet";

export type SnorklerDialogues = "snorkler.vastOcean" | "snorkler.goldBeneath";

export type SomethingWentWrong =
  | "somethingWentWrong.supportTeam"
  | "somethingWentWrong.jumpingOver"
  | "somethingWentWrong.askingCommunity";

export type SpecialEvent =
  | "special.event.easterIntro"
  | "special.event.rabbitsMissing"
  | "special.event.claimForm"
  | "special.event.link"
  | "special.event.airdropHandling"
  | "special.event.walletRequired"
  | "special.event.web3Wallet"
  | "special.event.airdrop"
  | "special.event.finishedLabel"
  | "special.event.finished"
  | "special.event.ineligible";

export type Statements =
  | "statements.adventure"
  | "statements.auctioneer.one"
  | "statements.auctioneer.two"
  | "statements.beta.one"
  | "statements.beta.two"
  | "statements.better.luck"
  | "statements.blacklist.one"
  | "statements.blacklist.two"
  | "statements.clickBottle"
  | "statements.clock.one"
  | "statements.clock.two"
  | "statements.conversation.one"
  | "statements.cooldown"
  | "statements.craft.composter"
  | "statements.docs"
  | "statements.dontRefresh"
  | "statements.feed.bumpkin.one"
  | "statements.feed.bumpkin.two"
  | "statements.guide.one"
  | "statements.guide.two"
  | "statements.jigger.one"
  | "statements.jigger.two"
  | "statements.jigger.three"
  | "statements.jigger.four"
  | "statements.jigger.five"
  | "statements.jigger.six"
  | "statements.lvlUp"
  | "statements.maintenance"
  | "statements.minted"
  | "statements.minting"
  | "statements.mutant.chicken"
  | "statements.news"
  | "statements.ohNo"
  | "statements.openGuide"
  | "statements.patience"
  | "statements.potionRule.one"
  | "statements.potionRule.two"
  | "statements.potionRule.three"
  | "statements.potionRule.four"
  | "statements.potionRule.five"
  | "statements.potionRule.six"
  | "statements.potionRule.seven"
  | "statements.sflLim.one"
  | "statements.sflLim.two"
  | "statements.sniped"
  | "statements.switchNetwork"
  | "statements.sync"
  | "statements.tapCont"
  | "statements.tutorial.one"
  | "statements.tutorial.two"
  | "statements.tutorial.three"
  | "statements.visit.firePit"
  | "statements.wishing.well.info.four"
  | "statements.wishing.well.info.five"
  | "statements.wishing.well.info.six"
  | "statements.wishing.well.worthwell"
  | "statements.wishing.well.look.like"
  | "statements.wishing.well.lucky"
  | "statements.wrongChain.one"
  | "statements.empty.chest"
  | "statements.chest.captcha"
  | "statements.frankie.plaza"
  | "statements.blacksmith.plaza"
  | "statements.water.well.needed.one"
  | "statements.water.well.needed.two"
  | "statements.soldOut"
  | "statements.soldOutWearables"
  | "statements.wallet.to.inventory.transfer"
  | "statements.crop.water"
  | "statements.daily.limit"
  | "statements.sure.buy"
  | "statements.perplayer"
  | "statements.minted.goToChest"
  | "statements.minted.withdrawAfterMint"
  | "statements.startgame"
  | "statements.session.expired"
  | "statements.price.change"
  | "statements.translation.joinDiscord";

export type StopGoblin =
  | "stopGoblin.stop.goblin"
  | "stopGoblin.stop.moon"
  | "stopGoblin.tap.one"
  | "stopGoblin.tap.two"
  | "stopGoblin.left";

export type Swarming = "swarming.tooLongToFarm" | "swarming.goblinsTakenOver";

export type TieBreaker =
  | "tieBreaker.tiebreaker"
  | "tieBreaker.closeBid"
  | "tieBreaker.betterLuck"
  | "tieBreaker.refund";

export type ToolDescriptions =
  //Tools
  | "description.axe"
  | "description.pickaxe"
  | "description.stone.pickaxe"
  | "description.iron.pickaxe"
  | "description.rod"
  | "description.rusty.shovel"
  | "description.shovel"
  | "description.sand.shovel"
  | "description.sand.drill"
  | "description.gold.pickaxe"
  | "description.oil.drill";

export type TransactionTerms =
  | "transaction.storeBlockBucks"
  | "transaction.storeProgress.blockchain.one"
  | "transaction.storeProgress.blockchain.two"
  | "transaction.trade.congrats"
  | "transaction.creditCard"
  | "transaction.estimated.fee"
  | "transaction.excludeFees"
  | "transaction.starterOffer"
  | "transaction.id"
  | "transaction.termsOfService"
  | "transaction.matic"
  | "transaction.message0"
  | "transaction.noFee"
  | "transaction.minblockbucks"
  | "transaction.mintFarm"
  | "transaction.farm.ready"
  | "transaction.networkFeeRequired"
  | "transaction.openSea"
  | "transaction.payCardCash"
  | "transaction.payCash"
  | "transaction.payMatic"
  | "transaction.storeProgress.chain"
  | "transaction.storeProgress"
  | "transaction.rejected"
  | "transaction.storeProgress.success"
  | "transaction.t&c.one"
  | "transaction.t&c.two"
  | "transaction.chooseDonationGame"
  | "transaction.processing"
  | "transaction.pleaseWait"
  | "transaction.unconfirmed.reset"
  | "transaction.withdraw.one"
  | "transaction.withdraw.sent"
  | "transaction.withdraw.view"
  | "transaction.withdraw.four"
  | "transaction.withdraw.five"
  | "transaction.displayItems"
  | "transaction.withdraw.polygon"
  | "transaction.termsOfService.one"
  | "transaction.termsOfService.two"
  | "transaction.buy.BlockBucks";

export type Transfer =
  | "transfer.sure.adress"
  | "transfer.Account"
  | "transfer.Farm"
  | "transfer.Refresh"
  | "transfer.Taccount"
  | "transfer.address";

export type TreasureModal =
  | "treasureModal.noShovelTitle"
  | "treasureModal.needShovel"
  | "treasureModal.purchaseShovel"
  | "treasureModal.gotIt"
  | "treasureModal.maxHolesTitle"
  | "treasureModal.saveTreasure"
  | "treasureModal.comeBackTomorrow"
  | "treasureModal.drilling";

export type TutorialPage =
  | "tutorial.pageOne.text1"
  | "tutorial.pageOne.text2"
  | "tutorial.pageTwo.text1"
  | "tutorial.pageTwo.text2";

export type Username =
  | "username.tooShort"
  | "username.tooLong"
  | "username.invalidChar"
  | "username.startWithLetter";

export type VisitislandEnter =
  | "visitIsland.enterIslandId"
  | "visitIsland.visit";

export type VisitislandNotFound = "visitislandNotFound.title";

export type Wallet =
  | "wallet.connect"
  | "wallet.linkWeb3"
  | "wallet.setupWeb3"
  | "wallet.wrongWallet"
  | "wallet.connectedWrongWallet"
  | "wallet.missingNFT"
  | "wallet.requireFarmNFT"
  | "wallet.uniqueFarmNFT"
  | "wallet.mintFreeNFT"
  | "wallet.wrongChain"
  | "wallet.walletAlreadyLinked"
  | "wallet.linkAnotherWallet"
  | "wallet.transferFarm"
  | "wallet.signRequest"
  | "wallet.signRequestInWallet";

export type WarningTerms =
  | "warning.noAxe"
  | "warning.chat.maxCharacters"
  | "warning.chat.noSpecialCharacters"
  | "warning.level.required"
  | "warning.hoarding.message"
  | "warning.hoarding.indefiniteArticle.a"
  | "warning.hoarding.indefiniteArticle.an"
  | "warning.hoarding.one"
  | "warning.hoarding.two"
  | "travelRequirement.notice";

export type WelcomeTerms =
  | "welcome.otherWallets"
  | "welcome.needHelp"
  | "welcome.createAccount"
  | "welcome.creatingAccount"
  | "welcome.login"
  | "welcome.signingIn"
  | "welcome.signIn.Message"
  | "welcome.email"
  | "welcome.takeover.ownership"
  | "welcome.promo"
  | "welcome.offline";

export type Winner = "winner.mintTime" | "winner.mintTime.one";

export type WishingWell =
  | "wishingWell.makeWish"
  | "wishingWell.newWish"
  | "wishingWell.noReward"
  | "wishingWell.wish.lucky"
  | "wishingWell.sflRewardsReceived"
  | "wishingWell.wish.grantTime"
  | "wishingWell.wish.granted"
  | "wishingWell.wish.made"
  | "wishingWell.wish.timeTillNextWish"
  | "wishingWell.wish.thanksForSupport"
  | "wishingWell.wish.comeBackAfter"
  | "wishingWell.wish.warning.one"
  | "wishingWell.wish.warning.two"
  | "wishingWell.info.one"
  | "wishingWell.info.two"
  | "wishingWell.info.three"
  | "wishingWell.moreInfo"
  | "wishingWell.noLiquidity"
  | "wishingWell.rewardsInWell"
  | "wishingWell.luck";

export type Withdraw =
  | "withdraw.proof"
  | "withdraw.verification"
  | "withdraw.unsave"
  | "withdraw.sync"
  | "withdraw.available"
  | "withdraw.sfl.available"
  | "withdraw.choose"
  | "withdraw.send.wallet"
  | "withdraw.receive"
  | "withdraw.select.item"
  | "withdraw.opensea"
  | "withdraw.restricted"
  | "withdraw.budRestricted"
  | "withdraw.bumpkin.wearing"
  | "withdraw.bumpkin.sure.withdraw"
  | "withdraw.bumpkin.closed"
  | "withdraw.bumpkin.closing"
  | "withdraw.buds";

export type WornDescription =
  | "worm.earthworm"
  | "worm.grub"
  | "worm.redWiggler";

export type World =
  | "world.intro.one"
  | "world.intro.two"
  | "world.intro.missingDelivery"
  | "world.intro.delivery"
  | "world.intro.findNPC"
  | "world.intro.find"
  | "world.intro.levelUpToTravel"
  | "world.intro.visit"
  | "world.intro.craft"
  | "world.intro.carf.limited"
  | "world.intro.trade"
  | "world.intro.auction"
  | "world.intro.four"
  | "world.intro.five"
  | "world.intro.six"
  | "world.intro.seven"
  | "world.plaza"
  | "world.beach"
  | "world.retreat"
  | "world.woodlands"
  | "world.home"
  | "world.kingdom"
  | "world.travelTo";

export type Event =
  | "event.christmas"
  | "event.LunarNewYear"
  | "event.GasHero"
  | "event.Easter"
  | "event.valentines.rewards";

export type Promo = "promo.cdcBonus" | "promo.expandLand";

export type Trader =
  | "trader.you.pay"
  | "trader.price.per.unit"
  | "trader.goblin.fee"
  | "trader.they.receive"
  | "trader.seller.receives"
  | "trader.buyer.pays"
  | "trader.cancel.trade"
  | "trader.you.receive"
  | "trader.PoH"
  | "trader.start.verification";

export type NyonStatue = "nyonStatue.memory" | "nyonStatue.description";

export type Trading =
  | "trading.select.resources"
  | "trading.no.listings"
  | "trading.listing.congrats"
  | "trading.listing.deleted"
  | "trading.listing.fulfilled"
  | "trading.your.listing"
  | "trading.you.receive"
  | "trading.burned";

export type RestrictionReason =
  | "restrictionReason.isGrowing"
  | "restrictionReason.beanPlanted"
  | "restrictionReason.cropsGrowing"
  | "restrictionReason.?cropGrowing"
  | "restrictionReason.basicCropsGrowing"
  | "restrictionReason.mediumCropsGrowing"
  | "restrictionReason.advancedCropsGrowing"
  | "restrictionReason.fruitsGrowing"
  | "restrictionReason.treesChopped"
  | "restrictionReason.stoneMined"
  | "restrictionReason.ironMined"
  | "restrictionReason.goldMined"
  | "restrictionReason.crimstoneMined"
  | "restrictionReason.chickensFed"
  | "restrictionReason.treasuresDug"
  | "restrictionReason.inUse"
  | "restrictionReason.recentlyUsed"
  | "restrictionReason.recentlyFished"
  | "restrictionReason.flowersGrowing"
  | "restrictionReason.beesBusy"
  | "restrictionReason.pawShaken"
  | "restrictionReason.festiveSeason"
  | "restrictionReason.noRestriction"
  | "restrictionReason.genieLampRubbed"
  | "restrictionReason.oilReserveDrilled"
  | "restrictionReason.buildingInUse"
  | "restrictionReason.beehiveInUse";

export type Leaderboard =
  | "leaderboard.leaderboard"
  | "leaderboard.error"
  | "leaderboard.initialising"
  | "leaderboard.topTen"
  | "leaderboard.yourPosition"
  | "leaderboard.factionMembers";

export type GameOptions =
  | "gameOptions.title"
  | "gameOptions.howToPlay"
  | "gameOptions.amoyActions"
  | "gameOptions.amoyActions.timeMachine"
  | "gameOptions.blockchainSettings"
  | "gameOptions.blockchainSettings.refreshChain"
  | "gameOptions.blockchainSettings.storeOnChain"
  | "gameOptions.blockchainSettings.swapMaticForSFL"
  | "gameOptions.blockchainSettings.transferOwnership"
  | "gameOptions.generalSettings"
  | "gameOptions.generalSettings.connectDiscord"
  | "gameOptions.generalSettings.assignRole"
  | "gameOptions.generalSettings.changeLanguage"
  | "gameOptions.generalSettings.darkMode"
  | "gameOptions.generalSettings.lightMode"
  | "gameOptions.generalSettings.font"
  | "gameOptions.generalSettings.appearance"
  | "gameOptions.generalSettings.disableAnimations"
  | "gameOptions.generalSettings.enableAnimations"
  | "gameOptions.generalSettings.share"
  | "gameOptions.plazaSettings"
  | "gameOptions.plazaSettings.changeServer"
  | "gameOptions.plazaSettings.title.mutedPlayers"
  | "gameOptions.plazaSettings.title.keybinds"
  | "gameOptions.plazaSettings.mutedPlayers.description"
  | "gameOptions.plazaSettings.keybinds.description"
  | "gameOptions.plazaSettings.noMutedPlayers"
  | "gameOptions.farmId"
  | "gameOptions.logout"
  | "gameOptions.confirmLogout";

export type GreenhouseKeys =
  | "greenhouse.oilRequired"
  | "greenhouse.oilDescription"
  | "greenhouse.oilInMachine"
  | "greenhouse.insertOil"
  | "greenhouse.numberOil";
export type Minigame =
  | "minigame.playNow"
  | "minigame.chickenRescue"
  | "minigame.completed"
  | "minigame.noPrizeAvailable"
  | "minigame.confirm"
  | "minigame.purchase"
  | "minigame.comingSoon"
  | "minigame.chickenRescueHelp"
  | "minigame.discovered.one"
  | "minigame.discovered.two"
  | "minigame.festivalOfColors"
  | "minigame.communityEvent"
  | "minigame.festivalOfColors.intro"
  | "minigame.festivalOfColors.mission"
  | "minigame.festivalOfColors.comingSoon";

export type KitchenKeys = "kitchen.oilRemaining";

export type EasterEggKeys =
  | "easterEgg.lostKnight"
  | "easterEgg.queensDiary"
  | "easterEgg.jesterDiary"
  | "easterEgg.tywinDiary"
  | "easterEgg.kingDiary"
  | "easterEgg.kingdomBook1"
  | "easterEgg.kingdomBook2"
  | "easterEgg.kingdomBook3"
  | "easterEgg.kingdomBook4"
  | "easterEgg.kingdomBook5"
  | "easterEgg.knight";

export type ChangeLanguage =
  | "changeLanguage.confirm"
  | "changeLanguage.contribute"
  | "changeLanguage.contribute.message";

export type TranslationKeys =
  | AchievementsTerms
  | Auction
  | AddSFL
  | AvailableSeeds
  | Base
  | BasicTreasure
  | Beehive
  | BirdiePlaza
  | BoostDescriptions
  | BoostEffectDescriptions
  | BountyDescription
  | BuildingDescriptions
  | BumpkinDelivery
  | BumpkinItemBuff
  | BumpkinPart
  | BumpkinPartRequirements
  | BumpkinSkillsDescription
  | BumpkinTrade
  | BuyFarmHand
  | ChangeLanguage
  | Chat
  | ChickenWinner
  | ChoresStart
  | ChumDetails
  | ClaimAchievement
  | Community
  | CompostDescription
  | ComposterDescription
  | ConfirmSkill
  | ConfirmationTerms
  | Conversations
  | CropBoomMessages
  | CropFruitDescriptions
  | CropMachine
  | DeliveryItem
  | DefaultDialogue
  | DecorationDescriptions
  | Delivery
  | DeliveryHelp
  | DepositWallet
  | Detail
  | DiscordBonus
  | Donation
  | DraftBid
  | ErrorAndAccess
  | ErrorTerms
  | ExoticShopItems
  | FactionShopDescription
  | FestiveTree
  | FishDescriptions
  | FishermanModal
  | FishermanQuest
  | FishingChallengeIntro
  | FishingGuide
  | FishingQuests
  | FlowerBed
  | Flowerbreed
  | FlowerShopTerms
  | FoodDescriptions
  | GameDescriptions
  | GameOptions
  | GameTerms
  | GarbageCollector
  | GeneralTerms
  | GenieLamp
  | GetContent
  | GetInputErrorMessage
  | GOBLIN_MESSAGES
  | GoblinTrade
  | GoldTooth
  | GreenhouseKeys
  | GuideTerms
  | GuideCompost
  | GuideCompost
  | Factions
  | HalveningCountdown
  | Harvestflower
  | HarvestBeeHive
  | HayseedHankPlaza
  | HayseedHankV2
  | Helper
  | HeliosSunflower
  | HenHouseTerms
  | HowToFarm
  | HowToSync
  | HowToUpgrade
  | Islandupgrade
  | InteractableModals
  | IntroPage
  | IslandName
  | IslandNotFound
  | LandscapeTerms
  | LetsGo
  | LevelUpMessages
  | Loser
  | LostSunflorian
  | MegaStore
  | MilestoneMessages
  | Minigame
  | ModalDescription
  | Noaccount
  | NoBumpkin
  | NoTownCenter
  | NotOnDiscordServer
  | NFTMinting
  | NPC_MESSAGE
  | Npc
  | NpcDialogues
  | NyeButton
  | ObsessionDialogue
  | Offer
  | Onboarding
  | OnCollectReward
  | OrderHelp
  | Pending
  | PersonHood
  | PirateChest
  | PirateQuest
  | Pickserver
  | PlayerTrade
  | Portal
  | PurchaseableBaitTranslation
  | Quest
  | Questions
  | Reaction
  | ReactionBud
  | Refunded
  | RemoveHungryCaterpillar
  | RemoveKuebiko
  | RemoveCropMachine
  | Resale
  | ResourceTerms
  | Restock
  | RetreatTerms
  | Resources
  | RewardTerms
  | RulesGameStart
  | RulesTerms
  | PwaInstall
  | SceneDialogueKey
  | SeasonTerms
  | Share
  | SharkBumpkinDialogues
  | Shelly
  | ShellyDialogue
  | ShopItems
  | ShowingFarm
  | SnorklerDialogues
  | SomethingWentWrong
  | SpecialEvent
  | Statements
  | StopGoblin
  | Swarming
  | TieBreaker
  | TimeUnits
  | ToolDescriptions
  | TransactionTerms
  | Transfer
  | TreasureModal
  | TutorialPage
  | Username
  | VisitislandEnter
  | VisitislandNotFound
  | Wallet
  | WarningTerms
  | WelcomeTerms
  | WishingWell
  | Withdraw
  | Winner
  | WornDescription
  | World
  | Event
  | Promo
  | Trader
  | NyonStatue
  | Trading
  | RestrictionReason
  | Leaderboard
  | EasterEggKeys;
