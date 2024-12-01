import db from '../lib/database/index.js'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let user = await db.users.get(m.sender)
    if (user.silent === false) {
        await db.users.update(m.sender, (user) => {
            user.silent = true
        })
        user = await db.users.get(m.sender)
        m.reply(`👥 Silent = *${user.silent}*`)
        return
    }
    if (user.silent === true) {
        await db.users.update(m.sender, (user) => {
            user.silent = false
        })
        user = await db.users.get(m.sender)
        m.reply(`👥 Silent = *${user.silent}*`)
        return
    }
}

handler.help = ['silent']
handler.tags = ['rpg']
handler.command = /^silent$/i

export default handler