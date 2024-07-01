# Decorations

Are you ready to add some beautiful decorations to Sunflower Land?

As of 1st July 2024, we have a new way to quickly add decorations.

### 🌻 Steps

1. Save the image in `src/assets/sfts/[NAME]`
2. Update `DECORATION_TEMPLATES` in `decorations.ts` with the config for your decoration
3. Update `ITEM_DETAILS` with the details (e.g. descriptions)

### 🧑‍🌾 Open Sea

When you add a decoration, it is also important to set the Open Sea metadata. This is what players will see on secondary marketplaces.

**Generating Images**

You can quickly generate an OpenSea image without needing to open an image editor!

1. Navigate to `metadata/generateImages.ts`
2. Update `IMAGES` with the name of your object and image file path
3. Run `yarn images`

**Open Sea Metadata**

Open Sea has a unique JSON format that we must generate. You must manually run this script to generate the correct JSON file.

1. `yarn metadata`
