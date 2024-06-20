import { Equipped } from "features/game/types/bumpkin";

export type NPCName =
  | "portaller"
  | "gambit"
  | "victoria"
  | "jester"
  | "gaucho"
  | "chicken"
  | "hopper"
  | "flopsy"
  | "betty"
  | "bruce"
  | "hank"
  | "jake"
  | "orlin"
  | "blacksmith"
  | "grimbly"
  | "wizard"
  | "grimtooth"
  | "grubnuk"
  | "marcus"
  | "bella"
  | "sofia"
  | "adam"
  | "buttons"
  | "timmy"
  | "misty marvel"
  | "igor"
  | "hammerin harry"
  | "frankie"
  | "stella"
  | "gabi"
  | "tywin"
  | "pumpkin' pete"
  | "gordy" // TO ADD
  | "bert"
  | "craig"
  | "raven" // TO ADD
  | "birdie"
  | "old salty"
  | "cornwell"
  | "wanderleaf"
  | "otis"
  | "dreadhorn"
  | "luna"
  | "billy"
  | "phantom face"
  | "farmer flesh"
  | "boneyard betty"
  | "eins"
  | "garth"
  | "reelin roy"
  | "shelly"
  | "finn"
  | "finley"
  | "tango"
  | "corale"
  | "goldtooth"
  | "daphne"
  | "miranda"
  | "damien"
  | "mayor"
  | "wobble"
  | "santa"
  | "elf"
  | "misty"
  | "poppy"
  | "stevie"
  | "Chun Long"
  | "evie"
  | "gordo"
  | "goblet"
  | "garbo"
  | "guria"
  | "grabnab"
  | "greedclaw"
  | "grommy" // faction spruiker;
  | "lady day" // faction spruiker;
  | "robert" // faction spruiker;
  | "maximus" // faction spruiker;
  | "graxle" // faction recruiter;
  | "barlow" // faction recruiter;
  | "nyx" // faction recruiter;
  | "reginald" // faction recruiter;
  | "chef tuck" // goblin chef
  | "chef ebon" // nightshade chef
  | "chef maple" // bumpkins chef
  | "chef lumen" // sunflorian chef
  | "glinteye"
  | "solara"
  | "dusk"
  | "haymitch"
  | "grizzle"
  | "buttercup"
  | "shadow"
  | "flora"
  | "eldric";

