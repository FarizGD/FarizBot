import Connection from '../lib/connection.js'
import ws from 'ws'

let handler = async (m, { conn, text, usedPrefix }) => {
    const users = [...new Set(
        [...Connection.connections.entries()]
            .filter(([_, { conn }]) => conn.user.jid && !conn.ws.isClosed)
            .map(([_, { conn }]) => conn.user)
    )]
    m.reply('🌟 List Bot Utama : \n' + '- wa.me/6285182956981 (Fariz-Bot)\n\n' + '🤖 List Bot Cabang: (Total: ' + users.length + "/30)\n" + users.map((v, i) => (i + 1) + '. wa.me/' + v.jid.replace(/[^0-9]/g, '') + `?text=${usedPrefix}menu (${v.name})`).join('\n'))
}

handler.help = handler.tags = ['jadibot']

handler.command = /^(listjadibot|ljb|listbot|botlist)$/i

export default handler