import db from '../lib/database/index.js'
import Connection from '../lib/connection.js'

const { areJidsSameUser } = await import('@whiskeysockets/baileys')

const cooldown = 300000
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  let user = await db.users.get(m.sender)

  let pengali = 1
  if (m.chat == '120363143522564771@g.us') {
    pengali = 2
  }

  let silent = 1 
  if (user.silent != true) {
    silent = 4
  }
  let safezone = 1
  if (user.safezone == true) {
    safezone = 10
  }
  let extra = safezone * silent   
  
  const rewards = {
    psychic: ((1 + user.aura) * user.psychic_multiplier * user.psychic_multiplier_extra) * pengali,
  }
  if (new Date() - user.lastpsychic < cooldown * extra) {
    const remainingTime = new Date(user.lastpsychic + cooldown * extra) - new Date()
    throw `Kamu baru saja berdoa! Tunggu selama *${remainingTime.toTimeString()}*`
  }
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
  }
  if (user.silent == false) {
    m.reply(text.trim())
  }
  user.lastpsychic = new Date() * 1
  await db.users.update(m.sender, user)
}
handler.help = ['pray']
handler.tags = ['ability']
handler.command = /^(pray)$/i

handler.cooldown = cooldown

export default handler
