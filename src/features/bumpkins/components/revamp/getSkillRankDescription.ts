import { millisecondsToString } from "lib/utils/time";
import type { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  SKILL_RANKS,
  GOLDEN_SUNFLOWER_DISPLAY,
  type UpgradeableSkillName,
} from "features/game/types/bumpkinSkills";

/**
 * Human-readable boost description for a specific rank of an upgradeable skill.
 * Returns the buff sentence (and a debuff sentence for Acre/Hectare),
 * interpolating the real per-rank value from SKILL_RANKS so the panel can
 * show concrete numbers. `rank` is 1-based (1..maxLevel). `t` is the caller's
 * translation function (passed in rather than using the global singleton so the
 * render stays deterministic from React's / the compiler's perspective).
 */
export const getSkillRankDescription = (
  name: UpgradeableSkillName,
  rank: number,
  t: ReturnType<typeof useAppTranslation>["t"],
): { buff: string; debuff?: string } => {
  const i = rank - 1;

  switch (name) {
    case "Green Thumb":
      return {
        buff: t("skill.greenThumb.ranked", {
          value: SKILL_RANKS["Green Thumb"].ranks[i],
        }),
      };
    case "Strong Roots":
      return {
        buff: t("skill.strongRoots.ranked", {
          value: SKILL_RANKS["Strong Roots"].ranks[i],
        }),
      };
    case "Young Farmer":
      return {
        buff: t("skill.youngFarmer.ranked", {
          value: SKILL_RANKS["Young Farmer"].ranks[i],
        }),
      };
    case "Experienced Farmer":
      return {
        buff: t("skill.experiencedFarmer.ranked", {
          value: SKILL_RANKS["Experienced Farmer"].ranks[i],
        }),
      };
    case "Old Farmer":
      return {
        buff: t("skill.oldFarmer.ranked", {
          value: SKILL_RANKS["Old Farmer"].ranks[i],
        }),
      };
    case "Betty's Friend":
      return {
        buff: t("skill.bettysFriend.ranked", {
          value: SKILL_RANKS["Betty's Friend"].ranks[i] * 100,
        }),
      };
    case "Coin Swindler":
      return {
        buff: t("skill.coinSwindler.ranked", {
          value: SKILL_RANKS["Coin Swindler"].ranks[i] * 100,
        }),
      };
    case "Golden Sunflower":
      return {
        buff: t("skill.goldenSunflower.ranked", {
          value: GOLDEN_SUNFLOWER_DISPLAY[i],
        }),
      };
    case "Chonky Scarecrow": {
      const { depth } = SKILL_RANKS["Chonky Scarecrow"].ranks[i];
      const bonus = SKILL_RANKS["Chonky Scarecrow"].aoeYield[i];
      // Rank 1 grants AOE only (no yield), so drop the yield clause.
      return {
        buff:
          bonus > 0
            ? t("skill.chonkyScarecrow.ranked.yield", {
                size: `${depth}x${depth}`,
                value: bonus,
              })
            : t("skill.chonkyScarecrow.ranked", {
                size: `${depth}x${depth}`,
              }),
      };
    }
    case "Horror Mike": {
      const { depth } = SKILL_RANKS["Horror Mike"].ranks[i];
      return {
        buff: t("skill.horrorMike.ranked", {
          size: `${depth}x${depth}`,
          value: SKILL_RANKS["Horror Mike"].aoeYield[i],
        }),
      };
    }
    case "Laurie's Gains": {
      const { depth } = SKILL_RANKS["Laurie's Gains"].ranks[i];
      return {
        buff: t("skill.lauriesGains.ranked", {
          size: `${depth}x${depth}`,
          value: SKILL_RANKS["Laurie's Gains"].aoeYield[i],
        }),
      };
    }
    case "Instant Growth":
      return {
        buff: t("skill.instantGrowth.ranked", {
          value: millisecondsToString(SKILL_RANKS["Instant Growth"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
    case "Acre Farm":
      return {
        buff: t("skill.acreFarm.buff.ranked", {
          value: SKILL_RANKS["Acre Farm"].buff[i],
        }),
        debuff: t("skill.acreFarm.debuff.ranked", {
          value: SKILL_RANKS["Acre Farm"].debuff[i],
        }),
      };
    case "Hectare Farm":
      return {
        buff: t("skill.hectareFarm.buff.ranked", {
          value: SKILL_RANKS["Hectare Farm"].buff[i],
        }),
        debuff: t("skill.hectareFarm.debuff.ranked", {
          value: SKILL_RANKS["Hectare Farm"].debuff[i],
        }),
      };
    case "Lumberjack's Extra":
      return {
        buff: t("skill.lumberjacksExtra.ranked", {
          value: SKILL_RANKS["Lumberjack's Extra"].ranks[i],
        }),
      };
    case "Tree Charge":
      return {
        buff: t("skill.treeCharge.ranked", {
          value: SKILL_RANKS["Tree Charge"].ranks[i],
        }),
      };
    case "More Axes":
      return {
        buff: t("skill.moreAxes.ranked", {
          value: SKILL_RANKS["More Axes"].ranks.Axe?.[i] ?? 0,
        }),
      };
    case "Tough Tree":
      return {
        buff: t("skill.toughTree.ranked", {
          value: SKILL_RANKS["Tough Tree"].ranks[i],
        }),
      };
    case "Feller's Discount":
      return {
        buff: t("skill.fellersDiscount.ranked", {
          value: SKILL_RANKS["Feller's Discount"].ranks[i],
        }),
      };
    case "Money Tree":
      return {
        buff: t("skill.moneyTree.ranked", {
          value: SKILL_RANKS["Money Tree"].ranks[i],
        }),
      };
    case "Tree Turnaround":
      return {
        buff: t("skill.treeTurnaround.ranked", {
          value: SKILL_RANKS["Tree Turnaround"].ranks[i],
        }),
      };
    case "Tree Blitz":
      return {
        buff: t("skill.treeBlitz.ranked", {
          value: millisecondsToString(SKILL_RANKS["Tree Blitz"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
    case "Rock'N'Roll":
      return {
        buff: t("skill.rockAndRoll.ranked", {
          value: SKILL_RANKS["Rock'N'Roll"].ranks[i],
        }),
      };
    case "Iron Bumpkin":
      return {
        buff: t("skill.ironBumpkin.ranked", {
          value: SKILL_RANKS["Iron Bumpkin"].ranks[i],
        }),
      };
    case "Speed Miner":
      return {
        buff: t("skill.speedMiner.ranked", {
          value: SKILL_RANKS["Speed Miner"].ranks[i],
        }),
      };
    case "Forge-Ward Profits":
      return {
        buff: t("skill.forgeWardProfits.ranked", {
          value: SKILL_RANKS["Forge-Ward Profits"].ranks[i] * 100,
        }),
      };
    case "Iron Hustle":
      return {
        buff: t("skill.ironHustle.ranked", {
          value: SKILL_RANKS["Iron Hustle"].ranks[i],
        }),
      };
    case "Frugal Miner":
      return {
        buff: t("skill.frugalMiner.ranked", {
          value: SKILL_RANKS["Frugal Miner"].ranks[i],
        }),
      };
    case "Rocky Favor":
      return {
        buff: t("skill.rockyFavor.buff.ranked", {
          value: SKILL_RANKS["Rocky Favor"].buff[i],
        }),
        debuff: t("skill.rockyFavor.debuff.ranked", {
          value: SKILL_RANKS["Rocky Favor"].debuff[i],
        }),
      };
    case "Fire Kissed":
      return {
        buff: t("skill.fireKissed.ranked", {
          value: SKILL_RANKS["Fire Kissed"].ranks[i],
        }),
      };
    case "Midas Sprint":
      return {
        buff: t("skill.midasSprint.ranked", {
          value: SKILL_RANKS["Midas Sprint"].ranks[i],
        }),
      };
    case "Ferrous Favor":
      return {
        buff: t("skill.ferrousFavor.buff.ranked", {
          value: SKILL_RANKS["Ferrous Favor"].buff[i],
        }),
        debuff: t("skill.ferrousFavor.debuff.ranked", {
          value: SKILL_RANKS["Ferrous Favor"].debuff[i],
        }),
      };
    case "Golden Touch":
      return {
        buff: t("skill.goldenTouch.ranked", {
          value: SKILL_RANKS["Golden Touch"].ranks[i],
        }),
      };
    case "More Picks":
      return {
        buff: t("skill.morePicks.ranked", {
          pickaxe: SKILL_RANKS["More Picks"].ranks.Pickaxe?.[i] ?? 0,
          stone: SKILL_RANKS["More Picks"].ranks["Stone Pickaxe"]?.[i] ?? 0,
          iron: SKILL_RANKS["More Picks"].ranks["Iron Pickaxe"]?.[i] ?? 0,
          gold: SKILL_RANKS["More Picks"].ranks["Gold Pickaxe"]?.[i] ?? 0,
        }),
      };
    case "Fireside Alchemist":
      return {
        buff: t("skill.firesideAlchemist.ranked", {
          value: SKILL_RANKS["Fireside Alchemist"].ranks[i],
        }),
      };
    case "Midas Rush":
      return {
        buff: t("skill.midasRush.ranked", {
          value: SKILL_RANKS["Midas Rush"].ranks[i],
        }),
      };
    case "Fruitful Fumble":
      return {
        buff: t("skill.fruitfulFumble.ranked", {
          value: SKILL_RANKS["Fruitful Fumble"].ranks[i],
        }),
      };
    case "Fruity Heaven":
      return {
        buff: t("skill.fruityHeaven.ranked", {
          value: SKILL_RANKS["Fruity Heaven"].ranks[i],
        }),
      };
    case "Fruity Profit":
      return {
        buff: t("skill.fruityProfit.ranked", {
          value: SKILL_RANKS["Fruity Profit"].ranks[i] * 100,
        }),
      };
    case "Catchup":
      return {
        buff: t("skill.catchup.ranked", {
          value: SKILL_RANKS["Catchup"].ranks[i],
        }),
      };
    case "Fruity Woody":
      return {
        buff: t("skill.fruityWoody.ranked", {
          value: SKILL_RANKS["Fruity Woody"].ranks[i],
        }),
      };
    case "Crime Fruit":
      return {
        buff: t("skill.crimeFruit.ranked", {
          value: SKILL_RANKS["Crime Fruit"].ranks["Tomato Seed"]?.[i] ?? 0,
        }),
      };
    case "Generous Orchard":
      return {
        buff: t("skill.generousOrchard.ranked", {
          value: SKILL_RANKS["Generous Orchard"].ranks[i],
        }),
      };
    case "Zesty Vibes":
      return {
        buff: t("skill.zestyVibes.buff.ranked", {
          value: SKILL_RANKS["Zesty Vibes"].buff[i],
        }),
        debuff: t("skill.zestyVibes.debuff.ranked", {
          value: SKILL_RANKS["Zesty Vibes"].debuff[i],
        }),
      };
    case "Loyal Macaw":
      return {
        buff: t("skill.loyalMacaw.ranked", {
          value: SKILL_RANKS["Loyal Macaw"].ranks[i],
        }),
      };
    case "Pear Turbocharge":
      return {
        buff: t("skill.pearTurbocharge.ranked", {
          value: SKILL_RANKS["Pear Turbocharge"].ranks[i],
        }),
      };
    case "No Axe No Worries": {
      const penalty = SKILL_RANKS["No Axe No Worries"].ranks[i];
      return {
        buff: t("skill.noAxeNoWorries.buff"),
        // Rank 3 removes the debuff entirely, so drop the debuff line.
        debuff:
          penalty > 0
            ? t("skill.noAxeNoWorries.debuff.ranked", { value: penalty })
            : undefined,
      };
    }
    case "Long Pickings":
      return {
        buff: t("skill.longPickings.buff.ranked", {
          value: SKILL_RANKS["Long Pickings"].buff[i],
        }),
        debuff: t("skill.longPickings.debuff.ranked", {
          value:
            Math.round((SKILL_RANKS["Long Pickings"].debuff[i] - 1) * 1000) /
            10,
        }),
      };
    case "Short Pickings":
      return {
        buff: t("skill.shortPickings.buff.ranked", {
          value: SKILL_RANKS["Short Pickings"].buff[i],
        }),
        debuff: t("skill.shortPickings.debuff.ranked", {
          value:
            Math.round((SKILL_RANKS["Short Pickings"].debuff[i] - 1) * 1000) /
            10,
        }),
      };
    case "Fisherman's 5 Fold":
      return {
        buff: t("skill.fishermansFiveFold.ranked", {
          value: SKILL_RANKS["Fisherman's 5 Fold"].ranks[i],
        }),
      };
    case "Fisherman's 10 Fold":
      return {
        buff: t("skill.fishermansTenFold.ranked", {
          value: SKILL_RANKS["Fisherman's 10 Fold"].ranks[i],
        }),
      };
    case "More With Less":
      return {
        buff: t("skill.moreWithLess.buff.ranked", {
          value: SKILL_RANKS["More With Less"].ranks[i],
        }),
      };
    case "Fishy Chance":
      return {
        buff: t("skill.fishyChance.ranked", {
          value: SKILL_RANKS["Fishy Chance"].ranks[i],
        }),
      };
    case "Fishy Roll":
      return {
        buff: t("skill.fishyRoll.ranked", {
          value: SKILL_RANKS["Fishy Roll"].ranks[i],
        }),
      };
    case "Fishy Gamble":
      return {
        buff: t("skill.fishyGamble.ranked", {
          value: SKILL_RANKS["Fishy Gamble"].ranks[i],
        }),
      };
    case "Reel Deal":
      return {
        buff: t("skill.reelDeal.ranked", {
          value: SKILL_RANKS["Reel Deal"].ranks[i],
        }),
      };
    case "Fishy Fortune":
      return {
        buff: t("skill.fishyFortune.ranked", {
          value: SKILL_RANKS["Fishy Fortune"].ranks[i] * 100,
        }),
      };
    case "Fishy Feast":
      return {
        buff: t("skill.fishyFeast.ranked", {
          value: SKILL_RANKS["Fishy Feast"].ranks[i] * 100,
        }),
      };
    case "Fast Feasts":
      return {
        buff: t("skill.fastFeasts.ranked", {
          value: SKILL_RANKS["Fast Feasts"].ranks[i] * 100,
        }),
      };
    case "Frosted Cakes":
      return {
        buff: t("skill.frostedCakes.ranked", {
          value: SKILL_RANKS["Frosted Cakes"].ranks[i] * 100,
        }),
      };
    case "Swift Sizzle":
      return {
        buff: t("skill.swiftSizzle.ranked", {
          value: SKILL_RANKS["Swift Sizzle"].ranks[i] * 100,
        }),
      };
    case "Turbo Fry":
      return {
        buff: t("skill.turboFry.ranked", {
          value: SKILL_RANKS["Turbo Fry"].ranks[i] * 100,
        }),
      };
    case "Fry Frenzy":
      return {
        buff: t("skill.fryFrenzy.ranked", {
          value: SKILL_RANKS["Fry Frenzy"].ranks[i] * 100,
        }),
      };
    case "Munching Mastery":
      return {
        buff: t("skill.munchingMastery.ranked", {
          value: SKILL_RANKS["Munching Mastery"].ranks[i] * 100,
        }),
      };
    case "Juicy Boost":
      return {
        buff: t("skill.juicyBoost.ranked", {
          value: SKILL_RANKS["Juicy Boost"].ranks[i] * 100,
        }),
      };
    case "Drive-Through Deli":
      return {
        buff: t("skill.driveThroughDeli.ranked", {
          value: SKILL_RANKS["Drive-Through Deli"].ranks[i] * 100,
        }),
      };
    case "Nom Nom":
      return {
        buff: t("skill.nomNom.ranked", {
          value: SKILL_RANKS["Nom Nom"].ranks[i] * 100,
        }),
      };
    case "Fiery Jackpot":
      return {
        buff: t("skill.fieryJackpot.ranked", {
          value: SKILL_RANKS["Fiery Jackpot"].ranks[i],
        }),
      };
    case "Instant Gratification":
      return {
        buff: t("skill.instantGratification.ranked", {
          value: millisecondsToString(
            SKILL_RANKS["Instant Gratification"].ranks[i],
            {
              length: "short",
              isShortFormat: true,
              removeTrailingZeros: true,
            },
          ),
        }),
      };
    case "Double Nom":
      return {
        buff: t("skill.doubleNom.buff.ranked", {
          value: SKILL_RANKS["Double Nom"].food[i],
        }),
        debuff: t("skill.doubleNom.debuff.ranked", {
          value: SKILL_RANKS["Double Nom"].ingredients[i],
        }),
      };
    case "Sweet Bonus":
      return {
        buff: t("skill.sweetBonus.ranked", {
          value: SKILL_RANKS["Sweet Bonus"].ranks[i],
        }),
      };
    case "Hyper Bees":
      return {
        buff: t("skill.hyperBees.ranked", {
          value: SKILL_RANKS["Hyper Bees"].ranks[i],
        }),
      };
    case "Blooming Boost":
      return {
        buff: t("skill.bloomingBoost.ranked", {
          value: SKILL_RANKS["Blooming Boost"].ranks[i],
        }),
      };
    case "Flower Sale":
      return {
        buff: t("skill.flowerSale.ranked", {
          value: SKILL_RANKS["Flower Sale"].ranks[i],
        }),
      };
    case "Buzzworthy Treats":
      return {
        buff: t("skill.buzzworthyTreats.ranked", {
          value: SKILL_RANKS["Buzzworthy Treats"].ranks[i] * 100,
        }),
      };
    case "Blossom Bonding":
      return {
        buff: t("skill.blossomBonding.ranked", {
          value: SKILL_RANKS["Blossom Bonding"].ranks[i],
        }),
      };
    case "Pollen Power Up": {
      const bonus = SKILL_RANKS["Pollen Power Up"].ranks[i];
      return {
        buff: t("skill.pollenPowerUp.ranked", {
          value: bonus,
          // Base Bee Swarm bonus is +0.2, so the player-facing total is +0.3/+0.35/+0.4
          total: Math.round((0.2 + bonus) * 100) / 100,
        }),
      };
    }
    case "Petalled Perk":
      return {
        buff: t("skill.petalledPerk.ranked", {
          value: SKILL_RANKS["Petalled Perk"].ranks[i],
        }),
      };
    case "Bee Collective":
      return {
        buff: t("skill.beeCollective.ranked", {
          value: SKILL_RANKS["Bee Collective"].ranks[i],
        }),
      };
    case "Flower Power":
      return {
        buff: t("skill.flowerPower.ranked", {
          value: SKILL_RANKS["Flower Power"].ranks[i],
        }),
      };
    case "Flowery Abode":
      return {
        buff: t("skill.floweryAbode.buff.ranked", {
          value: SKILL_RANKS["Flowery Abode"].rate[i],
        }),
        debuff: t("skill.floweryAbode.debuff.ranked", {
          value:
            Math.round((SKILL_RANKS["Flowery Abode"].growth[i] - 1) * 1000) /
            10,
        }),
      };
    case "Petal Blessed":
      return {
        buff: t("skill.petalBlessed.ranked", {
          value: millisecondsToString(SKILL_RANKS["Petal Blessed"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
    case "Efficient Bin":
      return {
        buff: t("skill.efficientBin.ranked", {
          value: SKILL_RANKS["Efficient Bin"].ranks[i],
        }),
      };
    case "Turbo Charged":
      return {
        buff: t("skill.turboCharged.ranked", {
          value: SKILL_RANKS["Turbo Charged"].ranks[i],
        }),
      };
    case "Wormy Treat":
      return {
        buff: t("skill.wormyTreat.ranked", {
          value: SKILL_RANKS["Wormy Treat"].ranks[i],
        }),
      };
    case "Feathery Business": {
      const multiplier = SKILL_RANKS["Feathery Business"].ranks[i];
      return {
        buff: t("skill.featheryBusiness.buff"),
        // Rank 3 costs 1x Feathers, i.e. no penalty left to warn about.
        debuff:
          multiplier > 1
            ? t("skill.featheryBusiness.debuff.ranked", { value: multiplier })
            : undefined,
      };
    }
    case "Premium Worms":
      return {
        buff: t("skill.premiumWorms.ranked", {
          value: SKILL_RANKS["Premium Worms"].ranks[i],
        }),
      };
    case "Fruitful Bounty":
      return {
        buff: t("skill.fruitfulBounty.ranked", {
          value: SKILL_RANKS["Fruitful Bounty"].ranks[i],
        }),
      };
    case "Swift Decomposer":
      return {
        buff: t("skill.swiftDecomposer.ranked", {
          value: SKILL_RANKS["Swift Decomposer"].ranks[i],
        }),
      };
    case "Composting Bonanza":
      return {
        buff: t("skill.compostingBonanza.buff.ranked", {
          value: millisecondsToString(
            SKILL_RANKS["Composting Bonanza"].ranks[i],
            {
              length: "short",
              isShortFormat: true,
              removeTrailingZeros: true,
            },
          ),
        }),
        debuff: t("skill.compostingBonanza.debuff"),
      };
    case "Composting Overhaul":
      return {
        buff: t("skill.compostingOverhaul.buff.ranked", {
          value: SKILL_RANKS["Composting Overhaul"].ranks[i],
        }),
      };
    case "Composting Revamp":
      return {
        buff: t("skill.compostingRevamp.buff.ranked", {
          value: SKILL_RANKS["Composting Revamp"].buff[i],
        }),
        debuff: t("skill.compostingRevamp.debuff.ranked", {
          value: SKILL_RANKS["Composting Revamp"].debuff[i],
        }),
      };
    case "Frenzied Fish": {
      const { flat, crit } = SKILL_RANKS["Frenzied Fish"];
      // Rank 3 is a flat catch with no crit chance, so drop the "and X% chance"
      // clause.
      return {
        buff:
          crit[i] > 0
            ? t("skill.frenziedFish.ranked", {
                fish: flat[i],
                chance: crit[i],
              })
            : t("skill.frenziedFish.flat.ranked", {
                fish: flat[i],
              }),
      };
    }
    case "Glass Room":
      return {
        buff: t("skill.glassRoom.ranked", {
          value: SKILL_RANKS["Glass Room"].ranks[i],
        }),
      };
    case "Seedy Business":
      return {
        buff: t("skill.seedyBusiness.ranked", {
          value: SKILL_RANKS["Seedy Business"].ranks[i],
        }),
      };
    case "Rice and Shine":
      return {
        buff: t("skill.riceAndShine.ranked", {
          value: SKILL_RANKS["Rice and Shine"].ranks[i],
        }),
      };
    case "Victoria's Secretary":
      return {
        buff: t("skill.victoriasSecretary.ranked", {
          value: SKILL_RANKS["Victoria's Secretary"].ranks[i] * 100,
        }),
      };
    case "Olive Express":
      return {
        buff: t("skill.oliveExpress.ranked", {
          value: SKILL_RANKS["Olive Express"].ranks[i],
        }),
      };
    case "Rice Rocket":
      return {
        buff: t("skill.riceRocket.ranked", {
          value: SKILL_RANKS["Rice Rocket"].ranks[i],
        }),
      };
    case "Vine Velocity":
      return {
        buff: t("skill.vineVelocity.ranked", {
          value: SKILL_RANKS["Vine Velocity"].ranks[i],
        }),
      };
    case "Seeded Bounty":
      // Only the yield leg scales; the "+1 seed to plant" debuff is fixed.
      return {
        buff: t("skill.seededBounty.buff.ranked", {
          value: SKILL_RANKS["Seeded Bounty"].ranks[i],
        }),
        debuff: t("skill.seededBounty.debuff"),
      };
    case "Greenhouse Guru":
      return {
        buff: t("skill.greenhouseGuru.ranked", {
          value: millisecondsToString(SKILL_RANKS["Greenhouse Guru"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
    case "Greenhouse Gamble":
      return {
        buff: t("skill.greenhouseGamble.ranked", {
          value: SKILL_RANKS["Greenhouse Gamble"].ranks[i],
        }),
      };
    case "Slick Saver":
      return {
        buff: t("skill.slickSaver.ranked", {
          value: SKILL_RANKS["Slick Saver"].ranks[i],
        }),
      };
    case "Greasy Plants":
      return {
        buff: t("skill.greasyPlants.buff.ranked", {
          value: SKILL_RANKS["Greasy Plants"].yield[i],
        }),
        debuff: t("skill.greasyPlants.debuff.ranked", {
          value: (SKILL_RANKS["Greasy Plants"].oilMultiplier[i] - 1) * 100,
        }),
      };
    case "Crop Processor Unit":
      return {
        buff: t("skill.cropProcessorUnit.buff.ranked", {
          value: SKILL_RANKS["Crop Processor Unit"].growth[i],
        }),
        debuff: t("skill.cropProcessorUnit.debuff.ranked", {
          value: SKILL_RANKS["Crop Processor Unit"].oilPenalty[i] * 100,
        }),
      };
    case "Oil Gadget":
      return {
        buff: t("skill.oilGadget.ranked", {
          value: 1 - SKILL_RANKS["Oil Gadget"].ranks[i],
        }),
      };
    case "Oil Extraction":
      return {
        buff: t("skill.oilExtraction.ranked", {
          value: SKILL_RANKS["Oil Extraction"].ranks[i],
        }),
      };
    case "Leak-Proof Tank":
      return {
        buff: t("skill.leakProofTank.ranked", {
          value: SKILL_RANKS["Leak-Proof Tank"].ranks[i],
        }),
      };
    case "Rapid Rig":
      return {
        buff: t("skill.rapidRig.buff.ranked", {
          value: SKILL_RANKS["Rapid Rig"].growth[i],
        }),
        debuff: t("skill.rapidRig.debuff.ranked", {
          value: SKILL_RANKS["Rapid Rig"].oilPenalty[i] * 100,
        }),
      };
    case "Oil Be Back":
      return {
        buff: t("skill.oilBeBack.ranked", {
          value: SKILL_RANKS["Oil Be Back"].ranks[i],
        }),
      };
    case "Oil Rig":
      return {
        buff: t("skill.oilRig.buff.ranked", {
          value: SKILL_RANKS["Oil Rig"].ranks[i],
        }),
      };
    case "Field Expansion Module":
      return {
        buff: t("skill.fieldExpansionModule.ranked", {
          value: SKILL_RANKS["Field Expansion Module"].ranks[i],
        }),
      };
    case "Field Extension Module":
      return {
        buff: t("skill.fieldExtensionModule.ranked", {
          value: SKILL_RANKS["Field Extension Module"].ranks[i],
        }),
      };
    case "Efficiency Extension Module":
      return {
        buff: t("skill.efficiencyExtensionModule.ranked", {
          value: 1 - SKILL_RANKS["Efficiency Extension Module"].ranks[i],
        }),
      };
    case "Grease Lightning":
      return {
        buff: t("skill.greaseLightning.ranked", {
          value: millisecondsToString(
            SKILL_RANKS["Grease Lightning"].ranks[i],
            {
              length: "short",
              isShortFormat: true,
              removeTrailingZeros: true,
            },
          ),
        }),
      };
    case "Cheap Rakes":
      return {
        buff: t("skill.cheapRakes.ranked", {
          value: SKILL_RANKS["Cheap Rakes"].ranks[i],
        }),
      };
    case "Speedy Aging":
      return {
        buff: t("skill.speedyAging.ranked", {
          value: SKILL_RANKS["Speedy Aging"].ranks[i],
        }),
      };
    case "Salty Seas":
      return {
        buff: t("skill.saltySeas.ranked", {
          value: SKILL_RANKS["Salty Seas"].ranks[i],
        }),
      };
    case "Wide Rakes":
      return {
        buff: t("skill.wideRakes.ranked", {
          value: SKILL_RANKS["Wide Rakes"].ranks[i],
        }),
      };
    case "Bacalhau":
      return {
        buff: t("skill.bacalhau.ranked", {
          value: SKILL_RANKS["Bacalhau"].ranks[i],
        }),
      };
    case "Fish Smoking":
      return {
        buff: t("skill.fishSmoking.ranked", {
          value: SKILL_RANKS["Fish Smoking"].ranks[i],
        }),
      };
    case "Refiner":
      return {
        buff: t("skill.refiner.ranked", {
          value: SKILL_RANKS["Refiner"].ranks[i],
        }),
      };
    case "Sea Blessed":
      return {
        buff: t("skill.seaBlessed.ranked", {
          value: SKILL_RANKS["Sea Blessed"].ranks[i],
        }),
      };
    case "Ager":
      // One multiplier drives both legs: Nx output for Nx inputs.
      return {
        buff: t("skill.ager.buff.ranked", {
          value: SKILL_RANKS["Ager"].ranks[i],
        }),
        debuff: t("skill.ager.debuff.ranked", {
          value: SKILL_RANKS["Ager"].ranks[i],
        }),
      };
    case "Salt Surge":
      return {
        buff: t("skill.saltSurge.ranked", {
          value: millisecondsToString(SKILL_RANKS["Salt Surge"].ranks[i], {
            length: "short",
            isShortFormat: true,
            removeTrailingZeros: true,
          }),
        }),
      };
  }
};
