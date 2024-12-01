import similarity from 'similarity'
import db from '../lib/database/index.js'

const threshold = 0.72
export async function before(m, { conn, text, usedPrefix, command }) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*teka/i.test(m.quoted.text) || /.*(hint|teka)/i.test(m.text))
    return true

  this.tebakkata = this.tebakkata ? this.tebakkata : {}
  if (!(id in this.tebakkata))
    return conn.reply(m.chat, `Soal itu telah berakhir\nTebakkata ➭ /tebakkata`, m)

  if (m.quoted.id == this.tebakkata[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakkata[id][1]))

    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      const user = await db.users.get(m.sender)
      await db.users.update(m.sender, (user) => {
        user.exp += this.tebakkata[id][2]
      })

      conn.reply(m.chat, `*Benar!*\n+${this.tebakkata[id][2]} XP\nTebakkata ➭ /tebakkata`, m)
      clearTimeout(this.tebakkata[id][3])
      delete this.tebakkata[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
      m.reply(`*Dikit Lagi!*`)
    else
      m.reply(`*Salah!*`)
  }
  return true
}

export const exp = 0