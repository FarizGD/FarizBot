import db from '../lib/database/index.js'

const rewards = {
  prestige: 1,
}
const cooldown = 259200000
let handler = async (m) => {
  let user = await db.users.get(m.sender)
  if (user.maxcrate < 200 && user.level < 100 && user.gmoney < 100 && user.coinly < 1000) return m.reply(`
🕯️ Kamu belum layak untuk prestige 🕯️
`.trim())
  else if (user.maxcrate < 200 || user.level < 100 || user.gmoney < 100 || user.coinly < 1000) return m.reply(`
🕯️ Kamu belum layak untuk prestige 🕯️

• Berikut ini adalah syarat prestige:
> 200 ⏫ maxcrate
> 100 🧬 level
> 100 ✤ gmoney
> 1000 🧭 coinly
`.trim())
  if (new Date() - user.lastprestige < cooldown) throw `Kamu sudah prestige!, tunggu selama *${((user.lastprestige + cooldown) - new Date()).toTimeString()}*`
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    await db.users.update(m.sender, (user) => {
      user.maxcrate = 1
      user.exp = 0
      user.level = 1
      user.money = 0
      user.keping = 0
      user.crypto = 0
      user.coinly = 0
      user.cashly = 0
      user.cardly = 0
      user[reward] += rewards[reward]
    })
    text += `🕯️ Anda telah prestige dan mengorbankan segalanya 🕯️`
  }
  m.reply(text.trim())
  await db.users.update(m.sender, (user) => {
    user.lastprestige = new Date() * 1
  })
}
handler.help = ['prestige']
handler.tags = ['rpg']
handler.command = /^(prestige)$/i

handler.cooldown = cooldown

export default handler