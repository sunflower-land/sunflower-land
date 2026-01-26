import React, { useContext, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { FilterOption, FilterOptionProps } from "./FilterOption";
import tradeIcon from "assets/icons/trade.png";
import trade_point from "src/assets/icons/trade_points_coupon.webp";
import lightning from "assets/icons/lightning.png";
import wearableIcon from "assets/icons/wearables.webp";
import budIcon from "assets/icons/bud.png";
import {
  useTraitFilters,
  TraitCollection,
  TraitKey,
  getTraitParamKeys,
  toTraitValueId,
} from "features/marketplace/lib/marketplaceFilters";
import {
  BUD_TRAIT_GROUPS,
  PET_TRAIT_GROUPS,
  TraitGroupDefinition,
} from "features/marketplace/lib/traitOptions";
import { getKeys, getValues } from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import {
  CHAPTER_BANNER_IMAGES,
  ChapterBanner,
  hasChapterEnded,
} from "features/game/types/chapters";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { hasFeatureAccess } from "lib/flags";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

const _hasChapterCollectionsAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "CHAPTER_COLLECTIONS");

export const Filters: React.FC<{
  onClose?: () => void;
  farmId: number;
  hideLimited?: boolean;
}> = ({ onClose, farmId, hideLimited }) => {
  const { gameService } = useContext(Context);
  const hasChapterCollectionsAccess = useSelector(
    gameService,
    _hasChapterCollectionsAccess,
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const filters = queryParams.get("filters");
  const chapterParam = queryParams.get("chapter") ?? "";
  const ownershipParam = queryParams.get("ownership") ?? "";
  const { t } = useAppTranslation();
  const now = useNow();
  const isWorldRoute = pathname.includes("/world");
  // Determine which collection is currently active based on the filters parameter
  let activeCollection: TraitCollection | undefined = undefined;
  if (filters?.includes("pets")) {
    activeCollection = "pets";
  } else if (filters?.includes("buds")) {
    activeCollection = "buds";
  }
  const { addFilter, removeFilter, hasFilter } =
    useTraitFilters(activeCollection);
  const [expandedTraitGroups, setExpandedTraitGroups] = useState<
    Record<string, boolean>
  >({});
  const [userChapterExpanded, setUserChapterExpanded] = useState(false);
  const isChapterExpanded = !!chapterParam || userChapterExpanded;

  const baseUrl = `${isWorldRoute ? "/world" : ""}/marketplace`;
  const filterTokens = (filters ?? "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  const ownershipTokens = ownershipParam
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  const ownershipSelection = {
    owned: ownershipTokens.includes("owned"),
    unowned: ownershipTokens.includes("unowned"),
  };
  const isCosmeticsActive = filters?.includes("cosmetic");
  const cosmeticSelection = {
    collectibles: isCosmeticsActive
      ? filterTokens.includes("collectibles")
      : true,
    wearables: isCosmeticsActive ? filterTokens.includes("wearables") : true,
  };

  const navigateTo = ({
    path,
    filterParams,
    closeFilters = true,
    extraParams,
  }: {
    path: string;
    filterParams?: string;
    closeFilters?: boolean;
    extraParams?: Record<string, string | undefined>;
  }) => {
    let url = `${baseUrl}/${path}`;

    if (filterParams) {
      const params = new URLSearchParams();
      // Determine the active collection based on filterParams for preserving trait selections
      let targetCollection: TraitCollection | undefined;
      if (filterParams.includes("pets")) {
        targetCollection = "pets";
      } else if (filterParams.includes("buds")) {
        targetCollection = "buds";
      } else {
        targetCollection = undefined;
      }

      if (targetCollection) {
        // Preserve any in-flight trait selections that belong to the target collection.
        getTraitParamKeys(targetCollection).forEach((trait) => {
          const value = queryParams.get(trait);
          if (value) {
            params.set(trait, value);
          }
        });
      }

      if (extraParams) {
        Object.entries(extraParams).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        });
      }

      const traitQuery = params.toString();
      const queryParts = [`filters=${filterParams}`];

      if (traitQuery) {
        queryParts.push(traitQuery);
      }

      url = `${baseUrl}/collection?${queryParts.join("&")}`;
    }

    navigate(url);
    if (closeFilters) onClose?.();
  };

  const isCollectionActive = (collection: TraitCollection) =>
    (filters?.split(",") ?? []).includes(collection);

  const ensureCollectionActive = (collection: TraitCollection) => {
    if (!isCollectionActive(collection)) {
      navigateTo({
        path: "collection",
        filterParams: collection,
        closeFilters: false,
      });
    }
  };

  const toggleTraitGroup = (collection: TraitCollection, trait: string) => {
    ensureCollectionActive(collection);
    const key = `${collection}-${trait}`;
    setExpandedTraitGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Converts the shared trait metadata into nested FilterOption entries.
  const buildTraitGroups = <T extends TraitKey>(
    collection: TraitCollection,
    groups: TraitGroupDefinition<T>[],
  ): FilterOptionProps[] =>
    groups.map((group) => {
      const key = `${collection}-${group.trait}`;
      const isOpen = !!expandedTraitGroups[key];

      return {
        label: group.label,
        onClick: () => toggleTraitGroup(collection, group.trait),
        isActive: isOpen,
        hasOptions: true,
        options: isOpen
          ? group.options.map((option) => {
              const filter = {
                collection,
                trait: group.trait,
                value: option.value,
              };

              return {
                label: option.label,
                onToggle: (checked: boolean) => {
                  ensureCollectionActive(collection);
                  if (checked) {
                    addFilter(filter);
                  } else {
                    removeFilter(filter);
                  }
                },
                checked: hasFilter(filter),
              };
            })
          : undefined,
      };
    });

  const setCosmeticSelection = (selection: {
    collectibles: boolean;
    wearables: boolean;
  }) => {
    if (!selection.collectibles && !selection.wearables) {
      return;
    }

    const nextTokens = filterTokens.filter(
      (token) => token !== "collectibles" && token !== "wearables",
    );

    if (selection.collectibles) {
      nextTokens.push("collectibles");
    }

    if (selection.wearables) {
      nextTokens.push("wearables");
    }

    if (!nextTokens.includes("cosmetic")) {
      nextTokens.push("cosmetic");
    }

    navigateTo({
      path: "collection",
      filterParams: nextTokens.join(","),
      closeFilters: false,
    });
  };

  const handleCosmeticToggle = (
    option: "collectibles" | "wearables",
    checked: boolean,
  ) => {
    if (!isCosmeticsActive) {
      navigateTo({
        path: "collection",
        filterParams: "collectibles,wearables,cosmetic",
        closeFilters: false,
      });
      return;
    }

    const nextSelection = {
      ...cosmeticSelection,
      [option]: checked,
    };

    if (!nextSelection.collectibles && !nextSelection.wearables) {
      return;
    }

    setCosmeticSelection(nextSelection);
  };

  const chapterOptions = getKeys(CHAPTER_COLLECTIONS)
    .filter((chapter) => hasChapterEnded(chapter, now))
    .map((chapter) => {
      const banner: ChapterBanner = `${chapter} Banner`;

      return {
        label: chapter,
        value: toTraitValueId(chapter),
        icon: CHAPTER_BANNER_IMAGES[banner],
      };
    });

  const handleChapterToggle = (value: string, checked: boolean) => {
    if (checked) {
      setExpandedTraitGroups({});
      setUserChapterExpanded(true);
      navigateTo({
        path: "collection",
        filterParams: "collectibles,wearables",
        closeFilters: false,
        extraParams: { chapter: value },
      });
      return;
    }

    const fallbackFilters =
      filterTokens.length > 0
        ? filterTokens.join(",")
        : "collectibles,wearables";
    navigateTo({
      path: "collection",
      filterParams: fallbackFilters,
      closeFilters: false,
      extraParams: { chapter: undefined },
    });
  };

  const filterOptions: FilterOptionProps[] = [
    // Trending
    {
      icon: SUNNYSIDE.icons.expression_alerted,
      label: t("marketplace.trending"),
      onClick: () => navigateTo({ path: "hot" }),
      isActive: pathname === `${baseUrl}/hot`,
    },
    // Power ups
    {
      icon: lightning,
      label: t("marketplace.powerUps"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "collectibles,wearables,utility",
        }),
      isActive: filters === "collectibles,wearables,utility",
      options: filters?.includes("utility")
        ? [
            {
              icon: ITEM_DETAILS["Freya Fox"].image,
              label: t("marketplace.collectibles"),
              isActive: filters === "utility,collectibles",
              onClick: () => {
                setExpandedTraitGroups({});
                navigateTo({
                  path: "collection",
                  filterParams: "utility,collectibles",
                });
              },
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              isActive: filters === "utility,wearables",
              onClick: () => {
                setExpandedTraitGroups({});
                navigateTo({
                  path: "collection",
                  filterParams: "utility,wearables",
                });
              },
            },
          ]
        : undefined,
    },
    // Resources
    {
      icon: ITEM_DETAILS.Eggplant.image,
      label: t("marketplace.resources"),
      onClick: () => {
        setExpandedTraitGroups({});
        navigateTo({
          path: "collection",
          filterParams: "resources",
        });
      },
      isActive: filters === "resources",
    },
    // Limited
    ...(!hideLimited
      ? [
          {
            icon: SUNNYSIDE.icons.stopwatch,
            label: t("marketplace.limited"),
            onClick: () => {
              setExpandedTraitGroups({});
              navigateTo({
                path: "collection",
                filterParams: "temporary",
              });
            },
            isActive: filters === "temporary",
          },
        ]
      : []),
    // Cosmetics
    {
      icon: SUNNYSIDE.icons.heart,
      label: t("marketplace.cosmetics"),
      onClick: () => {
        setExpandedTraitGroups({});
        navigateTo({
          path: "collection",
          filterParams: "collectibles,wearables,cosmetic",
          closeFilters: false,
        });
      },
      isActive: isCosmeticsActive,
      hasOptions: true,
      options: isCosmeticsActive
        ? [
            {
              icon: ITEM_DETAILS["Freya Fox"].image,
              label: t("marketplace.collectibles"),
              onToggle: (checked: boolean) =>
                handleCosmeticToggle("collectibles", checked),
              checked: cosmeticSelection.collectibles,
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              onToggle: (checked: boolean) =>
                handleCosmeticToggle("wearables", checked),
              checked: cosmeticSelection.wearables,
            },
          ]
        : undefined,
    },
    // Collections
    ...(hasChapterCollectionsAccess
      ? [
          {
            icon: SUNNYSIDE.icons.treasure,
            label: t("marketplace.collections"),
            onClick: () => setUserChapterExpanded((prev) => !prev),
            isActive: isChapterExpanded && !chapterParam,
            hasOptions: true,
            options: isChapterExpanded
              ? chapterOptions.map((option) => ({
                  icon: option.icon,
                  label: option.label,
                  onClick: () =>
                    handleChapterToggle(
                      option.value,
                      chapterParam !== option.value,
                    ),
                  isActive: chapterParam === option.value,
                  hasOptions: chapterParam === option.value,
                }))
              : undefined,
          },
        ]
      : []),
    // Buds
    {
      icon: budIcon,
      label: t("marketplace.budNfts"),
      onClick: () => {
        setExpandedTraitGroups({});
        navigateTo({
          path: "collection",
          filterParams: "buds",
          closeFilters: false,
        });
      },
      isActive:
        isCollectionActive("buds") &&
        getValues(expandedTraitGroups).filter(Boolean).length === 0,
      hasOptions: true,
      options: isCollectionActive("buds")
        ? buildTraitGroups("buds", BUD_TRAIT_GROUPS)
        : undefined,
    },
    // Pets
    {
      icon: ITEM_DETAILS.Ramsey.image,
      label: t("marketplace.pets"),
      onClick: () => {
        setExpandedTraitGroups({});
        navigateTo({
          path: "collection",
          filterParams: "pets",
          closeFilters: false,
        });
      },
      isActive:
        isCollectionActive("pets") &&
        getValues(expandedTraitGroups).filter(Boolean).length === 0,
      hasOptions: true,
      options: isCollectionActive("pets")
        ? buildTraitGroups("pets", PET_TRAIT_GROUPS)
        : undefined,
    },
    {
      icon: SUNNYSIDE.icons.player,
      label: t("marketplace.myProfile"),
      onClick: () => {
        setExpandedTraitGroups({});
        navigateTo({
          path: `profile/${farmId}`,
        });
      },
      options: pathname.includes("profile")
        ? [
            {
              icon: SUNNYSIDE.icons.lightning,
              label: t("marketplace.stats"),
              onClick: () =>
                navigateTo({
                  path: `profile/${farmId}`,
                }),
              isActive: pathname === `${baseUrl}/profile/${farmId}`,
            },
            {
              icon: tradeIcon,
              label: t("marketplace.trades"),
              onClick: () =>
                navigateTo({
                  path: `profile/${farmId}/trades`,
                }),
              isActive: pathname === `${baseUrl}/profile/${farmId}/trades`,
            },
            {
              icon: trade_point,
              label: t("marketplace.rewards"),
              onClick: () =>
                navigateTo({
                  path: "profile/rewards",
                }),
              isActive: pathname === `${baseUrl}/profile/rewards`,
            },
          ]
        : undefined,
    },
  ];

  const showApplyFiltersButton =
    activeCollection === "buds" ||
    activeCollection === "pets" ||
    isCosmeticsActive ||
    !!chapterParam ||
    ownershipSelection.owned ||
    ownershipSelection.unowned;

  return (
    <>
      <div className="max-h-[400px] mb-1 flex flex-col p-1 overflow-y-auto overflow-x-hidden scrollable sm:mb-0 sm:max-h-[500px]">
        {filterOptions.map((option) => (
          <FilterOption key={option.label} {...option} />
        ))}
      </div>
      {showApplyFiltersButton && (
        <Button className="mb-1 sm:hidden" onClick={onClose}>
          {t("marketplace.applyFilters")}
        </Button>
      )}
    </>
  );
};
