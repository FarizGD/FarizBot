import similarity from 'similarity'
import db from '../lib/database/index.js'

const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*(who)/i.test(m.quoted.text) || /.*(who)/i.test(m.text)) 
        return !0
    this.siapakahaku = this.siapakahaku ? this.siapakahaku : {}
    if (!(id in this.siapakahaku)) return this.reply(m.chat, 'Soal itu telah berakhir', m)
    //if (!(id in this.siapakahaku)) return this.sendButton(m.chat, 'Soal itu telah berakhir', author, ['siapakahaku', '/siapakahaku'], m)
    if (m.quoted.id == this.siapakahaku[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.siapakahaku[id][1]))
        // m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            const user = await db.users.get(m.sender)
            await db.users.update(m.sender, user => {
                user.exp += this.siapakahaku[id][2]
            })
            this.reply(m.chat, `*Benar!*\n+${this.siapakahaku[id][2]} XP`, m)
            //this.sendButton(m.chat, `*Benar!*\n+${this.siapakahaku[id][2]} XP`, author, ['siapakahaku', '/siapakahaku'], m)
            clearTimeout(this.siapakahaku[id][3])
            delete this.siapakahaku[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
            m.reply(`*Dikit Lagi!*`)
        } else {
            m.reply(`*Salah!*`)
        }
    }
    return !0
}
handler.exp = 0

export default handler