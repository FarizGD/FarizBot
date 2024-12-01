import db from '../lib/database/index.js'
import { areJidsSameUser } from '@whiskeysockets/baileys'
import Connection from '../lib/connection.js'

const COINLY_PRICE = 30

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { conn: _conn, conn, text, isOwner, usedPrefix }) => {
    
  const parent = await Connection.conn
  if (areJidsSameUser(parent.user.id, conn.user.id) || areJidsSameUser(parent.user.id, _conn.user.id)) {
    m.reply('Command ini hanya bisa untuk bot cabang!')
    return
  }
    
  const user = await db.users.get(m.sender)
  let [_, code, expired] = text.match(linkRegex) || []
  expired = Math.floor(Math.max(1, isNumber(expired) ? parseInt(expired) : 1)) * (isOwner ? Math.min(999, expired) : 1);
  if (!code) throw `Link invalid ❌\n\nGunakan Format .join [link] [hari]\nContoh penggunaan: .join https://chat.whatsapp.com/123 3\n\nHarga: ${COINLY_PRICE} 🧭 / hari`
  if (isNaN(expired)) throw `Waktu kedaluwarsa tidak valid❌\n\nGunakan Format .join [link] [hari]\nContoh penggunaan: .join https://chat.whatsapp.com/123 3`
  if (user.money < (COINLY_PRICE * expired))
    return m.reply(`
Untuk membeli join selama ${expired} hari, Anda membutuhkan setidaknya ${expired * COINLY_PRICE} 🧭 Coinly!
Anda dapat memperoleh Coinly 🧭 dengan mengetik *${usedPrefix}coinly*

Harga: ${COINLY_PRICE} 🧭 / hari
`.trim())
  let res = await conn.groupAcceptInvite(code)
  if (!res) {
      return await m.reply(`Gagal bergabung dengan ${code}. Bot mungkin akan otomatis keluar dari grup jika bot telah bergabung. Silakan coba lagi lain kali...`)
  }
  await db.users.update(m.sender, (user) => {
    user.money -= COINLY_PRICE * expired
  })
  m.reply(`Berhasil bergabung dengan grup ${res}${expired ? ` selama ${expired} hari` : ''}\nAnda telah membeli join selama ${expired} hari dengan harga ${expired * COINLY_PRICE} coinly 🪙`)
  let chats = db.data.chats[res]
  if (!chats) chats = db.data.chats[res] = {}
  if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
}
handler.help = ['join <chat.whatsapp.com>']
handler.tags = ['premium']
handler.premium = true

handler.command = /^join$/i

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))