import { Delivery } from "features/game/types/game";
import { NPCName } from "lib/npcs";

export type DeliveryMessage = { from: NPCName; id: string };

const GOBLIN_MESSAGES = [
  "Hey you! Human! Bring me some food or else...",
  "I'm always hungry, got any tasty treats for me?",
  "I don't care what it is, just give me food!",
  "If you don't give me something to eat, I might have to start nibbling on you.",
  "I heard human food is the best, bring me some!",
  "Hey, you got any food that won't make me sick?",
  "I'm getting a bit bored of eating the same thing, got anything different?",
  "I'm hungry for something new, got anything exotic?",
  "Hey there, got any snacks to spare? I promise I won't steal them...maybe.",
  "I don't care what it is, just give me food!",
];

const NPC_MESSAGES: Partial<Record<NPCName, string[]>> = {
  betty: [
    "Oh boy, I can't wait to get my hands on some fresh produce!",
    "I'm so excited to try out some new crops, what have you got for me?",
    "I've been waiting all day for a chance to harvest some delicious fruits!",
    "I'm eager to see what kind of crops are ready for harvesting today.",
    "I can't wait to taste the fruits of my labor, what kind of produce do you have?",
    "I've got a real passion for farming, and I'm always looking for new and interesting crops to grow.",
    "There's nothing like the feeling of harvesting a bumper crop, it's what farming is all about!",
  ],
  blacksmith: [
    "I need some supplies for my latest invention, got any materials?",
    "I'm looking to stock up on some raw resources, got any to sell?",
    "I need some crafting materials, got anything I can use?",
    "Do you have any rare or unique resources that I could use?",
    "I'm interested in acquiring some high-quality materials, what do you have?",
    "I'm looking for some materials for my next project, got anything to offer?",
    "I'm in the market for some raw materials, got any to sell?",
  ],
  grubnuk: GOBLIN_MESSAGES,
  grimbly: GOBLIN_MESSAGES,
  grimtooth: GOBLIN_MESSAGES,
  "pumpkin' pete": [
    "Hey there, newbie! How 'bout some fresh produce?",
    "Tasty crops, anyone? I'm your guy for easy pickings!",
    "Fresh and delightful, that's my motto. What do you have?",
    "Newcomer in town? Let's brighten up your day with some crops!",
    "Need a hand, friend? I've got a variety of crops for you!",
    "Energetic Pete, at your service! Crops, anyone?",
    "Welcome to the plaza! Let's make your day brighter with crops!",
  ],
  cornwell: [
    "Ah, the good old days... Hard work's my motto. What've you got?",
    "These youngsters, no work ethic! Bring me the challenging stuff.",
    "I remember when... Hard work, that's what's missing!",
    "Hard-earned knowledge deserves the finest harvest. Impress me!",
    "History and hard work, that's what we're all about. What's your pick?",
    "Cornwell's the name, and I'm here for the real farm experience.",
    "Hard tasks, rich rewards. Show me what you've got!",
  ],
  raven: [
    "Darkness and mystery, that's my game. I'll take the tough crops.",
    "Goth at heart, I need the darkest crops for my potions.",
    "Supernatural and sinister, that's the vibe I'm after. Impress me.",
    "I crave the shadowy harvest for my spellwork. Hand 'em over.",
    "Bring me the crops that hide in the shadows. I won't be disappointed.",
    "Raven, the keeper of darkness, wants your most challenging crops.",
    "Dark delights for a goth heart. Show me your darkest harvest.",
  ],
  bert: [
    "Man, these shrooms... they're the key. Got any magic ones?",
    "Mushroom madness, that's me. Magic mushrooms, anyone?",
    "It's all about the shrooms, baby. Hand over the enchanted ones.",
    "I see things, you know? Magic mushrooms, that's what I need.",
    "Life's a trip, man, and I need those magic mushrooms to ride it!",
    "Bert's the name, shrooms are the game. Enchanted ones, please!",
    "Magic mushrooms, my friend. That's what keeps me going.",
  ],
  timmy: [
    "Roar! I'm Timmy the bear! Gimme all the fruity goodness!",
    "I'm a bear, and bears love fruit! Got any fruity treats for me?",
    "Fruity delights, that's the secret. It's a Timmy thing, you know?",
    "Bear hugs for fruits! It's a Timmy thing, you know?",
    "In a bear suit, life's a treat. Fruits are my jam, got any?",
    "Timmy the bear's here for fruity fun! Hand over those fruits!",
    "Fruitful conversations with a bear! Share the fruity love!",
  ],
  tywin: [
    "Gold, gold, and more gold! Show me the riches, peasants!",
    "I watch over Bumpkins to ensure they pay their dues. Gold, now!",
    "Peasants, bring me your riches! I am Tywin, the demanding prince!",
    "Pumpkin Plaza is beneath me, but gold is never enough. More!",
    "It's a prince's life, and I demand your wealth. Pay your taxes!",
    "A prince's wealth knows no bounds. Gold, gold, and more gold!",
    "Gold is my crown, and I want it all! Bring me your riches!",
  ],
  tango: [
    "Chatter, chomp, and chatter again! Fruits, fruits, and more fruits!",
    "I'm Tango, the fruity squirrel monkey! Bring me fruity treasures!",
    "Orange, cheeky, and playful, that's me. Fruits, anyone?",
    "Fruit secrets? I've got 'em! Share the fruity wonders with me!",
    "Fruitful mischief and fruity delights. Let's have some fun!",
    "Tango's the name, fruity games are my claim to fame. Gimme!",
    "Fruit knowledge runs in my family. Tell me your fruitiest tales!",
  ],
  miranda: [
    "Dance with me, friend! Add to my fruit-tastic hat, won't you?",
    "Samba and fruits, they go hand in hand. What can you offer?",
    "In the rhythm of samba, fruits are a must. Care to share?",
    "It's all about the samba beat and fruity treats. Bring some over!",
    "Join the samba celebration with a fruit gift for my hat!",
    "Miranda's hat loves fruity flair. What can you contribute?",
    "Samba, fruits, and friendship. Let's make it a party!",
  ],
  finn: [
    "I've reeled in the biggest catch ever! Fish, anyone?",
    "Life's a fisherman's tale, and I've got stories to tell. Reeled in some fish!",
    "Finn the fisherman, the legend, and the fish whisperer. Reeled in some fish?",
    "Big fish, big stories, and a big ego. Bring me your fishy treasures!",
    "Hook, line, and swagger, that's me. Fish, it's what I do!",
    "Fish tales, bragging rights, and a hint of modesty. Fish, please!",
    "Caught the biggest fish ever. It's not just a story; it's reality!",
  ],
  finley: [
    "Not letting Finn have all the glory! I need bait and chum for my big catch!",
    "Finn's not the only one who can fish. I need bait and chum, stat!",
    "I'll show Finn who's the real angler! Bait and chum, I must have them!",
    "Fishy rivalry runs in the family. I'm out to prove a point. Bait and chum, please!",
    "Finn's not the only one with fishing skills. I'm going for the catch of a lifetime!",
    "Competing with Finn is a must. Bait and chum, I need your help!",
    "Siblings in a fishing showdown. Bait and chum are my secret weapons!",
  ],
  corale: [
    "The ocean calls, and I need fish. Help me set my friends free!",
    "Fish are my friends, and I must set them free. Will you assist me?",
    "For the love of the sea, bring me fish. I'll release them to their home.",
    "Beneath the waves, my friends await. Fish, so they can swim free!",
    "A mermaid's plea to protect her friends. Bring me fish, kind soul.",
    "Fishes' freedom, that's my mission. Help me with fish, won't you?",
    "Join me in the sea's dance of life. Fish, to set my friends free!",
  ],
  shelly: [
    "Bumpkins are vanishing, and I fear the Kraken is the cause. Help me collect its tentacles!",
    "Bumpkins are disappearing, and I suspect the Kraken. Can you fetch its tentacles, please?",
    "Kraken's a threat, Bumpkins missing. Bring its tentacles to keep them safe.",
    "Kraken's ominous, Bumpkins gone. Bring its tentacles for their safety.",
    "Guarding the beach is tough with the Kraken. Help me protect Bumpkins, get its tentacles.",
    "Protecting Bumpkins is my duty, but the Kraken worries me. Get its tentacles to safeguard them.",
    "Kraken's causing panic, Bumpkins missing. Help me gather its tentacles for their safety.",
    "Bumpkins' safety's my top priority, and I'm afraid the Kraken's involved. Tentacles can make a difference!",
  ],
};

