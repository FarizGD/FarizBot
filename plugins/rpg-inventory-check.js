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
    money: true,
    coinly: true,
    cashly: true,
    cardly: true,
    limit: true,
    maxcrate: true,
    exp: true,
    role: true
  },
  ability: {
    strength: true,
    psychic: true,
    defense: true,
    speed: true,
    protection: true,
  },
}

let handler = async (m, { conn, args, text, usedPrefix, command, isPrems, isROwner }) => {
  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
  let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
  if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
  const user = await db.users.get(who)
  if (!user) return m.reply(`User ${who} tidak ada dalam database`)
  // Pastikan role sudah benar
  user.role = global.rpg.role(user.level).name
  const ability = Object.keys(inventory.ability).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim()
  
  let apakahpremium = '❌'
  if (([conn.decodeJid(Connection.conn.user?.id || ''), ...global.owner.map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who)) || (global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who))) {
    apakahpremium = '✅'
  }
    
  let safezone = ''
  if (user.safezone == true) {
    safezone = `\n🧊 _Safezone *Enabled*_ 🧊`
  }
  
  const caption = `
🎒 *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* Inventaris!

*+==============+*
${safezone}
⭐ *Premium:* ${apakahpremium}

*⦿ Main ⤵*
${Object.keys(inventory.others).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n')}${ability ? `

*================*
${readMore}
*🎏 Kemampuan*
${ability}
*🎒 Total Kemampuan:* ${Object.keys(inventory.ability).map(v => user[v]).reduce((a, b) => a + b, 0)} Kemampuan` : ''}
*================*
`.trim()
  m.reply(caption, null, { mentions: [who] })
}

handler.help = ['check <user>']
handler.tags = ['rpg']
handler.command = /^check$/i

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
