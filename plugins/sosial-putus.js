import db from '../lib/database/index.js'

async function handler(m, { conn, usedPrefix, command }) {
    let user = await db.users.get(m.sender)
    if (user.partner === '-') {
        return m.reply('❌ Kamu tidak memiliki pasangan! Tidak ada hubungan yang bisa diputuskan.')
    }
    let _user = await db.users.get(user.partner)
    conn.reply(user.partner, `💔 Kamu telah diputuskan oleh *@${(m.sender || '').replace(/@s\.whatsapp\.net/g, '')}*`, m, { mentions: [m.sender] })
    m.reply(`✅ Kamu telah memutuskan hubungan dengan *@${(user.partner || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [user.partner] })

    await db.users.update(m.sender, (user) => {
        user.partner = '-'
    })
    await db.users.update(user.partner, (_user) => {
        _user.partner = '-'
    })
}

handler.help = ['putus']
handler.tags = ['sosial']
handler.command = /^(putus)$/i

handler.disabled = false

export default handler