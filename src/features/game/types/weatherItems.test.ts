import {
  getWeatherItemIngredients,
  isWeatherItemName,
  WEATHER_ITEM_EVENTS,
  WEATHER_ITEM_RECIPES,
} from "./weatherItems";

describe("WEATHER_ITEM_RECIPES", () => {
  // Pinned by hand rather than derived, so a changed amount has to be changed
  // here on purpose. Sandbag and Balk are provisional (see the recipe table).
  it("lists the fixed ingredients of each item", () => {
    expect(WEATHER_ITEM_RECIPES.Sandbag.ingredients).toEqual({
      Sand: 10,
      Leather: 2,
    });
    expect(WEATHER_ITEM_RECIPES.Balk.ingredients).toEqual({
      Wood: 10,
      Leather: 2,
    });
    expect(WEATHER_ITEM_RECIPES["Pest Smoker"].ingredients).toEqual({
      Wood: 30,
      Feather: 30,
    });
    expect(WEATHER_ITEM_RECIPES["Thaw Stone"].ingredients).toEqual({
      "Pig Bristles": 25,
      Stone: 5,
      "Merino Wool": 10,
    });
    expect(WEATHER_ITEM_RECIPES["Merino Wool Insulation"].ingredients).toEqual({
      "Pig Bristles": 25,
      "Merino Wool": 10,
    });
    expect(WEATHER_ITEM_RECIPES["Shade Cloth"].ingredients).toEqual({
      "Pig Bristles": 25,
      "Merino Wool": 10,
    });
    expect(WEATHER_ITEM_RECIPES["Wildflower Lure"].ingredients).toEqual({
      Honey: 5,
      "Green Beetle": 5,
    });
  });

  it("lets the Pest Smoker take any one kind of beetle", () => {
    expect(WEATHER_ITEM_RECIPES["Pest Smoker"].choice).toEqual({
      "Green Beetle": 10,
      "Blue Beetle": 3,
      "Pink Beetle": 2,
      "Amber Beetle": 1,
    });
  });

  it("lets the Wildflower Lure take one of any flower", () => {
    const choice = WEATHER_ITEM_RECIPES["Wildflower Lure"].choice ?? {};

    expect(choice["Red Pansy"]).toBe(1);
    expect(choice["Prism Petal"]).toBe(1);
    expect(choice["Green Beetle"]).toBeUndefined();
  });

  it("has no choice on the other five items", () => {
    expect(WEATHER_ITEM_RECIPES.Sandbag.choice).toBeUndefined();
    expect(WEATHER_ITEM_RECIPES.Balk.choice).toBeUndefined();
    expect(WEATHER_ITEM_RECIPES["Thaw Stone"].choice).toBeUndefined();
    expect(
      WEATHER_ITEM_RECIPES["Merino Wool Insulation"].choice,
    ).toBeUndefined();
    expect(WEATHER_ITEM_RECIPES["Shade Cloth"].choice).toBeUndefined();
  });
});

describe("isWeatherItemName", () => {
  it("accepts the seven items only", () => {
    expect(isWeatherItemName("Sandbag")).toBe(true);
    expect(isWeatherItemName("Wildflower Lure")).toBe(true);
    expect(isWeatherItemName("Tornado Pinwheel")).toBe(false);
    expect(isWeatherItemName("toString")).toBe(false);
  });
});

describe("getWeatherItemIngredients", () => {
  it("returns the fixed recipe when there is no choice", () => {
    expect(getWeatherItemIngredients("Sandbag")).toEqual({
      Sand: 10,
      Leather: 2,
    });
  });

  it("rejects an ingredient on a recipe without a choice", () => {
    expect(getWeatherItemIngredients("Sandbag", "Sand")).toBeUndefined();
  });

  it("adds the chosen beetle to the Pest Smoker", () => {
    expect(getWeatherItemIngredients("Pest Smoker", "Pink Beetle")).toEqual({
      Wood: 30,
      Feather: 30,
      "Pink Beetle": 2,
    });
  });

  it("adds the chosen flower to the Wildflower Lure", () => {
    expect(getWeatherItemIngredients("Wildflower Lure", "Red Pansy")).toEqual({
      Honey: 5,
      "Green Beetle": 5,
      "Red Pansy": 1,
    });
  });

  it("rejects a missing or unlisted choice", () => {
    expect(getWeatherItemIngredients("Pest Smoker")).toBeUndefined();
    expect(getWeatherItemIngredients("Pest Smoker", "Wood")).toBeUndefined();
    expect(
      getWeatherItemIngredients("Wildflower Lure", "Sunflower"),
    ).toBeUndefined();
  });
});

describe("WEATHER_ITEM_EVENTS", () => {
  it("pairs each item with the event it covers", () => {
    expect(WEATHER_ITEM_EVENTS).toEqual({
      Sandbag: "flood",
      Balk: "tornado",
      "Pest Smoker": "insectPlague",
      "Thaw Stone": "greatFreeze",
      "Merino Wool Insulation": "heavyRains",
      "Shade Cloth": "sunshower",
      "Wildflower Lure": "beeMigration",
    });
  });
});
