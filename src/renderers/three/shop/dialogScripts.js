// Dialog scripts for Donny and Ollie
// Context-aware greetings and personality-driven lines

import gameState from '../gameState.js'
import inventory from './inventory.js'

// Track if this is first meeting
const STORAGE_KEY_MET = 'dougk-met-characters'

function getMetCharacters() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_MET) || '{}')
  } catch {
    return {}
  }
}

function markCharacterMet(character) {
  const met = getMetCharacters()
  met[character] = true
  localStorage.setItem(STORAGE_KEY_MET, JSON.stringify(met))
}

function hasMetCharacter(character) {
  return getMetCharacters()[character] || false
}

// Donny - Distinguished, formal, slightly pompous but endearing
const DONNY_FIRST_MEETING = [
  "Ah, a fellow connoisseur of the finer things...",
  "I am Donny. Distinguished purveyor of exquisite wares.",
  "I have procured some rather exceptional items...",
  "Care to take a look?"
]

const DONNY_GREETINGS = [
  [
    "Ah, we meet again, my discerning friend...",
    "I have acquired some new curiosities.",
    "Shall we browse?"
  ],
  [
    "How fortuitous! I was just thinking of you.",
    "My collection has grown quite splendidly...",
    "Care to peruse?"
  ],
  [
    "Ah yes, the distinguished duck keeper returns!",
    "I trust your pond prospers?",
    "Perhaps some new finery is in order..."
  ],
  [
    "Splendid to see you again!",
    "I've been polishing the merchandise...",
    "Only the finest for my favorite customer."
  ]
]

const DONNY_HIGH_KOI = [
  [
    "My word! That is quite the koi fortune!",
    "A collector of your caliber deserves only the best.",
    "Allow me to show you my premium selection..."
  ],
  [
    "Impressive! Your koi-catching prowess is legendary.",
    "With wealth like that, anything is possible...",
    "Shall we see what catches your eye?"
  ]
]

const DONNY_REPEAT_VISITOR = [
  [
    "Back so soon? Excellent taste, as always.",
    "I've kept the good stuff in the back...",
    "Just for you, of course."
  ],
  [
    "Ah, my most loyal patron returns!",
    "I do so enjoy our little exchanges.",
    "What shall it be today?"
  ]
]

// Ollie - Curious, excitable, slightly scatterbrained
const OLLIE_FIRST_MEETING = [
  "Ooooh! Hello hello hello!",
  "I'm Ollie! I've been watching you through my glass...",
  "You catch the fishies! So clever!",
  "I found some treasures! Wanna see wanna see?"
]

const OLLIE_GREETINGS = [
  [
    "Oh oh oh! It's you again!",
    "I found MORE things! So many things!",
    "Look look look!"
  ],
  [
    "Hiii! I was hoping you'd come back!",
    "I've been organizing my collection...",
    "Well, TRYING to organize it anyway..."
  ],
  [
    "There you are! I've been looking everywhere!",
    "Wait, no, I was looking at stuff with my magnifier.",
    "BUT NOW YOU'RE HERE! Perfect timing!"
  ],
  [
    "*excited tentacle wiggles*",
    "Friend friend friend! Welcome back!",
    "I have oddities! Curiosities! Thingamabobs!"
  ]
]

const OLLIE_HIGH_KOI = [
  [
    "WOW! Look at all those fishies!",
    "You're like... a koi WIZARD!",
    "I have special special things for special fishers!"
  ],
  [
    "So many koi! How do you DO that?!",
    "I tried counting them but I lost track at... um...",
    "Anyway! TREASURES! I have them!"
  ]
]

const OLLIE_REPEAT_VISITOR = [
  [
    "You came back! You came BACK!",
    "I was worried you forgot about me...",
    "Just kidding! I was busy looking at a rock. Wanna see?"
  ],
  [
    "FRIEND! *happy bubbles*",
    "I reorganized everything! Again!",
    "It's a LITTLE messier but also better somehow?"
  ]
]

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function getDialogForCharacter(character) {
  const koiCount = gameState.getKoi()
  const hasMet = hasMetCharacter(character)
  const ownedCount = inventory.ownedItems.length

  // Mark as met for next time
  if (!hasMet) {
    markCharacterMet(character)
  }

  if (character === 'donny') {
    // First meeting
    if (!hasMet) {
      return DONNY_FIRST_MEETING
    }

    // High koi count (50+)
    if (koiCount >= 50 && Math.random() < 0.5) {
      return pickRandom(DONNY_HIGH_KOI)
    }

    // Repeat visitor with purchases
    if (ownedCount >= 3 && Math.random() < 0.4) {
      return pickRandom(DONNY_REPEAT_VISITOR)
    }

    // Standard greeting
    return pickRandom(DONNY_GREETINGS)
  }

  if (character === 'ollie') {
    // First meeting
    if (!hasMet) {
      return OLLIE_FIRST_MEETING
    }

    // High koi count (50+)
    if (koiCount >= 50 && Math.random() < 0.5) {
      return pickRandom(OLLIE_HIGH_KOI)
    }

    // Repeat visitor
    if (ownedCount >= 3 && Math.random() < 0.4) {
      return pickRandom(OLLIE_REPEAT_VISITOR)
    }

    // Standard greeting
    return pickRandom(OLLIE_GREETINGS)
  }

  return ["Hello!"]
}

// Quick return lines - when player taps to summon them back
const DONNY_TAP_RETURN = [
  [
    "Ah, you're back for more, eh?",
    "I knew you would be.",
    "Let's see what catches your fancy..."
  ],
  [
    "Changed your mind? Excellent judgment.",
    "The best customers always return.",
    "Now then, shall we?"
  ],
  [
    "Back so soon? Marvelous!",
    "I was just about to polish my finest wares.",
    "Your timing is impeccable."
  ],
  [
    "Couldn't stay away, could you?",
    "I completely understand.",
    "Quality is irresistible, after all."
  ]
]

const OLLIE_TAP_RETURN = [
  [
    "You tapped me! You TAPPED me!",
    "I love taps! They're like underwater high-fives!",
    "Okay okay, let's look at stuff!"
  ],
  [
    "OOH! Hello again!",
    "Did you forget something? I forget stuff ALL the time!",
    "Let's see what I have..."
  ],
  [
    "Back for more shinies?",
    "I KNEW you liked the shinies!",
    "Everyone likes shinies!"
  ],
  [
    "*surprised wiggle*",
    "Oh hi! I was just counting my tentacles...",
    "Still eight! Anyway, SHOPPING TIME!"
  ]
]

export function getReturnDialog(character) {
  if (character === 'donny') {
    return pickRandom(DONNY_TAP_RETURN)
  }
  if (character === 'ollie') {
    return pickRandom(OLLIE_TAP_RETURN)
  }
  return ["Welcome back!"]
}

// Farewell lines (for future use when closing shop)
export const FAREWELLS = {
  donny: [
    "Until next time, my friend.",
    "Do come again. I'll save the best for you.",
    "Farewell! May your pond flourish.",
    "A pleasure, as always."
  ],
  ollie: [
    "Bye bye bye! Come back soon!",
    "See you later! I'll find more stuff!",
    "*waves all tentacles* BYEEE!",
    "Don't be a stranger! I'll be here! Looking at things!"
  ]
}
