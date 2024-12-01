import similarity from 'similarity'
import db from '../lib/database/index.js'

const threshold = 0.72

export async function before(m) {
  let id = m.chat
  if (
    !m.quoted ||
    !m.quoted.fromMe ||
    !m.quoted.isBaileys ||
    !m.text ||
    !/Ketik.*hint/i.test(m.quoted.text) ||
    /.*hint/i.test(m.text)
  )
    return !0

  this.tebakgambar = this.tebakgambar ? this.tebakgambar : {}
  if (!(id in this.tebakgambar))
    return this.reply(m.chat, 'Soal itu telah berakhir', m)

  if (m.quoted.id == this.tebakgambar[id][0].id) {
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
    if (isSurrender) {
      clearTimeout(this.tebakgambar[id][3])
      delete this.tebakgambar[id]
      return this.reply(m.chat, '*Yah Menyerah :(*', m)
    }

    let json = JSON.parse(JSON.stringify(this.tebakgambar[id][1]))

    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      const user = await db.users.get(m.sender)
      await db.users.update(m.sender, (user) => {
        user.exp += this.tebakgambar[id][2]
      })

      this.reply(m.chat, `*Benar!*\n+${this.tebakgambar[id][2]} XP`, m)
      clearTimeout(this.tebakgambar[id][3])
      delete this.tebakgambar[id]
    } else if (
      similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >=
      threshold
    ) {
      m.reply(`*Dikit Lagi!*`)
    } else {
      this.reply(m.chat, `*Salah!*`, m)
    }
  }

  return !0
}

export const exp = 0