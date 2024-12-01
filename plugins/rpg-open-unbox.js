import db from '../lib/database/index.js'
import Connection from '../lib/connection.js'
import { areJidsSameUser } from '@whiskeysockets/baileys'

const rewards = {
  rivena: {
    crypto: 27666,
    gitar: 90,
    pianika: 666,
    terompet: 1250,
    aurora: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  aurora: {
    crypto: 50000,
    diamond: 318,
    money: 128,
    gold: 50,
    fuel: 5,
    auricore: [0, 1, 0, 0, 0],
  },
  safari: {
    kentang: 234,
    diamond: 212,
    money: 428,
    gold: 998,
    fuel: 614,
    auricore: 37,
    worldlock: 20,
    ducky: [0, 0, 1],
  },
}

let handler = async (m, { isPrems, text, command, args, usedPrefix, conn: _conn, __dirname, conn }) => {
  let user = await db.users.get(m.sender)

  if (user.safezone == true) return m.reply(`Kamu tidak bisa unbox dari 🌥️ Safe Zone 🌥️`)

  let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))
  let info = `
Use Format *${usedPrefix}${command} [crate] [count]*
Usage example: *${usedPrefix}${command} common 10*

📍Crate list: 
${Object.keys(listCrate).map((v) => `
${rpg.emoticon(v)}${v}
`.trim()).join('\n')}
`.trim()
  let type = (args[0] || '').toLowerCase()
  let count = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
  if (!(type in listCrate)) return m.reply(info)
  if (user[type] < count) return m.reply(`
Your *${rpg.emoticon(type)}${type} crate* is not enough!, you only have ${user[type]} *${rpg.emoticon(type)}${type} crate*
type *${usedPrefix}buy ${type} ${count - user[type]}* to buy
`.trim())
  if (user.level < 50) return m.reply(`
Untuk unbox crate, kamu harus sedikitnya level 50 🧬!
`.trim())
  if (user.crowbar < count && isPrems == false) return m.reply(`
*${rpg.emoticon(type)}${type} crate* yang kamu buka kebanyakan! 🍰
Maximal buka ${user.crowbar} *${rpg.emoticon(type)}${type} crate* yaaa 😁

ketik ${usedPrefix}cbuy crowbar untuk meningkatkan max unboxing 🔼
`.trim())
  else if (user.crowbar * 2 < count && isPrems == true) return m.reply(`
*${rpg.emoticon(type)}${type} crate* yang kamu buka kebanyakan! 🍰
Maximal buka ${user.crowbar * 2} *${rpg.emoticon(type)}${type} crate* yaaa 😁

ketik ${usedPrefix}cbuy crowbar untuk meningkatkan max unboxing 🔼
`.trim())
  if (user.cashly < 10) return m.reply(`
Untuk unbox crate, dibutuhkan sedikitnya 10 💷 Cashly!
Anda bisa mendapatkan Cashly 💷 dengan ketik *${usedPrefix}cashly*
`.trim())
  
  let crateReward = {}
  for (let i = 0; i < count; i++) {
    for (let [reward, value] of Object.entries(listCrate[type])) {
      if (reward in user) {
        const total = value.getRandom()
        if (total) {
          await db.users.update(m.sender, (user) => {
          	user[reward] += total * 1
          	crateReward[reward] = (crateReward[reward] || 0) + (total * 1)
          })
        }
      }
    }
  }

  await db.users.update(m.sender, (user) => {
    user[type] -= count * 1
  })

  if (user.silent == false) {
    m.reply(`
🔩 You have unboxed *${count}* ${global.rpg.emoticon(type)}${type} crate and got:
${Object.keys(crateReward).filter(v => v && crateReward[v]).map(reward => `
*${global.rpg.emoticon(reward)}${reward}:* ${crateReward[reward]}
`.trim()).join('\n')}
`.trim())
  }
}

handler.help = ['unbox'].map(v => v + ' [crate] [count]')
handler.tags = ['rpg']
handler.command = /^(unbox)$/i

export default handler

function isNumber(number) {
  if (!number) return number
  number = parseInt(number)
  return typeof number == 'number' && !isNaN(number)
}