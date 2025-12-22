import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import garbageBin from "assets/sfts/garbage_bin.webp";
import tradeIcon from "assets/icons/trade.png";
import biomeIcon from "assets/icons/islands/basic.webp";
import rotateIcon from "assets/icons/flip.webp";
import shopIcon from "assets/icons/shop.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import lightningIcon from "assets/icons/lightning.png";
import flowerIcon from "assets/icons/flower_token.webp";
import redPansyIcon from "assets/flowers/red_pansy.webp";
import { CHAPTER_TICKET_NAME, ChapterName } from "features/game/types/chapters";
import { CHAPTER_MUTANTS } from "features/island/hud/components/codex/components/ChapterMutants";
import { CHAPTER_GRAPHICS } from "features/island/hud/components/codex/pages/Chapter";

export function hasReadNews() {
  const readAt = localStorage.getItem("newsReadAt");
  if (!readAt) return false;

  const recentNewsItem = NEWS_ITEMS.filter(
    (item) => item.date.getTime() < new Date().getTime(),
  ).sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  const date = new Date(readAt);

  return date.getTime() >= recentNewsItem.date.getTime();
}

export function storeNewsReadAt() {
  const recentNewsItem = NEWS_ITEMS.filter(
    (item) => item.date.getTime() < new Date().getTime(),
  ).sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  localStorage.setItem("newsReadAt", recentNewsItem.date.toISOString());
}

interface NewsItem {
  title: TranslationKeys;
  description: TranslationKeys;
  image: string;
  link?: string;
  component?: React.FC<NewsComponentProps>;
  date: Date;
}

interface NewsComponentProps {
  onClose: () => void;
}

export const SocialSystem: React.FC<NewsComponentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.socialSystem.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.icons.expression_chat,
            text: t("news.socialSystem.followFriends"),
          },
          {
            icon: ITEM_DETAILS.Cheer.image,
            text: t("news.socialSystem.cheers"),
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
            text: t("news.socialSystem.monument"),
          },
          {
            icon: garbageBin,
            text: t("news.socialSystem.garbage"),
          },
        ]}
      />
    </>
  );
};

export const Cleanup: React.FC<NewsComponentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.cleanup.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: garbageBin,
            text: t("news.cleanup.cleanFarms"),
          },
          {
            icon: ITEM_DETAILS.Cheer.image,
            text: t("news.cleanup.socialPoints"),
          },
          {
            icon: tradeIcon,
            text: t("news.cleanup.exchange"),
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
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.landscaping.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: biomeIcon,
            text: t("news.landscaping.biomes"),
          },
          {
            icon: rotateIcon,
            text: t("news.landscaping.rotate"),
          },
          {
            icon: ITEM_DETAILS.Shovel.image,
            text: t("news.landscaping.remove"),
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
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.crafting.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS.Gem.image,
            text: t("news.crafting.instaCraft"),
          },
          {
            icon: ITEM_DETAILS.Doll.image,
            text: t("news.crafting.dolls"),
          },
          {
            icon: SUNNYSIDE.animals.cowSleeping,
            text: t("news.crafting.animals"),
          },
          {
            icon: SUNNYSIDE.icons.expression_confused,
            text: t("news.crafting.moved"),
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
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">
          {t("news.betterTogether.backButton")}
        </p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS.Bracelet.image,
            text: t("news.betterTogether.bracelets"),
          },
          {
            icon: shopIcon,
            text: t("news.betterTogether.megastore"),
          },
          {
            icon: ITEM_DETAILS["Rat King"].image,
            text: t("news.betterTogether.auction"),
          },
          {
            icon: ITEM_DETAILS.Poseidon.image,
            text: t("news.betterTogether.mutants"),
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

export const Pets: React.FC<NewsComponentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.pets.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.icons.expression_confused,
            text: t("news.pets.one"),
          },
          {
            icon: SUNNYSIDE.icons.heart,
            text: t("news.pets.two"),
          },
          {
            icon: lightningIcon,
            text: t("news.pets.three"),
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.pets}
        className="w-full mb-2 rounded-sm my-2"
      />
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.icons.stressed,
            text: t("news.pets.four"),
          },
          {
            icon: flowerIcon,
            text: t("news.pets.five"),
          },
        ]}
      />
      <a
        href="https://github.com/sunflower-land/sunflower-land/discussions/5657"
        target="_blank"
        className="m-2 underline text-xs"
        rel="noreferrer"
      >
        {t("read.more")}
      </a>
    </>
  );
};

export const ObsidianUpdates: React.FC<NewsComponentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">{t("news.obsidian.backButton")}</p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: SUNNYSIDE.tools.hammer,
            text: t("news.obsidian.one"),
          },
          {
            icon: redPansyIcon,
            text: t("news.obsidian.two"),
          },
          {
            icon: lightningIcon,
            text: t("news.obsidian.three"),
          },
        ]}
      />
      <img
        src={SUNNYSIDE.announcement.obsidian_updates}
        className="w-full mb-2 rounded-sm my-2"
      />
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS.Obsidian.image,
            text: t("news.obsidian.four"),
          },
          {
            icon: ITEM_DETAILS["Lava Pit"].image,
            text: t("news.obsidian.five"),
          },
        ]}
      />
      <a
        href="https://github.com/sunflower-land/sunflower-land/discussions/5891"
        target="_blank"
        className="m-2 underline text-xs"
        rel="noreferrer"
      >
        {t("read.more")}
      </a>
    </>
  );
};

