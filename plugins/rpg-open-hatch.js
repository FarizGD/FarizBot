import db from '../lib/database/index.js'

const rewards = {
  pet: { //keuntungan 1400 / harga beli 1360
    ant: [1, 1],
    fox: Array(1).fill(0).concat(1),
    horse: Array(4).fill(0).concat(1),
    cat: Array(9).fill(0).concat(1),
    dog: Array(19).fill(0).concat(1),
    dragon:  Array(999).fill(0).concat(1),
    panda:  Array(9999).fill(0).concat(1),
  },
  // pet: {
  //     petFood: [0, 1, 0, 0, 0],
  //     anjing: [],
  // }
}

let handler = async (m, { command, args, usedPrefix }) => {
  let user = await db.users.get(m.sender)
  let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))
  let info = `
Use Format *${usedPrefix}${command} [box] [count]*
Usage example: *${usedPrefix}${command} pet 1*

📍Crate list: 
${Object.keys(listCrate).map((v) => `
${rpg.emoticon(v)}${v}

🌫️ Rate:
- Ant 🐜 100%
- Fox 🦊 50%
- Horse 🐴 20%
- Cat 🐈 10%
- Dog 🐕 5%
- Dragon 🐉 0.1%
- Panda 🐼 0.01%
`.trim()).join('\n')}
`.trim()

  let type = (args[0] || '').toLowerCase()
  let count = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1

  if (!(type in listCrate)) return m.reply(info)
  if (user[type] < count) return m.reply(`
Your *${rpg.emoticon(type)}${type} crate* is not enough!, you only have ${user[type]} *${rpg.emoticon(type)}${type} crate*
type *${usedPrefix}buy ${type} ${count - user[type]}* to buy
`.trim())

  if (1 < count) return m.reply(`
*${rpg.emoticon(type)}${type} crate* yang kamu buka kebanyakan! 🍰
Maximal buka 1 *${rpg.emoticon(type)}${type} crate* yaaa 😁
`.trim())

  if (user.coinly < 10) return m.reply(`
Untuk hatch box, dibutuhkan sedikitnya 10 🧭 Coinly!
Anda bisa mendapatkan Coinly 🧭 dengan ketik *${usedPrefix}coinly*
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
You have hatched *${count}* ${global.rpg.emoticon(type)}${type} crate and got:
${Object.keys(crateReward).filter(v => v && crateReward[v] && !/legendary|pet|mythic|diamond|emerald/i.test(v)).map(reward => `
*${global.rpg.emoticon(reward)}${reward}:* ${crateReward[reward]}
`.trim()).join('\n')}
`.trim())
  }
}

handler.help = ['hatch'].map(v => v + ' [type] [count]')
handler.tags = ['rpg']
handler.command = /^(hatch)$/i

export default handler

function isNumber(number) {
  if (!number) return number
  number = parseInt(number)
  return typeof number == 'number' && !isNaN(number)
}
