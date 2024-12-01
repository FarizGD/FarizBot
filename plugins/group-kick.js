import { areJidsSameUser } from '@whiskeysockets/baileys'
import Connection from '../lib/connection.js'

let handler = async (m, { participants, text, isROwner, conn: _conn, conn }) => {    
    
    const parent = await Connection.conn
    if (areJidsSameUser(parent.user.id, conn.user.id) || areJidsSameUser(parent.user.id, _conn.user.id)) {
		m.reply('Command ini hanya bisa untuk bot cabang!')
        return
    }
    
    if (!text) throw 'Siapa yang mau di kick?'
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    let kickedUser = []
    for (let user of users)
        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            kickedUser.concat(res)
            await delay(1 * 1000)
        }
    m.reply(`✅ Success kick ${kickedUser.map(v => '@' + v.split('@')[0])}`, null, { mentions: kickedUser })

}
handler.help = ['kick @user']
handler.tags = ['group']
handler.command = /^(kick)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))