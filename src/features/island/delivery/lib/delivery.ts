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

const BLACKSMITH_MESSAGES = [
  "I need some supplies for my latest invention, got any materials?",
  "I'm looking to stock up on some raw resources, got any to sell?",
  "I need some crafting materials, got anything I can use?",
  "Do you have any rare or unique resources that I could use?",
  "I'm interested in acquiring some high-quality materials, what do you have?",
  "I'm looking for some materials for my next project, got anything to offer?",
  "I'm in the market for some raw materials, got any to sell?",
  "I need some supplies for my crafting, can you help me out?",
  "Do you have any materials that you're willing to part with?",
  "I'm interested in acquiring some unique resources, got anything out of the ordinary?",
];

const BETTY_MESSAGES = [
  "Oh boy, I can't wait to get my hands on some fresh produce!",
  "I'm so excited to try out some new crops, what have you got for me?",
  "I've been waiting all day for a chance to harvest some delicious fruits!",
  "I'm eager to see what kind of crops are ready for harvesting today.",
  "I can't wait to taste the fruits of my labor, what kind of produce do you have?",
  "I've got a real passion for farming, and I'm always looking for new and interesting crops to grow.",
  "There's nothing like the feeling of harvesting a bumper crop, it's what farming is all about!",
  "I'm really invested in the quality of my produce, and I'm always looking for ways to improve it.",
  "I love the challenge of growing crops, and I'm always up for trying something new!",
  "I take pride in my farming skills, and I'm always striving to grow the best produce possible.",
];
export function generateDeliveryMessage({ from, id }: DeliveryMessage) {
  // Calculate a consistent number between 1 & 10 based on the ID
  const index = parseInt(id.slice(-2), 16) % 10;

  if (from === "betty") {
    return BETTY_MESSAGES[index];
  }

  if (from === "blacksmith") {
    return BLACKSMITH_MESSAGES[index];
  }

  return GOBLIN_MESSAGES[index];
}
