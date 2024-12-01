import db from '../lib/database/index.js'

const cooldown = 2628000000 // 1 bulan dalam milidetik
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  let user = await db.users.get(m.sender)
  
  let pengali = 1
  if (m.chat == '120363143522564771@g.us') {
      pengali = 2
  }
  
  const rewards = {
      scoin: ((1 + user.gundakan) * pengali) * (user.dragon + 1),
  }
  
  if (user.chat < 10000) return m.reply(`
💬 Chatmu masih terlalu sedikit untuk gacha 💰 scoin!
`.trim())
  if (user.level < 10) return m.reply(`
Levelmu masih terlalu rendah untuk gacha 💰 scoin!
`.trim())
    
  let extra = 1
  if (user.safezone == true) {
      extra = 3
  }  
  
  if (new Date() - user.lastscoin < cooldown * extra) throw `Kamu sudah mengumpulkan 💰 scoin!, tunggu *${((user.lastscoin + cooldown * extra) - new Date()).toTimeString()}*`
  
  let text = ''
  
  await db.users.update(m.sender, (user) => {
      for (let reward of Object.keys(rewards)) {
        if (!(reward in user)) continue
        user[reward] += rewards[reward]
        text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
        user.lastscoin = new Date() * 1
      }
  })
  
  if (user.silent == false) {
    m.reply(text.trim())
  }
}
handler.help = ['scoin']
handler.tags = ['rekening']
handler.command = /^(scoin)$/i

handler.cooldown = cooldown

export default handler