export function generateDeliveryMessage({ from, id }: DeliveryMessage) {
  // Default to the Goblin food messages if no matches
  const messages = NPC_MESSAGES[from] ?? GOBLIN_MESSAGES;

  // Calculate a consistent number between 1 & 10 based on the ID
  const index = parseInt(id.slice(-2), 16) % messages.length;

  return messages[index];
}

export function hasNewOrders(delivery: Delivery) {
  const acknowledged = localStorage.getItem(`orders.read`);

  const orders: string[] = acknowledged ? JSON.parse(acknowledged) : [];

  const currentIds = delivery.orders
    .filter((o) => o.readyAt <= Date.now())
    .map((o) => o.id);

  return currentIds.some((id) => !orders.includes(id));
}

export function acknowledgeOrders(delivery: Delivery) {
  const ids = delivery.orders
    .filter((o) => o.readyAt <= Date.now())
    .map((o) => o.id);

  localStorage.setItem(`orders.read`, JSON.stringify(ids));
}

export const DELIVERY_LEVELS: Partial<Record<NPCName, number>> = {
  grimbly: 3,
  betty: 3,
  grimtooth: 3,
  "pumpkin' pete": 3,
  grubnuk: 5,
  blacksmith: 5,
  bert: 5,
  finley: 6,
  raven: 7,
  miranda: 7,
  corale: 7,
  finn: 7,
  timmy: 9,
  tango: 9,
  cornwell: 9,
  tywin: 14,
};
