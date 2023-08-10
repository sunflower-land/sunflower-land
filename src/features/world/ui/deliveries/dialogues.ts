import { NPCName } from "lib/npcs";

interface DeliveryNPCDialogue {
  intro: string[];
  positiveDelivery: string[];
  negativeDelivery: string[];
  noOrder: string[];
}

export const npcDialogues: Partial<Record<NPCName, DeliveryNPCDialogue>> = {
  blacksmith: {
    intro: [
      "What do you want? Speak quickly; time is money.",
      "What brings you to my workshop? I'm busy, so make it quick.",
      "Welcome to my humble abode. What brings you here?",
      "State your purpose. I'm busy, and I don't have time for idle chatter. What brings you to my workshop?",
    ],
    positiveDelivery: [
      "Finally! You brought the materials I need. Step aside; let me work my magic.",
      "Ah, about time! You've acquired the exact items I sought. Prepare for equipment crafted with precision.",
      "Good. You've delivered the materials I need. I shall not disappoint; my creations will be remarkable.",
      "Impressive! You've acquired the necessary components. I will transform them into farming marvels!",
      "Hmm, you actually managed to find what I wanted. Well done.",
    ],
    negativeDelivery: [
      "You don't have what I require? Time is wasted. Come back when you have what's necessary.",
      "No, no, no. You lack the essential materials. Don't waste my time. Return when you're prepared.",
      "Unacceptable. You don't possess what I require. I have no time for incompetence. Return when you're capable.",
      "Unsatisfactory. You don't possess what I need. Come back when you're ready to fulfill your end of the bargain.",
      "Incompetence. You lack the materials required. Don't waste my time; return when you're prepared.",
    ],
    noOrder: [
      "No active order for me to fulfill at the moment, but if you're in need of tools or have materials for crafting, I am always is here to assist you. Speak up, and we'll get to work.",
      "No active order from me, but if you require sturdy equipment or have materials in need of shaping, I am your craftsman.",
    ],
  },
  betty: {
    intro: [
      "Hey there, sunshine! It's been a busy day at the market. I'm here to see if you've got the ingredients I ordered. Do you have them with you?",
      "Hello, hello! I've been waiting to see if you've got the ingredients I ordered. Have you brought them?",
      "Welcome to Betty's market! Ready to check if you've got the ingredients I need? Let's see what you've got in store for me!",
      "Hey, hey! I'm eager to know if you've brought the ingredients I ordered. Show me what you've got!",
      "Greetings, my green-thumbed friend! I'm excited to see if you've got the ingredients I asked for. What's in your basket?",
    ],
    positiveDelivery: [
      "Hooray! You've brought the ingredients I ordered. They're as fresh and vibrant as can be. Thank you, my gardening genius!",
      "That's what I'm talking about! You've got the exact ingredients I needed. You've made my day with your prompt delivery. Thank you!",
      "Oh, fantastic! These are the exact ingredients I asked for. The market will be buzzing with excitement. Thanks for your hard work!",
      "Oh, my garden! These ingredients are absolutely perfect. You've got a talent for finding the finest produce. Thank you, my green-thumbed hero!",
      "Bravo! You've brought the exact ingredients I needed. I can't wait to use them to create something extraordinary. Thanks for your swift delivery!",
    ],
    negativeDelivery: [
      "Oopsie-daisy! It seems you don't have the ingredients I ordered. No worries, though. Keep searching, and we'll find another opportunity.",
      "Oh, no! It looks like you don't have the ingredients I need at the moment. Don't worry, though. I believe in your resourcefulness. Come back when you have what I'm after!",
      "Aw, shucks! It seems you don't have the ingredients I'm looking for right now. Keep foraging, though! Maybe next time we'll have better luck.",
      "Oh, bummer! It seems the ingredients you brought don't match what I need. But don't lose heart; keep working, and return soon.",
      "Oh, snapdragons! It seems you don't have the exact ingredients I'm searching for. But don't worry, my friend. Keep working hard, and we'll celebrate when you find them!",
    ],
    noOrder: [
      "No active order for me to fulfill right now, but that won't stop me from offering you the finest seeds and crops. Step right up and let's see what you're in the market for!",
      "No specific order from me today, but that's not a problem. I'm here with a bounce in my step, ready to provide you with the best seeds and buy your delightful crops!",
    ],
  },
  grimbly: {
    intro: [
      "Hungry. Need food. Have anything tasty for a hungry goblin?",
      "Hungry goblin needs sustenance. Have what I need?",
      "Starving goblin here. Got anything scrumptious for me to munch on?",
      "Grimbly's hungry. Did you bring something tasty for me?",
    ],
    positiveDelivery: [
      "Ah, finally! Something delicious to satisfy my hunger. You're a lifesaver, my friend!",
      "You've brought food! Grimbly's hunger is appeased. Thank you, thank you!",
      "Hooray! You've brought me food to fill my hungry belly. Grimbly appreciates your generosity!",
      "A feast for Grimbly! You've brought me exactly what I needed. Your kindness won't be forgotten!",
    ],
    negativeDelivery: [
      "No food? Grimbly still hungry. Find food, bring food. Grimbly grateful.",
      "No food for Grimbly? Grimbly's tummy growls. Come back when you find something tasty.",
      "Grimbly still hungry. No food? Keep searching, and maybe next time you'll satisfy my goblin appetite.",
      "Empty-handed? Grimbly's stomach rumbles. Keep searching, and don't forget about a goblin's hunger!",
    ],
    noOrder: [
      "Grimbly doesn't have an active order for you, but that doesn't mean I'm not hungry!",
      "No active order from Grimbly today, but fear not! I'm always on the lookout for tasty treats. If you find anything delicious, you know who to bring it to!",
    ],
  },
  grimtooth: {
    intro: [
      "Greetings, weary traveler. Looking for me, are you?",
      "Step into the realm of shadows. Have you fulfilled my order?",
      "Welcome, wanderer, to my mystical realm. Do you have what I need?",
      "Step inside, dear traveler, and uncover the secrets I've amassed. Did you find what I requested?",
    ],
    positiveDelivery: [
      "Incredible! You've found the ingredients I require. The magic of Sunflorea is at your fingertips!",
      "Marvelous! You've acquired what I sought. Together, we shall delve into the deepest depths of magic!",
      "Incredible! You've gathered the mystical components I required. Your journey in the realm of magic begins!",
      "Ah, splendid! You've obtained the elusive ingredients I sought. Your journey in the realm of magic begins!",
    ],
    negativeDelivery: [
      "Alas, the required ingredients elude you. Fear not, though. Keep searching, and the mysteries shall reveal themselves!",
      "Oh, darkness and dismay. You don't possess what I need. But fret not; keep working and the shadows will continue to guide you.",
      "Fear not, though. Continue your work, and the magic shall manifest.",
      "Oh, alas. You don't possess what I need. Return when you do.",
    ],
    noOrder: [
      "No active order from GrimTooth at the moment, but don't worry. If you're in need of exquisite craftsmanship or have materials for me to work with, I'll be here, ready to create.",
      "No active order for you to fulfill with GrimTooth, but should you require the master craftsman's touch or have materials that need transforming, I'm at your service.",
    ],
  },
  // Food
  "old salty": {
    intro: [
      "Arghhhh, welcome, me heartie! Old Salty's the name, and treasure's me game. Do ye have what I seek?",
      "Ahoy, landlubber! Old Salty's the treasure enthusiast ye be lookin' for. Show me what ye've found on yer quest?",
      "",
    ],
    positiveDelivery: [
      "Arghhhh, ye've found the treasure I be seekin'. Ye've got the heart of a true adventurer, me matey!",
      "Avast! Ye've brought the very treasure Old Salty desires. Ye be earnin' me respect, me hearty!",
      "Ahoy, ye've found the treasure Old Salty's been huntin'. Ye be a true legend in these waters, me hearty!",
    ],
    negativeDelivery: [
      "Arrrr, no treasure for Old Salty? Keep yer eyes peeled, me heartie. The hidden gems await yer discovery!",
      "Ah, scallywag! No treasure for Old Salty? Keep searchin', and ye'll find the riches ye seek!",
      "Shiver me timbers! No treasure for Old Salty? Keep sailin', me matey. The loot be out there, waitin' fer ye!",
    ],
    noOrder: [
      "No active order for Old Salty's treasure cove, me heartie, but that doesn't mean there's no adventure to be had. Keep your eyes peeled for hidden treasures and uncharted waters!",
      "No specific treasure for you to seek with Old Salty at the moment, but don't fret, my hearty sailor! The high seas hold countless riches waiting to be discovered.",
    ],
  },
  raven: {
    intro: [
      "Welcome to my humble abode. Careful where you step; there are potions brewing. Did you get what I ordered?",
      "Step into the realm of shadows. Seek wisdom, find enchantment. Do you have what I need?",
      "Welcome, wanderer, to my mystical realm. Seeking something magical, are you? Or do you have what I need?",
      "Step inside, dear traveler. The shadows will guide you. Did you find what I seek?",
    ],
    positiveDelivery: [
      "Incredible! You've found the ingredients I require. The magic of Sunflorea is at your fingertips!",
      "Marvelous! You've acquired what I sought. Together, we shall delve into the deepest depths of magic!",
      "Incredible! You've gathered the mystical components I required. Your journey in the realm of magic begins!",
      "Ah, splendid! You've obtained the elusive ingredients I sought. Your journey in the realm of magic begins!",
    ],
    negativeDelivery: [
      "Alas, the required ingredients elude you. Fear not, though. Keep searching, and the mysteries shall reveal themselves!",
      "Oh, darkness and dismay. You don't possess what I need. But fret not; the shadows will guide you to it.",
      "Fear not, though. Continue your quest, and the magic shall manifest.",
    ],
    noOrder: [
      "It seems there's no active order awaiting your arrival in my dark domain. However, should you seek guidance or have questions about the mystical arts, don't hesitate to ask.",
      "No active order from me, traveler. But fret not! The shadows are ever-watchful, and when the time is right, we'll delve into the depths of magic together.",
    ],
  },
  tywin: {
    intro: [
      "Ah, another commoner gracing my presence. Do you have what I want? Speak quickly.",
      "Oh, great, another one from the peasantry. What's your business with someone of my stature? Do you have what I need?",
      "Greetings, commoner. Seeking wisdom, are you? Do you have everything I asked for?",
      "What do you want? Speak quickly; time is money. You have what I need, I assume?",
    ],
    positiveDelivery: [
      "Hmm, it seems you're not entirely useless. You've managed to bring what I wanted. Carry on, peasant!",
      "Surprisingly, you've actually delivered what I desired. Perhaps you're not as useless as I presumed.",
      "Ah, marvelous work! You've brought the materials I require. Together, we shall create masterpieces!",
      "Good. You've delivered the materials I need. Igor shall not disappoint; the tools will be remarkable.",
    ],
    negativeDelivery: [
      "Pathetic. You don't have what I asked for. Don't waste my time with your incompetence. Leave!",
      "What a disappointment. You don't have what I requested. Typical of your kind. Now begone!",
      "Unsatisfactory. You don't possess what I require. I have no time for incompetence. Return when you're capable.",
      "Incompetence. You lack the materials required. Don't waste my time; return when you're prepared.",
    ],
    noOrder: [
      "Ah, it appears I don't have an active order for you, commoner. But if you require my esteemed presence or have a request, state it quickly. Time is money, after all.",
      "No active order for you today, peasant. However, should you stumble upon something worthy of my attention or require my expertise, you know where to find me.",
    ],
  },
  bert: {
    intro: [
      "Psst! Explorer of the arcane! Sunflorea's secrets aren't just beneath the ground. Some hang in wardrobes, some lie hidden in bags! Are you here with my Delivery or is it a Discovery you seek to unveil?",
      "Ah, kindred spirit! The real treasures of Sunflorea sometimes hang around our necks or sit snugly in our pockets. Deliveries aid my quest, but Discoveries... oh, they tantalize my soul! Which journey beckons you today?",
      "Greetings, bearer of the mysterious! In Sunflorea, items aren't just items. They're whispers of tales long forgotten. Is it a Delivery you bring, or do you tread the path of Discovery?",
      "Hello, seeker of the concealed! In the heart of Sunflorea, hidden treasures await in the most unassuming places. Are you here with a Delivery, or shall we dive into the thrilling world of Discoveries?",
    ],
    positiveDelivery: [
      "Incredible! You've brought me everything I need. I am on the cusp of revealing secrets that'll blow your mind!",
      "Oh, fascinating find! You have brought me the exact items I sought!",
      "Ah, about time! You've acquired the exact items I sought. Excellent!",
      "Impressive! You've brought me exactly what I need to uncover the secrets of Sunflorea.",
    ],
    negativeDelivery: [
      "Oh, alas. You don't possess what I seek. Keep exploring, I will see you when you have what I need!",
      "Drat! What you have isn't quite what I need. Keep working on my order, and together, we'll unravel the mysteries!",
      "Hmm, not quite what I expected. But fear not! There is still time to get me what I need.",
      "Oh, not quite what I sought. Return when you have it. But keep your eyes open; the pages of history have more to reveal.",
    ],
    noOrder: [
      "No active order for me to fulfill today, but that doesn't mean I don't have any intriguing secrets to share.",
      "No enigmatic artifact for you to discover with Bert at the moment, but that doesn't mean I'm short on peculiar facts and hidden truths.",
    ],
  },
  timmy: {
    intro: [
      "Hey there, friend! It's Timmy, and I'm eager to see if you have what I asked for.",
      "Greetings, fellow adventurer! Timmy here, wondering if you've found what I requested.",
      "Welcome, welcome! I'm Timmy, the friendliest face in the plaza. Can you help me out by checking if you have what I need?",
      "Hey, hey! Ready for some fun in the sun? It's Timmy, and I can't wait to see if you've got what I asked for.",
      "Hello, sunshine! Timmy's here, hoping you have what I requested. Let's see?",
    ],
    positiveDelivery: [
      "Woohoo! You've got just what I needed. Your generosity fills my heart with joy. Thank you!",
      "That's what I'm talking about! You've brought exactly what I was looking for. You're a superstar!",
      "Oh, fantastic! Your timing couldn't be better. You've made my day with your thoughtful offering. Thank you!",
      "Hooray! You've delivered the goods. Sunflorea is lucky to have someone as amazing as you!",
      "You've done it again! Your kindness and generosity never cease to amaze me. Thank you for brightening up the plaza!",
    ],
    negativeDelivery: [
      "Oopsie-daisy! It seems you don't have what I'm searching for right now. No worries, though. Keep exploring, and we'll find another opportunity.",
      "Oh, no! It looks like you don't have what I need at the moment. Don't worry, though. I believe in you. Come back when you find it!",
      "Aw, shucks! You don't have what I'm looking for right now. Keep exploring, though! Maybe next time you'll stumble upon what I need.",
      "Oh, bummer! It seems you don't have the item I'm seeking. But don't give up; new opportunities await just around the corner.",
      "Oh, snapdragons! You don't have what I'm searching for. But don't worry, my friend. Keep exploring, and we'll celebrate when you find it!",
    ],
    noOrder: [
      "Oh, hi there! I don't have any active orders for you right now, but I'm always eager to learn and hear stories. Have any exciting tales of your adventures in Sunflorea? Or perhaps you've come across a new bear friend? Share it with me!",
      "No specific order for me to fulfill at the moment, but that won't stop me from being curious! Do you have any interesting stories about your travels? Maybe you've encountered a rare bear or discovered a hidden gem in Sunflorea? Let's chat!",
    ],
  },
  cornwell: {
    intro: [
      "Greetings, young adventurer! Have you come bearing the items I seek?",
      "Ah, welcome, seeker of knowledge and relics! Do you have the items I requested? Show me what you've got.",
      "Step into the realm of ancient secrets and wisdom. Have you acquired the items I desire? Share your discoveries with me, young one.",
      "Ah, it's you! The one on a noble quest. Have you found the items I seek? Come, show me what you've uncovered in Sunflower Land's vast lands.",
      "Greetings, young traveler! The winds of curiosity have brought you here. Do you have the items I require to enrich my collection?",
    ],
    positiveDelivery: [
      "Marvelous! You've brought the very relics I desired. Your efforts in preserving Sunflower Land's history will be remembered.",
      "Ah, splendid! Your findings align perfectly with the relics I sought. These treasures shall add great wisdom to my collection.",
      "Impressive! The items you've acquired are just what I was looking for. Sunflower Land's history will shine through them.",
      "Ah, young adventurer, you've surpassed my expectations! The items you've brought will be invaluable to my research.",
      "Ah, well done, my keen-eyed friend! The items you've delivered will find a place of honor in my windmill's collection.",
    ],
    negativeDelivery: [
      "Oh, it seems you haven't found the items I seek. Fear not; the journey of discovery continues. Keep exploring Sunflower Land's mysteries.",
      "Hmm, not quite the relics I was expecting. But do not despair! Keep searching, and the treasures of Sunflower Land will reveal themselves to you.",
      "Oh, it appears the items I desired elude you. No matter; your curiosity will lead you to the right discoveries eventually.",
      "Ah, I see you haven't found the specific items I need. Fret not; the history of Sunflower Land holds many secrets waiting to be unearthed.",
      "Oh, my dear traveler, it seems you didn't bring the exact items I sought. But your dedication to Sunflower Land's history is commendable.",
    ],
    noOrder: [
      "Ah, it appears there are no quest items for you to deliver at the moment. But do not be disheartened! Your journey in Sunflower Land is filled with untold adventures waiting to be discovered.",
      "Oh, it seems I have no need for your services at the moment. But don't fret; the pages of Sunflower Land's history turn endlessly, and new quests will surely present themselves.",
      "Ah, my apologies, but I have nothing for you to fulfill right now. Fear not, though; your path as a seeker of knowledge is bound to lead you to new quests in due time.",
      "Ah, it seems you haven't received any quest orders from me at the moment. But do not lose hope; your inquisitive nature will soon guide you to exciting new quests in Sunflower Land.",
    ],
  },
  "pumpkin' pete": {
    intro: [
      "I have been waiting for you, my friend! Do you have my order ready?",
      "Hey there, pumpkin! I have been busy guiding Bumpkins around the plaza? Did you get my order?",
      "Greetings, friend! The plaza is bursting with excitement today. Did you get manage to get my order?",
      "Hello there, fellow adventurer! What brings you to my humble abode? Did you get my order?",
      "Hey, hey! Welcome to the plaza? Did you manage to find what I needed?",
    ],
    positiveDelivery: [
      "Hooray! You've brought exactly what I need. You're a true hero of the plaza!",
      "Pumpkin-tastic! You've got just what I needed. You're making our little community brighter!",
      "Great seeds of joy! You've brought exactly what I need. The plaza is lucky to have you!",
      "Fantastic! You've arrived bearing exactly what I desired. Your kindness spreads sunshine in our plaza!",
      "Oh, pumpkin seeds of joy! You've brought me exactly what I needed. The plaza is grateful for your help!",
    ],
    negativeDelivery: [
      "Oh, no. It seems you don't have what I'm looking for. Don't worry, though. I believe in you. Come back when you find it!",
      "Aw, shucks! You don't have what I'm looking for right now. Keep exploring, though! Maybe next time.",
      "Oh, seeds of sorrow! You don't have what I'm searching for. But don't give up; new opportunities bloom every day!",
      "Oh, snapdragons! You don't have what I'm seeking right now. Keep exploring, though! I'm confident you'll find it.",
      "Oopsie-daisy! You don't have what I'm searching for. But don't worry, my friend. Keep exploring, and we'll celebrate when you find it.",
    ],
    noOrder: [
      "Ah, my friend, it seems I don't have an active order for you at the moment. But fear not! I'm always here to offer guidance and a friendly pumpkin smile.",
      "Oh, no active order for you today, my friend. But don't worry! Feel free to explore the plaza, and if you need any assistance, I'm your trusty Bumpkin.",
    ],
  },
};

export const defaultDialogue: DeliveryNPCDialogue = {
  intro: ["Hello, friend! I'm here to see if you have what I need."],
  positiveDelivery: [
    "Oh, fantastic! You've brought exactly what I need. Thank you!",
  ],
  negativeDelivery: [
    "Oh no! It seems you don't have what I need. No worries, though. Keep exploring, and we'll find another opportunity.",
  ],
  noOrder: ["No active order for me to fulfill right now."],
};
