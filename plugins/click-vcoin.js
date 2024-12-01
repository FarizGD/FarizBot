import db from '../lib/database/index.js'

const cooldown = 86400000 // 1 hari dalam milidetik
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  const userId = m.sender
  const user = await db.users.get(userId)
  
  let pengali = 1
  if (m.chat == '120363143522564771@g.us') {
      pengali = 2
  }
  
  const rewards = {
      vcoin: ((1 + user.goncangan) * pengali) * (user.dragon + 1),
  }
  
  if (user.chat < 3000) return m.reply(`
💬 Jumlah chatmu masih terlalu sedikit untuk gacha 💰 vcoin!
`.trim())
  if (user.level < 10) return m.reply(`
Levelmu masih terlalu rendah untuk gacha 💰 vcoin!
`.trim())
    
  let extra = 1
  if (user.safezone == true) {
      extra = 3
  }
    
  if (new Date() - user.lastvcoin < cooldown * extra) throw `Kamu telah mengumpulkan 💰 vcoin!, tunggu *${((user.lastvcoin + cooldown * extra) - new Date()).toTimeString()}*`
  
  let text = ''
  
  await db.users.update(m.sender, (user) => {
      for (let reward of Object.keys(rewards)) {
        if (!(reward in user)) continue
        user[reward] += rewards[reward]
        text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
        user.lastvcoin = new Date() * 1
      }
  })
    
  if (user.silent == false) {
    m.reply(text.trim())
  }
}
handler.help = ['vcoin']
handler.tags = ['rekening']
handler.command = /^(vcoin)$/i

handler.cooldown = cooldown

export default handler