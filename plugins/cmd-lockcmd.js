import db from '../lib/database/index.js'

let handler = async (m, { command }) => {
    if (!m.quoted) throw 'Reply Pesan!'
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    let sticker = db.users.get('sticker')
    let hash = m.quoted.fileSha256.toString('hex')
    if (!(hash in sticker)) throw 'Hash tidak ditemukan dalam database'
    db.users.update('sticker', (data) => {
        data[hash].locked = !/^un/i.test(command)
    })
    m.reply('Selesai!')
}
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['database']
handler.command = /^(un)?lockcmd$/i

export default handler