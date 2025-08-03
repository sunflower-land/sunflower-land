import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import React, { useState } from "react";
import garbageBin from "assets/sfts/garbage_bin.webp";
import giftIcon from "assets/icons/gift.png";
import chapterIcon from "assets/icons/chapter_icon_1.webp";
import tradeIcon from "assets/icons/trade.png";
import biomeIcon from "assets/icons/islands/basic.webp";
import rotateIcon from "assets/icons/flip.webp";
import shopIcon from "assets/icons/shop.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

interface NewsItem {
  title: string;
  description: string;
  image: string;
  link?: string;
  component?: React.ReactNode;
}

export const News: React.FC = () => {
  const { t } = useAppTranslation();

  const [component, setComponent] = useState<React.ReactNode | null>(null);

  const NEWS_ITEMS: NewsItem[] = [
    {
      title: "Better Together Race - August 11th",
      description: "Complete tasks, earn tokens and win NFTs!",
      image: SUNNYSIDE.announcement.betterTogetherSeason,
      component: <BetterTogether onClose={() => setComponent(null)} />,
    },
    {
      title: "Social System - August 4th",
      description: "Make friends, climb the social ladder & build together!",
      image: SUNNYSIDE.announcement.social,
      component: <SocialSystem onClose={() => setComponent(null)} />,
    },
    {
      title: "Clean up - August 4th",
      description: "Find the hidden dung, weeds & trash!",
      image: SUNNYSIDE.announcement.cleaning,
      component: <Cleanup onClose={() => setComponent(null)} />,
    },
    {
      title: "Landscaping V2 - August 4th",
      description: "Biomes, Colored tiles, Flip & more!",
      image: SUNNYSIDE.announcement.landscaping,
      component: <Landscaping onClose={() => setComponent(null)} />,
    },
    {
      title: "Crafting - August 4th",
      description: "Instant crafting, new recipes, and more!",
      image: SUNNYSIDE.announcement.crafting,
      component: <Crafting onClose={() => setComponent(null)} />,
    },

    {
      title: t("news.flower.launch"),
      description: t("news.flower.launch.description"),
      image: SUNNYSIDE.announcement.flowerBanner,
      link: "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
    },
    {
      title: t("news.greatBloom"),
      description: t("news.greatBloom.description"),
      image: SUNNYSIDE.announcement.loveRush,
      link: "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
    },
    {
      title: t("news.ronin.network"),
      description: t("news.ronin.network.description"),
      image: SUNNYSIDE.announcement.roninBanner,
      link: "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
    },
  ];

  if (component) {
    return component;
  }

  return (
    <div className="max-h-[450px] overflow-y-auto scrollable">
      {NEWS_ITEMS.map((item) => (
        <ButtonPanel
          key={item.title}
          onClick={() => {
            if (item.link) {
              window.open(item.link, "_blank");
            }

            if (item.component) {
              setComponent(item.component);
            }
          }}
          className="mb-1"
        >
          <div className="flex justify-between items-center mb-1">
            <Label type="default">{item.title}</Label>
            <span className="underline text-xs pr-1">{t("read.more")}</span>
          </div>
          <div className="w-full relative">
            <img src={item.image} className="w-full mb-2 rounded-sm" />
          </div>

          <p className="text-xs px-1 mb-1">{item.description}</p>
        </ButtonPanel>
      ))}
    </div>
  );
};

interface NewsComponentProps {
  onClose: () => void;
}

export const SocialSystem: React.FC<NewsComponentProps> = ({ onClose }) => {
  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">Social System</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.icons.expression_chat,
            text: "You can now follow your friends, send messages & visit farms.",
          },
          {
            icon: ITEM_DETAILS.Cheer.image,
            text: "Each day you get 3 free Cheers - gift these to your friends to boost their social score.",
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.social}
        className="w-full mb-2 rounded-sm my-2"
      />
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.tools.hammer,
            text: "Build a monument with the help of your friends to claim a reward.",
          },
          {
            icon: garbageBin,
            text: "Collect garbage and convert it for extra Cheers.",
          },
        ]}
      />
    </>
  );
};

export const Cleanup: React.FC<NewsComponentProps> = ({ onClose }) => {
  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">Clean up</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: garbageBin,
            text: "Clean up your friend's farms, gather garbage and catch pests.",
          },
          {
            icon: ITEM_DETAILS.Cheer.image,
            text: "Earn social points by helping out.",
          },
          {
            icon: tradeIcon,
            text: "Exchange garbage for coins or extra Cheers.",
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.cleaning}
        className="w-full mb-2 rounded-sm my-2"
      />
    </>
  );
};

export const Landscaping: React.FC<NewsComponentProps> = ({ onClose }) => {
  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">Landscaping</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: biomeIcon,
            text: "Place biomes, colored tiles & new decorations.",
          },
          {
            icon: rotateIcon,
            text: "Rotate collectibles to beautify your farm!",
          },
          {
            icon: ITEM_DETAILS.Shovel.image,
            text: "Remove resources to make space for new decorations.",
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.landscaping}
        className="w-full mb-2 rounded-sm my-2"
      />
    </>
  );
};

export const Crafting: React.FC<NewsComponentProps> = ({ onClose }) => {
  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">Crafting</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS.Gem.image,
            text: "Use gems to insta-craft recipes at the Crafting Box.",
          },
          {
            icon: ITEM_DETAILS.Doll.image,
            text: "24 unique dolls to discover and craft.",
          },
          {
            icon: SUNNYSIDE.animals.cowSleeping,
            text: "Animals love to play - use dolls to insta-wake them up!",
          },
          {
            icon: SUNNYSIDE.icons.expression_confused,
            text: "Crafting decorations have been moved to the landscaping menu. Bumpkin wearables are now found at the Wardrobe in your home.",
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.crafting}
        className="w-full mb-2 rounded-sm my-2"
      />
    </>
  );
};

export const BetterTogether: React.FC<NewsComponentProps> = ({ onClose }) => {
  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">Better Together Chapter</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS.Bracelet.image,
            text: "Complete deliveries, chores & bounties to earn Bracelet tokens.",
          },
          {
            icon: shopIcon,
            text: "Exchange Bracelet tokens at the Megastore for exclusive collectible & wearable NFTs.",
          },
          {
            icon: ITEM_DETAILS["Rat King"].image,
            text: "Compete with other Bumpkins at the Auction House for the rarest NFTs.",
          },
          {
            icon: ITEM_DETAILS.Poseidon.image,
            text: "Discover mutants and other chapter-exclusive NFTs.",
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.betterTogetherSeason}
        className="w-full mb-2 rounded-sm my-2"
      />
    </>
  );
};
