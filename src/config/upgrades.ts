import { getCountdown } from '@/lib/utils';

export const buildings = [
   'Air Bomb',
   'Air Defense',
   'Air Seeking Air Mine',
   'Air Sweeper',
   'Archer Tower',
   'Army Camp',
   'Baracks',
   'Barbarian King',
   'Blacksmith',
   'Bomb',
   'Bomb Tower',
   'Builder Hut',
   'Cannon',
   'Clan Castle',
   'Dark Barracks',
   'Dark Elixir Drill',
   'Dark Elixir Storage',
   'Dark Spell Factory',
   'Eagle Artillery',
   'Elixir Collector',
   'Elixir Storage',
   'Firespitter',
   'Giga Bomb',
   'Giant Bomb',
   'Gold Mine',
   'Gold Storage',
   'Grand Warden',
   'Hidden Tesla',
   'Inferno Tower',
   'Laboratory',
   'Monolith',
   'Mortar',
   'Multi-Archer Tower',
   'Pet House',
   'Archer Queen',
   'Ricochet Cannon',
   'Royal Champion',
   'Scattershot',
   'Seeking Air Mine',
   'Skeleton Trap',
   'Spell Factory',
   'Spell Tower',
   'Spring Trap',
   'Tornado Trap',
   'Wizard Tower',
   'Workshop',
   'X-Bow'
];

export const troops = [
   'Apprentice Warden',
   'Archer',
   'Baby Dragon',
   'Balloon',
   'Barbarian',
   'Bowler',
   'Dragon',
   'Dragon Rider',
   'Druid',
   'Electro Dragon',
   'Electro Titan',
   'Giant',
   'Goblin',
   'Golem',
   'Headhunter',
   'Healer',
   'Hog Rider',
   'Ice Golem',
   'Miner',
   'Minion',
   'Pekka',
   'Root Rider',
   'Valkyrie',
   'Wall Breaker',
   'Witch',
   'Wizard',
   'Yeti'
];

export const spells = [
   'Bat Spell',
   'Clone Spell',
   'Earthquake Spell',
   'Freeze Spell',
   'Haste Spell',
   'Healing Spell',
   'Invisibility Spell',
   'Jump Spell',
   'Lightning Spell',
   'Overgrowth Spell',
   'Poison Spell',
   'Rage Spell',
   'Recall Spell',
   'Skeleton Spell'
];

export const machines = [
   'Battle Blimp',
   'Battle Drill',
   'Flame Flinger',
   'Log Launcher',
   'Siege Barracks',
   'Stone Slammer',
   'Wall Wrecker'
];

export const hammers = [
   'Hammer of Building',
   'Hammer of Fighting',
   'Hammer of Spells',
   'Hammer of Heroes'
]

export const upgrades = [...buildings, ...troops, ...spells, ...machines, ...hammers].sort();
