import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { FilterOption, FilterOptionProps } from "./FilterOption";
import { PET_CATEGORY_NAMES, PET_NFT_TYPES } from "features/game/types/pets";
import {
  ACCESSORY_TRAITS,
  AURA_TRAITS,
  BIB_TRAITS,
  FUR_TRAITS,
} from "features/pets/data/types";
import camelCase from "lodash.camelcase";
import {
  types as BUD_TYPES,
  auras as BUD_AURAS,
  stems as BUD_STEMS,
  colours as BUD_COLOURS,
} from "lib/buds/types";

import tradeIcon from "assets/icons/trade.png";
import trade_point from "src/assets/icons/trade_points_coupon.webp";
import lightning from "assets/icons/lightning.png";
import wearableIcon from "assets/icons/wearables.webp";
import budIcon from "assets/icons/bud.png";

export const Filters: React.FC<{
  onClose?: () => void;
  farmId: number;
}> = ({ onClose, farmId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const filters = queryParams.get("filters");
  const { t } = useTranslation();
  const isWorldRoute = pathname.includes("/world");

  const baseUrl = `${isWorldRoute ? "/world" : ""}/marketplace`;
  const navigateTo = ({
    path,
    filterParams,
    closeFilters = true,
  }: {
    path: string;
    filterParams?: string;
    closeFilters?: boolean;
  }) => {
    const url = filterParams
      ? `${baseUrl}/collection?filters=${filterParams}`
      : `${baseUrl}/${path}`;

    navigate(url);
    if (closeFilters) onClose?.();
  };

  const filterOptions: FilterOptionProps[] = [
    {
      icon: SUNNYSIDE.icons.expression_alerted,
      label: t("marketplace.trending"),
      onClick: () => navigateTo({ path: "hot" }),
      isActive: pathname === `${baseUrl}/hot`,
    },
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
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "utility,collectibles",
                }),
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              isActive: filters === "utility,wearables",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "utility,wearables",
                }),
            },
          ]
        : undefined,
    },
    {
      icon: ITEM_DETAILS.Eggplant.image,
      label: t("marketplace.resources"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "resources",
        }),
      isActive: filters === "resources",
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      label: t("marketplace.limited"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "temporary",
        }),
      isActive: filters === "temporary",
    },
    {
      icon: SUNNYSIDE.icons.heart,
      label: t("marketplace.cosmetics"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "collectibles,wearables,cosmetic",
        }),
      isActive: filters === "collectibles,wearables,cosmetic",
      options: filters?.includes("cosmetic")
        ? [
            {
              icon: ITEM_DETAILS["Freya Fox"].image,
              label: t("marketplace.collectibles"),
              isActive: filters === "cosmetic,collectibles",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "cosmetic,collectibles",
                }),
            },
            {
              icon: wearableIcon,
              label: t("marketplace.wearables"),
              isActive: filters === "cosmetic,wearables",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "cosmetic,wearables",
                }),
            },
          ]
        : undefined,
    },
    {
      icon: budIcon,
      label: t("marketplace.budNfts"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "buds",
        }),
      isActive: filters === "buds",
      options: filters?.includes("buds")
        ? [
            {
              icon: "",
              label: "Type",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "buds?type",
                  closeFilters: false,
                }),
              isActive: filters === "buds?type",
              options: filters?.includes("buds?type")
                ? [
                    ...BUD_TYPES.map((type) => ({
                      icon: "",
                      label: type.name,
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: `buds?type=${type.name}`,
                        }),
                      isActive: filters === `buds?type=${type.name}`,
                    })),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Aura",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "buds?aura",
                  closeFilters: false,
                }),
              isActive: filters === "buds?aura",
              options: filters?.includes("buds?aura")
                ? [
                    ...BUD_AURAS.map((aura) => {
                      const label =
                        aura.name === "No Aura" ? "None" : aura.name;
                      const auraCamelCase = camelCase(aura.name);

                      return {
                        icon: "",
                        label,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `buds?aura=${auraCamelCase}`,
                          }),
                        isActive: filters === `buds?aura=${auraCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Stem",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "buds?stem",
                  closeFilters: false,
                }),
              isActive: filters === "buds?stem",
              options: filters?.includes("buds?stem")
                ? [
                    ...BUD_STEMS.map((stem) => {
                      const stemCamelCase = camelCase(stem.name);

                      return {
                        icon: "",
                        label: stem.name,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `buds?stem=${stemCamelCase}`,
                          }),
                        isActive: filters === `buds?stem=${stemCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Colour",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "buds?colour",
                  closeFilters: false,
                }),
              isActive: filters === "buds?colour",
              options: filters?.includes("buds?colour")
                ? [
                    ...BUD_COLOURS.map((colour) => {
                      return {
                        icon: "",
                        label: colour.name,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `buds?colour=${colour.name}`,
                          }),
                        isActive: filters === `buds?colour=${colour.name}`,
                      };
                    }),
                  ]
                : undefined,
            },
          ]
        : undefined,
    },
    {
      icon: ITEM_DETAILS.Ramsey.image,
      label: t("marketplace.pets"),
      onClick: () =>
        navigateTo({
          path: "collection",
          filterParams: "pets",
        }),
      isActive: filters === "pets",
      options: filters?.includes("pets")
        ? [
            {
              icon: "",
              label: "Breed",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?type",
                  closeFilters: false,
                }),
              isActive: filters === "pets?type",
              options: filters?.includes("pets?type")
                ? [
                    ...PET_NFT_TYPES.map((type) => ({
                      icon: "",
                      label: type,
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: `pets?type=${type}`,
                        }),
                      isActive: filters === `pets?type=${type}`,
                    })),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Category",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?category",
                  closeFilters: false,
                }),
              isActive: filters === "pets?category",
              options: filters?.includes("pets?category")
                ? [
                    ...PET_CATEGORY_NAMES.map((category) => ({
                      icon: "",
                      label: category,
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: `pets?category=${category}`,
                        }),
                      isActive: filters === `pets?category=${category}`,
                    })),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Aura",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?aura",
                  closeFilters: false,
                }),
              isActive: filters === "pets?aura",
              options: filters?.includes("pets?aura")
                ? [
                    ...AURA_TRAITS.map((aura) => {
                      const auraCamelCase = camelCase(aura);
                      const label =
                        aura === "No Aura" ? "None" : aura.split(" ")[0];

                      return {
                        icon: "",
                        label,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?aura=${auraCamelCase}`,
                          }),
                        isActive: filters === `pets?aura=${auraCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Bib",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?bib",
                  closeFilters: false,
                }),
              isActive: filters === "pets?bib",
              options: filters?.includes("pets?bib")
                ? [
                    ...BIB_TRAITS.map((bib) => {
                      const bibCamelCase = camelCase(bib);

                      return {
                        icon: "",
                        label: bib,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?bib=${bibCamelCase}`,
                          }),
                        isActive: filters === `pets?bib=${bibCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Fur",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?fur",
                  closeFilters: false,
                }),
              isActive: filters === "pets?fur",
              options: filters?.includes("pets?fur")
                ? [
                    ...FUR_TRAITS.map((fur) => {
                      const furCamelCase = camelCase(fur);

                      return {
                        icon: "",
                        label: fur,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?fur=${furCamelCase}`,
                          }),
                        isActive: filters === `pets?fur=${furCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
            {
              icon: "",
              label: "Accessory",
              onClick: () =>
                navigateTo({
                  path: "collection",
                  filterParams: "pets?accessory",
                  closeFilters: false,
                }),
              isActive: filters === "pets?accessory",
              options: filters?.includes("pets?accessory")
                ? [
                    ...ACCESSORY_TRAITS.map((accessory) => {
                      const accessoryCamelCase = camelCase(accessory);

                      return {
                        icon: "",
                        label: accessory,
                        onClick: () =>
                          navigateTo({
                            path: "collection",
                            filterParams: `pets?accessory=${accessoryCamelCase}`,
                          }),
                        isActive:
                          filters === `pets?accessory=${accessoryCamelCase}`,
                      };
                    }),
                  ]
                : undefined,
            },
          ]
        : undefined,
    },
    {
      icon: SUNNYSIDE.icons.player,
      label: t("marketplace.myProfile"),
      onClick: () =>
        navigateTo({
          path: `profile/${farmId}`,
        }),
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

  return (
    <div className="flex flex-col p-1 sm:max-h-[500px] sm:overflow-y-auto sm:overflow-x-hidden scrollable">
      {filterOptions.map((option) => (
        <FilterOption key={option.label} {...option} />
      ))}
    </div>
  );
};
