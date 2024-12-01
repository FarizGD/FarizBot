import db from '../lib/database/index.js'

let handler = async (m, { text, usedPrefix, command }) => {
    const users = await db.users.get(m.sender)
    db.data.sticker = db.data.sticker || {}
    
    if (text.includes('http://') || text.includes('https://')) {
        m.reply('Set cmd tidak boleh mengandung link!')
        return
    }
    
    if (!m.quoted) throw `Balas stiker dengan perintah *${usedPrefix + command}*`
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`
    let sticker = db.data.sticker
    let hash = m.quoted.fileSha256.toString('base64')
    if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk mengubah perintah stiker ini'

    await db.users.update(m.sender, (user) => {
        sticker[hash] = {
            text,
            mentionedJid: m.mentionedJid,
            creator: m.sender,
            at: +new Date(),
            locked: false,
        }
        user.money += 1000
    })
    
    m.reply(`Berhasil!`)
}

handler.help = ['cmd'].map(v => 'set' + v + ' <teks>')
handler.tags = ['database']
handler.command = ['setcmd']
handler.rowner = true

export default handler