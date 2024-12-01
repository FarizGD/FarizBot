import db from '../lib/database/index.js'

let handler = async (m, { args, usedPrefix }) => {
  let user = await db.users.get(m.sender)
  if (user.health >= 100) {
    m.reply('❤️ Kesehatan Anda sudah penuh!')
    user.health = 100
    await db.users.update(m.sender, user)
    return
  }
  const heal = 40 + (user.cat * 4)
  let count = Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, (isNumber(args[0]) && parseInt(args[0]) || Math.round((100 - user.health) / heal)))) * 1
  if (user.potion < count) {
    return m.reply(`
🥤 Potion Anda tidak cukup, Anda hanya memiliki *${user.potion}* 🥤 Potion
ketik *${usedPrefix}buy potion ${count - user.potion}* untuk membeli 🥤 Potion
`.trim())
  }
  user.potion -= count * 1
  user.health += heal * count
  if (user.health >= 100) {
    user.health = 100
  }
  await db.users.update(m.sender, user)
  m.reply(`
Berhasil menggunakan *${count}* 🥤 Potion(s)
`.trim())
}

handler.help = ['heal']
handler.tags = ['rpg']
handler.command = /^(heal)$/i

export default handler

function isNumber(number) {
  if (!number) return number
  number = parseInt(number)
  return typeof number == 'number' && !isNaN(number)
}