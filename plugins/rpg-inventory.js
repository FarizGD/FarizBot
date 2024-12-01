import db from '../lib/database/index.js'
import daily from './rpg-daily.js'
import monthly from './rpg-monthly.js'
import adventure from './rpg-adventure.js'
import trading from './rpg-trading.js'
import coinly from './click-coinly.js'

import Connection from '../lib/connection.js'

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const inventory = {
  others: {
    prestige: true,
    followers: true,
    gender: true,
    level: true,
    aranara: true,
    luck: true,
    health: true,
    gmoney: true,
    limit: true,
    maxcrate: true,
    exp: true,
    role: true,
    location: true,
  },
  rekening: {
    rupiah: true,
    coinly: true,
    cashly: true,
    cardly: true,
    vcoin: true,
    scoin: true,
    credit: true,
  },
  ability: {
    token: true,
    strength: true,
    psychic: true,
    defense: true,
    speed: true,
    protection: true,
    getaran: true,
    goncangan: true,
    gundakan: true,
    death: true,
  },
  collections: {
    gamepass: true,
    palu: true,
    pedang: true,
    aura: true,
    balancer: true,
    lock: true,
    lockpick: true,
    crowbar: true,
    gitar: true,
    pianika: true,
    terompet: true,
    piano: true,
    triangle: true,
    flagy: true,
    pickaxe: true,
    diamondpickaxe: true,
  },
  foodbank: {
    burger: true,
    pizza: true,
    kentang: true,
  },  
  click: {
    clickly: true,
  },
  devices: {
    social: true,
    gems: true,
    phone: true,
    smartphone: true,
    worldlock: true,
    diamondlock: true,
  },
  items: {
    money: true,
    potion: true,
    elixir: true,
    sphere: true,
    trash: true,
    wood: true,
    rock: true,
    string: true,
    emerald: true,
    diamond: true,
    orb: true,
    keping: true,
    crypto: true,
    auricore: true,
    car: true,
    fuel: true,
    gold: true,
    iron: true,
  },
  tools: {
    armor: {
      '0': '❌',
      '1': 'Leather Armor',
      '2': 'Iron Armor',
      '3': 'Gold Armor',
      '4': 'Diamond Armor',
      '5': 'Emerald Armor',
      '6': 'Crystal Armor',
      '7': 'Obsidian Armor',
      '8': 'Netherite Armor',
      '9': 'Wither Armor',
      '10': 'Dragon Armor',
      '11': 'Hacker Armor',
    },
    sword: {
      '0': '❌',
      '1': 'Wooden Sword',
      '2': 'Stone Sword',
      '3': 'Iron Sword',
      '4': 'Gold Sword',
      '5': 'Copper Sword',
      '6': 'Diamond Sword',
      '7': 'Emerald Sword',
      '8': 'Obsidian Sword',
      '9': 'Netherite Sword',
      '10': 'Samurai Slayer Green Sword',
      '11': 'Hacker Sword',
    },
    pickaxe: {
      '0': '❌',
      '1': 'Wooden Pickaxe',
      '2': 'Stone Pickaxe',
      '3': 'Iron Pickaxe',
      '4': 'Gold Pickaxe',
      '5': 'Copper Pickaxe',
      '6': 'Diamond Pickaxe',
      '7': 'Emerlad Pickaxe',
      '8': 'Crystal Pickaxe',
      '9': 'Obsidian Pickaxe',
      '10': 'Netherite Pickaxe',
      '11': 'Hacker Pickaxe',
    },
    fishingrod: true,

  },
  crates: {
    common: true,
    rare: true,
    mythic: true,
    legendary: true,
    safana: true,
    luxury: true,
    bruh: true,
    lona: true,
    loana: true,
    rivena: true,
    aurora: true,
    pet: true,
  },
  pets: {
    ant: 100,
    horse: 10,
    fox: 10,
    cat: 10,
    dog: 10,
    dragon: 10,
  },
  cooldowns: {
    lastclaim: {
      name: 'claim',
      time: daily.cooldown
    },
    lastmonthly: {
      name: 'monthly',
      time: monthly.cooldown
    },
    lastadventure: {
      name: 'adventure',
      time: adventure.cooldown
    },
    lasttrading: {
      name: 'trading',
      time: trading.cooldown
    },
    lastcoinly: {
      name: 'coinly',
      time: coinly.cooldown
    },
  }
}
let handler = async (m, { conn, args, usedPrefix, isPrems, isROwner }) => {
  
  let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
  let pengirim = who
  if (!who || !isROwner) {
    	who = m.sender
        pengirim = m.sender
  }
  //if (!(who in db.users.get)) return m.reply(`User ${who} not in database`)
  let user = await db.users.get(who)
  
  // Make sure role is correct
  user.role = global.rpg.role(user.level).name
  const tools = Object.keys(inventory.tools).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${typeof inventory.tools[v] === 'object' ? inventory.tools[v][user[v]?.toString()] : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim()
  const devices = Object.keys(inventory.devices).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const rekening = Object.keys(inventory.rekening).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const ability = Object.keys(inventory.ability).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const collections = Object.keys(inventory.collections).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const foodbank = Object.keys(inventory.foodbank).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const click = Object.keys(inventory.click).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const items = Object.keys(inventory.items).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const crates = Object.keys(inventory.crates).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  const pets = Object.keys(inventory.pets).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${user[v] >= inventory.pets[v] ? 'Max Levels' : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim()
  const cooldowns = Object.entries(inventory.cooldowns).map(([cd, { name, time }]) => cd in user && `*⌛${name}*: ${new Date() - user[cd] >= time ? '✅' : '❌'}`).filter(v => v).join('\n').trim()
  
  if (((user.lasteat) - +new Date()) < 86400000 * 1) {
      m.reply(`⚠️ Kamu butuh makan ⚠️\n🍴 Waktu sebelum mati kelaparan: *${((user.lasteat) - +new Date()).toTimeString()}*`)
  }
  
  let apakahpremium = '❌'
  if (([conn.decodeJid(Connection.conn.user?.id || ''), ...global.owner.map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who)) || (global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who))) {
    apakahpremium = '✅'
  }
    
  let safezone = ''
  if (user.safezone == true) {
      safezone = `\n🧊 _Safezone *Enabled*_ 🧊`
  }
  
  const caption = `
🎒 *@${(pengirim || '').replace(/@s\.whatsapp\.net/g, '')}* Inventory!

*☉❧ =============== ☙☉*
${safezone}
⭐ *Premium:* ${apakahpremium}

*⦿ Main ⤵*
${Object.keys(inventory.others).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n')}${tools ? `

*📍 Tools*
${tools}` : ``}${rekening ? `

*◈══════════════════◈*
${readMore}
*🏦 Rekening ⤵*
${rekening}
*💱 Total Saldo:* ${toSimple(Object.keys(inventory.rekening).map(v => user[v]).reduce((a, b) => a + b, 0))} Dana` : ''}${ability ? `

*◈══════════════════◈*

*🎏 Ability ⤵*
${ability}
*🎒 Total Ability:* ${toSimple(Object.keys(inventory.ability).map(v => user[v]).reduce((a, b) => a + b, 0))} Ability` : ''}${collections ? `

*◈══════════════════◈*

*🪔 Collections ⤵*
${collections}
*🎒 Total Collections:* ${toSimple(Object.keys(inventory.collections).map(v => user[v]).reduce((a, b) => a + b, 0))} Collections` : ''}${foodbank ? `

*◈══════════════════◈*

*🍱 Foodbank Area ⤵*
${foodbank}
*🎒 Total Clicks:* ${Object.keys(inventory.foodbank).map(v => user[v]).reduce((a, b) => a + b, 0)} Foods` : ''}${click ? `

*◈══════════════════◈*

*👆🏻 Click Points ⤵*
${click}
*🎒 Total Clicks:* ${Object.keys(inventory.click).map(v => user[v]).reduce((a, b) => a + b, 0)} Clicks` : ''}${devices ? `

*◈══════════════════◈*

*📠 Devices ⤵*
${devices}
*🎒 Total Devices:* ${Object.keys(inventory.devices).map(v => user[v]).reduce((a, b) => a + b, 0)} Devices` : ''}${items ? `

*◈══════════════════◈*

*💰 Items ⤵*
${items}
*🎒 Total Items:* ${toSimple(Object.keys(inventory.items).map(v => user[v]).reduce((a, b) => a + b, 0))} Items` : ''}${crates ? `

*◈══════════════════◈*

*📦 Crates ⤵*
${crates}
*🎒 Total Crates:* ${toSimple(Object.keys(inventory.crates).map(v => user[v]).reduce((a, b) => a + b, 0))} Crates` : ''}${pets ? `

*◈══════════════════◈*

*🐼 Pets ⤵*
${pets}` : ''}${cooldowns ? `

*◈══════════════════◈*

*⌚ Cooldowns ⤵*
${cooldowns}` : ''}

*◈══════════════════◈*
`.trim()
  m.reply(caption, null, { mentions: [pengirim] })
}
handler.help = ['inventory', 'inv']
handler.tags = ['rpg']
handler.command = /^(inv(entory)?|money|e?xp)$/i
export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}

function toSimple(number) {
  if (isNaN(parseFloat(number))) return number;
  if (parseFloat(number) === 0) return '0';
  number = parseFloat(number).toFixed(0);
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'Dc', 'Ud', 'Dd', 'Td', 'Qua', 'Qui', 'Sxd', 'Spd', 'Ocd', 'NoD', 'Vg'];
  const base = 1000;
  const exponent = Math.floor(Math.log10(Math.abs(number)) / 3);
  const suffix = suffixes[exponent] || '';
  const simplified = number / Math.pow(base, exponent);
  const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 1 });
  return formatter.format(simplified) + suffix;
}