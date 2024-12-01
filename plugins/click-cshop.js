import db from '../lib/database/index.js'

const items = {
  cbuy: {
    coinly: {
      coinly: 1
    },
    cashly: {
      coinly: 100,
    },
    cardly: {
      coinly: 10000,
    },
    phone: {
      coinly: 180,
    },
    smartphone: {
      coinly: 550,
    },
    palu: {
      coinly: 300,
    },
    maxcrate: {
      coinly: 100,
    },
    crowbar: {
      cashly: 5,
    },
  },
  csell: {
    coinly: {
      coinly: 1
    },
    cashly: {
      coinly: 100,
    },
    cardly: {
      coinly: 10000,
    },
    phone: {
      coinly: 180,
    },
    smartphone: {
      coinly: 550,
    },
  }
}

let handler = async (m, { command, usedPrefix, args }) => {
  let user = await db.users.get(m.sender)
  //if (user.level < 15) return m.reply(`Minimal 🔼 *level 15* untuk menggunakan fitur ini!`)
  const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
  const info = `
Gunakan Format *${usedPrefix}${command} [item] [jumlah]*
Contoh penggunaan: *${usedPrefix}${command} cashly 10*

📍 Daftar Barang: 
${Object.keys(listItems).map((v) => {
      let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
      return `${global.rpg.emoticon(v)}${v} | ${toSimple(listItems[v][paymentMethod])} ${global.rpg.emoticon(paymentMethod)}${paymentMethod}`.trim()
    }).join('\n')}
  `.trim()
  const item = (args[0] || '').toLowerCase()
  const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
  if (!listItems[item]) return m.reply(info)
  if (command.toLowerCase() == 'cbuy') {
    let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
    if (user[paymentMethod] < listItems[item][paymentMethod] * total) return m.reply(`Anda tidak memiliki cukup ${global.rpg.emoticon(paymentMethod)}${paymentMethod} untuk membeli *${total}* ${global.rpg.emoticon(item)}${item}. Anda memerlukan *${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* ${paymentMethod} lagi untuk dapat membeli`)
    await db.users.update(m.sender, (user) => {
      user[paymentMethod] -= listItems[item][paymentMethod] * total
      user[item] += total
    })
    return m.reply(`Anda telah membeli *${total}* ${global.rpg.emoticon(item)}${item}`)
  } else {
    if (user[item] < total) return m.reply(`Anda tidak memiliki cukup *${global.rpg.emoticon(item)}${item}* untuk dijual, Anda hanya memiliki ${user[item]} barang`)
    const reward = listItems[item]
    if (Object.keys(reward).length > 1) throw new Error('Multiple reward not supported yet!')
    const rewardKey = Object.keys(reward)[0]
    if (!(rewardKey in user)) throw new Error(`Pengguna tidak memiliki ${rewardKey} dalam database mereka, tetapi reward memberikannya!`)
    await db.users.update(m.sender, (user) => {
      user[item] -= total
      user[rewardKey] += listItems[item][rewardKey] * total
    })
    return m.reply(`Anda menghapus *${total}* ${global.rpg.emoticon(item)}${item} dan mendapatkan *${listItems[item][rewardKey] * total}* ${global.rpg.emoticon(rewardKey)}`)
  }
}

handler.help = ['cbuy', 'csell'].map(v => v + ' [item] [jumlah]')
handler.tags = ['click']
handler.command = /^(cbuy|csell)$/i

handler.disabled = false

export default handler

function isNumber(number) {
  if (!number) return number
  number = parseInt(number)
  return typeof number == 'number' && !isNaN(number)
}

function toSimple(number) {
  number = parseInt(number * 1)
  if (!isNumber(number)) return number
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(number)
}