export const NPC_WEARABLES: Record<NPCName, Equipped> = {
  "chef tuck": {
    body: "Goblin Potion",
    hair: "Wise Hair",
    hat: "Chef Hat",
    shirt: "Goblin Armor",
    pants: "Goblin Pants",
    tool: "Skinning Knife",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    coat: "Chef Apron",
  },
  "chef maple": {
    body: "Light Brown Farmer Potion",
    hair: "Brown Long Hair",
    hat: "Chef Hat",
    shirt: "Bumpkin Armor",
    pants: "Bumpkin Pants",
    tool: "Pan",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    coat: "Chef Apron",
  },
  "chef ebon": {
    body: "Dark Brown Farmer Potion",
    hair: "Sun Spots",
    hat: "Chef Hat",
    shirt: "Nightshade Armor",
    pants: "Nightshade Pants",
    tool: "Golden Spatula",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    coat: "Chef Apron",
  },
  "chef lumen": {
    body: "Beige Farmer Potion",
    hair: "Parlour Hair",
    hat: "Chef Hat",
    shirt: "Sunflorian Armor",
    pants: "Sunflorian Pants",
    tool: "Parsnip",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    coat: "Chef Apron",
  },
  gambit: {
    body: "Goblin Potion",
    hair: "Sun Spots",
    hat: "Knight Gambit",
    pants: "Farmer Pants",
    shirt: "Fire Shirt",
    tool: "Goblin Puppet",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  portaller: {
    body: "Beige Farmer Potion",
    hair: "Sun Spots",
    hat: "Knight Gambit",
    pants: "Farmer Pants",
    shirt: "Fire Shirt",
    suit: "Motley",
    tool: "Goblin Puppet",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  jester: {
    body: "Beige Farmer Potion",
    hair: "Fire Hair",
    suit: "Motley",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Auction Megaphone",
    background: "Farm Background",
    shoes: "Brown Boots",
    hat: "Cap n Bells",
  },
  victoria: {
    body: "Beige Farmer Potion",
    hair: "Royal Braids",
    dress: "Royal Dress",
    tool: "Royal Scepter",
    background: "Farm Background",
    shoes: "Brown Boots",
    hat: "Queen's Crown",
  },
  gaucho: {
    body: "Beige Farmer Potion",
    hair: "Wise Hair",
    beard: "Wise Beard",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Auction Megaphone",
    background: "Farm Background",
    shoes: "Brown Boots",
    hat: "Boater Hat",
  },
  chicken: {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    pants: "Farmer Overalls",
    shirt: "Blue Farmer Shirt",
    hat: "Chicken Hat",
  },
  flopsy: {
    body: "Dark Brown Farmer Potion",
    hair: "Wise Hair",
    beard: "Wise Beard",
    pants: "Wise Slacks",
    shirt: "Wise Robes",
    tool: "Wise Staff",
    secondaryTool: "Wise Book",
    background: "Farm Background",
    shoes: "Brown Boots",
    onesie: "Bunny Onesie",
  },
  hopper: {
    body: "Beige Farmer Potion",
    hair: "Wise Hair",
    beard: "Wise Beard",
    pants: "Wise Slacks",
    shirt: "Wise Robes",
    tool: "Wise Staff",
    secondaryTool: "Wise Book",
    background: "Farm Background",
    shoes: "Brown Boots",
    onesie: "Bunny Onesie",
  },
  greedclaw: {
    body: "Goblin Potion",
    hair: "Wise Hair",
    beard: "Wise Beard",
    pants: "Wise Slacks",
    shirt: "Wise Robes",
    tool: "Wise Staff",
    secondaryTool: "Wise Book",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  grabnab: {
    body: "Goblin Potion",
    background: "Dawn Breaker Background",
    hair: "Sun Spots",
    shirt: "Bidder's Brocade",
    pants: "Auctioneer Slacks",
    shoes: "Leather Shoes",
    tool: "Auction Megaphone",
    hat: "Harry's Hat",
  },
  garbo: {
    body: "Goblin Potion",
    shirt: "Yellow Farmer Shirt",
    pants: "Farmer Overalls",
    hair: "Buzz Cut",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    tool: "Ancient Goblin Sword",
  },
  gordo: {
    body: "Goblin Potion",
    shirt: "Hawaiian Shirt",
    pants: "Farmer Pants",
    hair: "Sun Spots",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    tool: "Parsnip",
  },

  goblet: {
    body: "Goblin Potion",
    shirt: "Blue Farmer Shirt",
    pants: "Farmer Pants",
    hair: "White Long Hair",
    hat: "Luna's Hat",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    tool: "Dawn Lamp",
  },

  guria: {
    body: "Goblin Potion",
    shirt: "Red Farmer Shirt",
    pants: "Lumberjack Overalls",
    hair: "Rancher Hair",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    tool: "Pirate Scimitar",
  },

  evie: {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Pink Ponytail",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    pants: "Farmer Overalls",
    shirt: "Blue Farmer Shirt",
  },
  wizard: {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Wise Hair",
    shoes: "Black Farmer Boots",
    hat: "Feather Hat",
    tool: "Sunflower Rod",
    pants: "Traveller's Pants",
    shirt: "Traveller's Shirt",
  },
  "reelin roy": {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shoes: "Black Farmer Boots",
    tool: "Sunflower Rod",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
  },
  wanderleaf: {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Sun Spots",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    pants: "Traveller's Pants",
    shirt: "Traveller's Shirt",
    wings: "Traveller's Backpack",
  },
  dreadhorn: {
    background: "Farm Background",
    body: "Beige Farmer Potion",
    hair: "Sun Spots",
    hat: "Cattlegrim",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    pants: "Traveller's Pants",
    shirt: "Traveller's Shirt",
    suit: "Ox Costume",
  },
  jake: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  betty: {
    body: "Beige Farmer Potion",
    hair: "Rancher Hair",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Parsnip",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  blacksmith: {
    body: "Light Brown Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Lumberjack Overalls",
    shirt: "SFL T-Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  bruce: {
    body: "Beige Farmer Potion",
    hair: "Buzz Cut",
    pants: "Farmer Pants",
    shirt: "Yellow Farmer Shirt",
    coat: "Chef Apron",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  otis: {
    body: "Beige Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",
    hair: "Sun Spots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  hank: {
    body: "Light Brown Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",
    hair: "Sun Spots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Old Shoes",
  },
  grimbly: {
    body: "Goblin Potion",
    pants: "Brown Suspenders",
    tool: "Hammer",
    hair: "Blacksmith Hair",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    shirt: "Yellow Farmer Shirt",
  },
  grimtooth: {
    body: "Goblin Potion",
    shirt: "Red Farmer Shirt",
    pants: "Lumberjack Overalls",
    hair: "Blacksmith Hair",
    tool: "Hammer",
    background: "Cemetery Background",
    shoes: "Black Farmer Boots",
  },
  grubnuk: {
    body: "Goblin Potion",
    shirt: "SFL T-Shirt",
    pants: "Farmer Pants",
    hair: "Buzz Cut",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    tool: "Pirate Scimitar",
  },
  marcus: {
    hair: "Blacksmith Hair",
    shirt: "Striped Blue Shirt",
    pants: "Lumberjack Overalls",
    body: "Light Brown Farmer Potion",
    background: "Farm Background",
    tool: "Farmer Pitchfork",
    shoes: "Black Farmer Boots",
  },
  bella: {
    hair: "Parlour Hair",
    hat: "Straw Hat",
    shirt: "Maiden Top",
    pants: "Peasant Skirt",
    tool: "Farmer Pitchfork",
    body: "Light Brown Farmer Potion",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  sofia: {
    hair: "Red Long Hair",
    shirt: "Fire Shirt",
    necklace: "Artist Scarf",
    pants: "Farmer Pants",
    body: "Light Brown Farmer Potion",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    onesie: "Eggplant Onesie",
  },
  // Welcomes to plaza - friendly + wholesome
  adam: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Blue Suspenders",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
  },
  orlin: {
    body: "Beige Farmer Potion",
    background: "Cemetery Background",
    hair: "Buzz Cut",
    hat: "Mushroom Hat",
    shirt: "Mushroom Sweater",
    pants: "Mushroom Pants",
    shoes: "Yellow Boots",
    tool: "Farmer Pitchfork",
  },
  // Young curious boy resident - scared of goblins
  timmy: {
    body: "Beige Farmer Potion",
    onesie: "Bear Onesie",
    background: "Cemetery Background",
    hair: "Buzz Cut",
    shirt: "Striped Red Shirt",
    pants: "Farmer Overalls",
    shoes: "Yellow Boots",
    tool: "Goblin Puppet",
  },
  // Auctioneer who collects rare items and sells them off
  "hammerin harry": {
    body: "Beige Farmer Potion",
    background: "Dawn Breaker Background",
    hair: "Tangerine Hair",
    shirt: "Bidder's Brocade",
    pants: "Auctioneer Slacks",
    shoes: "Leather Shoes",
    tool: "Auction Megaphone",
    hat: "Harry's Hat",
  },
  // Grave Digger
  craig: {
    body: "Infected Potion",
    background: "Cemetery Background",
    hair: "Sun Spots",
    shirt: "Blue Farmer Shirt",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Grave Diggers Shovel",
  },
  gabi: {
    body: "Beige Farmer Potion",
    background: "Cemetery Background",
    hair: "Parlour Hair",
    shirt: "Bumpkin Art Competition Merch",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Hammer",
  },
  // Mysterious NPC that occasionally appears and sells rare items
  "misty marvel": {
    body: "Beige Farmer Potion",
    background: "Cemetery Background",
    hair: "Red Long Hair",
    shirt: "Fire Shirt",
    pants: "Maiden Skirt",
    shoes: "Black Farmer Boots",
    tool: "Dawn Lamp",
  },
  // Local farmer in Plaza
  "pumpkin' pete": {
    body: "Light Brown Farmer Potion",
    background: "Farm Background",
    hair: "Buzz Cut",
    hat: "Pumpkin Hat",
    shirt: "Yellow Farmer Shirt",
    pants: "Lumberjack Overalls",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
  },
  // Crazy buggy eyed bert
  bert: {
    body: "Beige Farmer Potion",
    background: "Farm Background",
    hair: "Greyed Glory",
    shirt: "Tattered Jacket",
    pants: "Tattered Slacks",
    shoes: "Old Shoes",
    tool: "Farmer Pitchfork",
  },
  // Announces news
  birdie: {
    body: "Beige Farmer Potion",
    background: "Farm Background",
    hair: "Brown Long Hair",
    coat: "Royal Robe",
    dress: "Rose Dress",
    hat: "Crown",
    tool: "Pan",
    shoes: "Black Farmer Boots",
    wings: "Bee Wings",
  },
  // Old loving grandma of the game
  buttons: {
    body: "Beige Farmer Potion",
    background: "Farm Background",
    hair: "Brown Long Hair",
    shirt: "Fruit Picker Shirt",
    coat: "Chef Apron",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
  },
  // Decorations shop
  frankie: {
    body: "Dark Brown Farmer Potion",
    background: "Farm Background",
    hair: "Ash Ponytail",
    shirt: "Club Polo",
    pants: "Brown Suspenders",
    shoes: "Black Farmer Boots",
    tool: "Hammer",
  },
  // Chunky Bumpin
  gordy: {
    body: "Dark Brown Farmer Potion",
    background: "Farm Background",
    hair: "Explorer Hair",
    shirt: "SFL T-Shirt",
    pants: "Farmer Overalls",
    shoes: "Black Farmer Boots",
    tool: "Parsnip",
  },
  // Blacksmith
  igor: {
    body: "Light Brown Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Lumberjack Overalls",
    shirt: "Blue Farmer Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  raven: {
    body: "Pale Potion",
    hair: "Goth Hair",
    dress: "Gothic Twilight",
    tool: "Dawn Lamp",
    background: "Farm Background",
    shoes: "Brown Boots",
    wings: "Bat Wings",
    hat: "Victorian Hat",
  },
  // Clothes shop stylist
  stella: {
    body: "Beige Farmer Potion",
    hair: "White Long Hair",
    hat: "Boater Hat",
    pants: "Farmer Overalls",
    shirt: "Daisy Tee",
    background: "Farm Background",
    shoes: "Brown Boots",
    tool: "Farmer Pitchfork",
  },
  // Sunflorian Prince
  tywin: {
    body: "Beige Farmer Potion",
    hair: "Buzz Cut",
    pants: "Fancy Pants",
    shirt: "Fancy Top",
    tool: "Sword",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  "old salty": {
    body: "Beige Farmer Potion",
    hair: "Buzz Cut",
    pants: "Pirate Pants",
    hat: "Pirate Hat",
    shirt: "Striped Blue Shirt",
    coat: "Pirate General Coat",
    tool: "Pirate Scimitar",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  miranda: {
    body: "Beige Farmer Potion",
    hair: "Ash Ponytail",
    shirt: "Fruit Picker Shirt",
    coat: "Fruit Picker Apron",
    tool: "Farmer Pitchfork",
    background: "Seashore Background",
    shoes: "Brown Boots",
    hat: "Fruit Bowl",
  },
  cornwell: {
    body: "Beige Farmer Potion",
    hair: "Wise Hair",
    beard: "Wise Beard",
    pants: "Wise Slacks",
    shirt: "Wise Robes",
    tool: "Wise Staff",
    secondaryTool: "Wise Book",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  luna: {
    body: "Light Brown Farmer Potion",
    hair: "White Long Hair",
    hat: "Luna's Hat",
    dress: "Witching Wardrobe",
    tool: "Witch's Broom",
    background: "Cemetery Background",
    shoes: "Brown Boots",
  },
  billy: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Overalls",
    tool: "Farmer Pitchfork",
    background: "Cemetery Background",
    shoes: "Brown Boots",
    hat: "Chicken Hat",
  },
  "phantom face": {
    body: "Dark Brown Farmer Potion",
    hair: "Buzz Cut",
    hat: "Crumple Crown",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    suit: "Imp Costume",
    tool: "Farmer Pitchfork",
    shoes: "Black Farmer Boots",
    background: "Cemetery Background",
  },
  "farmer flesh": {
    body: "Infected Potion",
    hair: "Sun Spots",
    hat: "Pumpkin Hat",
    pants: "Farmer Overalls",
    shirt: "Pumpkin Shirt",
    tool: "Farmer Pitchfork",
    shoes: "Black Farmer Boots",
    background: "Cemetery Background",
  },
  "boneyard betty": {
    body: "Infected Potion",
    hair: "Rancher Hair",
    pants: "Farmer Overalls",
    shirt: "Skull Shirt",
    tool: "Parsnip",
    shoes: "Black Farmer Boots",
    background: "Cemetery Background",
  },
  eins: {
    body: "Beige Farmer Potion",
    hair: "Explorer Hair",
    pants: "Farmer Overalls",
    shirt: "SFL T-Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  garth: {
    body: "Infernal Goblin Potion",
    hair: "Silver Streaks",
    pants: "Brown Suspenders",
    shirt: "Trial Tee",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  shelly: {
    body: "Beige Farmer Potion",
    hair: "White Long Hair",
    hat: "Lifeguard Hat",
    shirt: "Lifeguard Shirt",
    pants: "Lifeguard Pants",
    tool: "Water Gun",
    background: "Seashore Background",
    shoes: "Black Farmer Boots",
  },
  // Placeholder fisherman
  finn: {
    body: "Light Brown Farmer Potion",
    shirt: "Fish Pro Vest",
    hair: "Buzz Cut",
    background: "Seashore Background",
    pants: "Angler Waders",
    shoes: "Wellies",
    tool: "Sunflower Rod",
    hat: "Fishing Hat",
  },
  finley: {
    body: "Light Brown Farmer Potion",
    shirt: "Reel Fishing Vest",
    hair: "White Long Hair",
    background: "Seashore Background",
    pants: "Angler Waders",
    shoes: "Wellies",
    tool: "Sunflower Rod",
    hat: "Squid Hat",
  },
  tango: {
    body: "Squirrel Monkey Potion",
    hair: "Buzz Cut",
    background: "Seashore Background",
    shoes: "Black Farmer Boots",
    tool: "Pirate Scimitar",
  },
  corale: {
    body: "Mermaid Potion",
    hair: "Red Long Hair",
    background: "Seashore Background",
    shoes: "Black Farmer Boots",
    tool: "Trident",
  },
  goldtooth: {
    body: "Goblin Potion",
    hair: "Sun Spots",
    hat: "Pirate Hat",
    shirt: "Pirate Leather Polo",
    coat: "Pirate General Coat",
    pants: "Pirate Pants",
    shoes: "Peg Leg",
    background: "Seashore Background",
    tool: "Pirate Scimitar",
  },
  daphne: {
    body: "Light Brown Farmer Potion",
    shirt: "Pirate Leather Polo",
    hair: "Ash Ponytail",
    tool: "Mushroom Lamp",
    pants: "Pirate Pants",
    background: "Seashore Background",
    shoes: "Brown Boots",
  },
  damien: {
    body: "Light Brown Farmer Potion",
    shirt: "Pumpkin Shirt",
    hat: "Skull Hat",
    hair: "Sun Spots",
    tool: "Mushroom Lamp",
    pants: "Pirate Pants",
    background: "Seashore Background",
    shoes: "Brown Boots",
  },
  mayor: {
    body: "Light Brown Farmer Potion",
    shirt: "Pirate Leather Polo",
    hat: "Feather Hat",
    hair: "Sun Spots",
    tool: "Merch Coffee Mug",
    pants: "Farmer Pants",
    background: "Seashore Background",
    shoes: "Brown Boots",
  },
  wobble: {
    body: "Light Brown Farmer Potion",
    shirt: "Red Farmer Shirt",
    hat: "Companion Cap",
    hair: "Buzz Cut",
    tool: "Auction Megaphone",
    pants: "Farmer Overalls",
    background: "Seashore Background",
    shoes: "Brown Boots",
  },
  santa: {
    body: "Beige Farmer Potion",
    hair: "Sun Spots",
    hat: "Santa Hat",
    beard: "Santa Beard",
    suit: "Santa Suit",
    background: "Christmas Background",
    shoes: "Black Farmer Boots",
    tool: "Candy Cane",
  },
  elf: {
    body: "Light Brown Farmer Potion",
    hair: "Sun Spots",
    hat: "Elf Hat",
    suit: "Elf Suit",
    background: "Christmas Background",
    shoes: "Black Farmer Boots",
    tool: "Candy Cane",
  },
  misty: {
    body: "Beige Farmer Potion",
    hair: "Brown Rancher Hair",
    background: "Seashore Background",
    shoes: "Black Farmer Boots",
    tool: "Sunflower Rod",
    pants: "Fishing Pants",
    shirt: "Reel Fishing Vest",
  },
  // Flower expert
  poppy: {
    body: "Beige Farmer Potion",
    dress: "Antique Dress",
    background: "Mountain View Background",
    hair: "Brown Long Hair",
    tool: "Farmer Pitchfork",
    shoes: "Brown Boots",
  },
  // Beekeeper
  stevie: {
    body: "Light Brown Farmer Potion",
    hair: "Parlour Hair",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Overalls",
    tool: "Bee Smoker",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    suit: "Beekeeper Suit",
    hat: "Beekeeper Hat",
  },
  "Chun Long": {
    body: "Light Brown Farmer Potion",
    hair: "Explorer Hair",
    hat: "Lucky Red Hat",
    shirt: "Red Farmer Shirt",
    suit: "Lucky Red Suit",
    background: "China Town Background",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
  },
  // Faction Spruikers
  "lady day": {
    body: "Beige Farmer Potion",
    hair: "Brown Long Hair",
    shirt: "Maiden Top",
    pants: "Farmer Pants",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    hat: "Flower Crown",
    dress: "Orange Monarch Dress",
  },
  robert: {
    body: "Light Brown Farmer Potion",
    hair: "Explorer Hair",
    shirt: "Striped Red Shirt",
    pants: "Blue Suspenders",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  grommy: {
    body: "Goblin Potion",
    hair: "Sun Spots",
    shirt: "Crimstone Armor",
    pants: "Crimstone Pants",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  maximus: {
    // Placeholder values. Using the gif of maximus
    body: "Beige Farmer Potion",
    hair: "Explorer Hair",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Overalls",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  barlow: {
    body: "Beige Farmer Potion",
    hair: "Explorer Hair",
    hat: "Bumpkin Helmet",
    shirt: "Bumpkin Armor",
    pants: "Bumpkin Pants",
    tool: "Bumpkin Sword",
    background: "Farm Background",
    shoes: "Bumpkin Sabatons",
  },
  graxle: {
    body: "Goblin Potion",
    hair: "Fire Hair",
    hat: "Goblin Helmet",
    shirt: "Goblin Armor",
    pants: "Goblin Pants",
    tool: "Goblin Axe",
    background: "Farm Background",
    shoes: "Goblin Sabatons",
  },
  nyx: {
    body: "Pale Potion",
    hair: "Goth Hair",
    hat: "Nightshade Helmet",
    shirt: "Nightshade Armor",
    pants: "Nightshade Pants",
    tool: "Nightshade Sword",
    background: "Farm Background",
    shoes: "Nightshade Sabatons",
  },
  reginald: {
    body: "Sunburst Potion",
    hair: "Blondie",
    hat: "Sunflorian Helmet",
    shirt: "Sunflorian Armor",
    pants: "Sunflorian Pants",
    tool: "Sunflorian Sword",
    background: "Farm Background",
    shoes: "Sunflorian Sabatons",
  },
  glinteye: {
    body: "Goblin Potion",
    hair: "Greyed Glory",
    shirt: "Fancy Top",
    pants: "Fancy Pants",
    beard: "Wise Beard",
    tool: "Auction Megaphone",
    shoes: "Black Farmer Boots",
    background: "Farm Background",
  },
  solara: {
    body: "Sunburst Potion",
    hair: "Blondie",
    shirt: "Fancy Top",
    pants: "Sunflorian Pants",
    tool: "Sunflorian Sword",
    background: "Farm Background",
    shoes: "Sunflorian Sabatons",
  },
  dusk: {
    body: "Pale Potion",
    hair: "Red Long Hair",
    shirt: "Olive Royalty Shirt",
    pants: "Nightshade Pants",
    tool: "Nightshade Sword",
    background: "Farm Background",
    shoes: "Nightshade Sabatons",
  },
  haymitch: {
    body: "Beige Farmer Potion",
    hair: "Explorer Hair",
    shirt: "Orange Monarch Shirt",
    pants: "Bumpkin Pants",
    tool: "Bumpkin Sword",
    background: "Farm Background",
    shoes: "Bumpkin Sabatons",
  },
  grizzle: {
    body: "Goblin Potion",
    hat: "Warrior Helmet",
    hair: "Brown Long Hair",
    shirt: "Fancy Top",
    pants: "Fancy Pants",
    beard: "Santa Beard",
    tool: "Auction Megaphone",
    shoes: "Black Farmer Boots",
    background: "Farm Background",
  },
  buttercup: {
    body: "Beige Farmer Potion",
    hair: "Brown Long Hair",
    shirt: "Daisy Tee",
    pants: "Bumpkin Pants",
    tool: "Dawn Lamp",
    background: "Farm Background",
    shoes: "Bumpkin Sabatons",
  },
  shadow: {
    body: "Pale Potion",
    hair: "White Long Hair",
    shirt: "Mushroom Sweater",
    pants: "Nightshade Pants",
    tool: "Beehive Staff",
    background: "Farm Background",
    shoes: "Nightshade Sabatons",
  },
  flora: {
    body: "Sunburst Potion",
    hair: "Luscious Hair",
    shirt: "Wise Robes",
    pants: "Sunflorian Pants",
    tool: "Mushroom Lamp",
    background: "Farm Background",
    shoes: "Sunflorian Sabatons",
  },
  eldric: {
    background: "Farm Background",
    body: "Dark Brown Farmer Potion",
    beard: "Wise Beard",
    hair: "Buzz Cut",
    shirt: "Nightshade Armor",
    hat: "Knight Gambit",
    pants: "Bumpkin Pants",
    shoes: "Sunflorian Sabatons",
    tool: "Goblin Axe",
    coat: "Royal Robe",
  },
};

type AcknowledgedNPCs = Partial<Record<NPCName, number>>;
export function acknowledgedNPCs(): AcknowledgedNPCs {
  const item = localStorage.getItem("acknowledgedNPCs");

  if (!item) {
    return {};
  }

  return JSON.parse(item as any) as AcknowledgedNPCs;
}

export function acknowledgeNPC(npcName: NPCName) {
  const previous = acknowledgedNPCs();

  localStorage.setItem(
    "acknowledgedNPCs",
    JSON.stringify({
      ...previous,
      [npcName]: Date.now().toString(),
    })
  );
}

export function isNPCAcknowledged(npcName: NPCName) {
  const acknowledged = acknowledgedNPCs();

  return acknowledged[npcName] != null;
}