const Chapter: React.FC<NewsComponentProps & { chapter: ChapterName }> = ({
  onClose,
  chapter,
}) => {
  const { t } = useAppTranslation();

  const ticket = CHAPTER_TICKET_NAME[chapter];
  const mutant = CHAPTER_MUTANTS[chapter]?.fish;
  const banner = CHAPTER_GRAPHICS[chapter];

  return (
    <>
      <div className="flex  cursor-pointer mb-2 items-center" onClick={onClose}>
        <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
        <p className="text-xs underline">
          {t("news.chapter.backButton", { chapter })}
        </p>
      </div>
      <NoticeboardItems
        items={[
          {
            icon: ITEM_DETAILS[ticket].image,
            text: t("news.chapter.ticket", { ticket }),
          },
          {
            icon: shopIcon,
            text: t("news.chapter.megastore", { ticket }),
          },
          {
            icon: SUNNYSIDE.icons.stopwatch,
            text: t("news.chapter.auction", { ticket }),
          },
          {
            icon: mutant ? ITEM_DETAILS[mutant].image : SUNNYSIDE.icons.fish,
            text: t("news.chapter.mutants", { ticket }),
          },
        ]}
      />
      <img src={banner} className="w-full mb-2 rounded-sm my-2" />
    </>
  );
};

const PawPrints: React.FC<NewsComponentProps> = ({ onClose }) => {
  return <Chapter onClose={onClose} chapter="Paw Prints" />;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    title: "news.pawprints.title",
    description: "news.pawprints.description",
    image: CHAPTER_GRAPHICS["Paw Prints"],
    component: PawPrints,
    date: new Date("2025-11-03"),
  },
  {
    title: "news.pets.title",
    description: "news.pets.description",
    image: SUNNYSIDE.announcement.pets,
    component: Pets,
    date: new Date("2025-11-04"),
  },
  {
    title: "news.obsidian.title",
    description: "news.obsidian.description",
    image: SUNNYSIDE.announcement.obsidian_updates,
    component: ObsidianUpdates,
    date: new Date("2025-11-04"),
  },
  {
    title: "news.betterTogether.title",
    description: "news.betterTogether.description",
    image: SUNNYSIDE.announcement.betterTogetherSeason,
    component: BetterTogether,
    date: new Date("2025-08-11"),
  },
  {
    title: "news.socialSystem.title",
    description: "news.socialSystem.description",
    image: SUNNYSIDE.announcement.social,
    component: SocialSystem,
    date: new Date("2025-08-04"),
  },
  {
    title: "news.cleanup.title",
    description: "news.cleanup.description",
    image: SUNNYSIDE.announcement.cleaning,
    component: Cleanup,
    date: new Date("2025-08-04"),
  },
  {
    title: "news.landscaping.title",
    description: "news.landscaping.description",
    image: SUNNYSIDE.announcement.landscaping,
    component: Landscaping,
    date: new Date("2025-08-04"),
  },
  {
    title: "news.crafting.title",
    description: "news.crafting.description",
    image: SUNNYSIDE.announcement.crafting,
    component: Crafting,
    date: new Date("2025-08-04"),
  },

  {
    title: "news.flower.launch",
    description: "news.flower.launch.description",
    image: SUNNYSIDE.announcement.flowerBanner,
    date: new Date("2025-05-14"),
  },
  {
    title: "news.greatBloom",
    description: "news.greatBloom.description",
    image: SUNNYSIDE.announcement.loveRush,
    date: new Date("2025-05-01"),
  },
  {
    title: "news.ronin.network",
    description: "news.ronin.network.description",
    image: SUNNYSIDE.announcement.roninBanner,
    date: new Date("2025-04-01"),
  },
];

export const News: React.FC = () => {
  const { t } = useAppTranslation();

  const [Component, setComponent] = useState<React.ReactNode | null>(null);

  // Store read at
  useEffect(() => {
    storeNewsReadAt();
  }, []);

  if (Component) {
    return Component;
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
              setComponent(
                <item.component onClose={() => setComponent(null)} />,
              );
            }
          }}
          className="mb-1"
        >
          <div className="flex justify-between items-center mb-1 flex-wrap">
            <Label type="default">{t(item.title)}</Label>
            <span className="underline text-xs pr-1">{t("read.more")}</span>
          </div>
          <div className="w-full relative">
            <img src={item.image} className="w-full mb-2 rounded-sm" />
          </div>

          <p className="text-xs px-1 mb-1">{t(item.description)}</p>
        </ButtonPanel>
      ))}
    </div>
  );
};
