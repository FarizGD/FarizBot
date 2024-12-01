import db from '../lib/database/index.js'
import Connection from '../lib/connection.js'
import { areJidsSameUser } from '@whiskeysockets/baileys'

const cooldown = 15000
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
    speed: (1 * user.speed_multiplier * user.speed_multiplier_extra) * pengali,
  }
  if (new Date() - user.lastrun < cooldown * extra) throw `Kamu baru saja berlari! Tunggu selama *${((user.lastrun + cooldown * extra) - new Date()).toTimeString()}*`
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    await db.users.update(m.sender, (user) => {
      user[reward] += rewards[reward]
    })
    text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`
  }
  if (user.silent == false) {
    m.reply(text.trim())
  }
  await db.users.update(m.sender, (user) => {
    user.lastrun = new Date() * 1
  })
}
handler.help = ['run']
handler.tags = ['ability']
handler.command = /^(run)$/i

handler.cooldown = cooldown

export default handler