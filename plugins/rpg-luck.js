import db from '../lib/database/index.js'

const cooldown = 604800000

let handler = async (m, { conn, command, text, usedPrefix }) => {
    let user = await db.users.get(m.sender)
    
    if (new Date() - user.lastluck < cooldown) throw `Kamu sudah gacha ☘ luck!, tunggu selama *${((user.lastluck + cooldown) - new Date()).toTimeString()}*`
    
    await db.users.update(m.sender, (user) => {
        user.luck = (11).getRandom()
    })
    
    m.reply(`☘ Your Luck is: ${user.luck} ☘`)
    await db.users.update(m.sender, (user) => {
      user.lastluck = new Date() * 1
    })
}
handler.help = ['luck']
handler.tags = ['rpg']
handler.command = /^luck/i
handler.cooldown = cooldown

export default handler