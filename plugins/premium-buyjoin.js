import db from '../lib/database/index.js'
import { areJidsSameUser } from '@whiskeysockets/baileys'
import Connection from '../lib/connection.js'

const COINLY_PRICE = 100

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { conn: _conn, conn, text, isOwner, usedPrefix }) => {
    
  const parent = await Connection.conn
  if (areJidsSameUser(parent.user.id, conn.user.id) || areJidsSameUser(parent.user.id, _conn.user.id)) {
    m.reply('Command ini hanya bisa untuk bot cabang!')
    return
  }
  
  let user = await db.users.get(m.sender)
  let [_, code, expired] = text.match(linkRegex) || []
  expired = Math.floor(Math.max(1, isNumber(expired) ? parseInt(expired) : 1)) * (isOwner ? Math.min(999, expired) : 1);
  if (!code) throw `Link invalid ❌\n\nGunakan Format .buyjoin [link] [hari]\nContoh penggunaan: .buyjoin https://chat.whatsapp.com/123 3\n\nHarga: ${COINLY_PRICE} 🧭 / hari`
  if (isNaN(expired)) throw `Waktu kadaluarsa tidak valid ❌\n\nGunakan Format .join [link] [hari]\nContoh penggunaan: .join https://chat.whatsapp.com/123 3`
  if (user.coinly < (COINLY_PRICE * expired))
    return m.reply(`
Untuk membeli join selama ${expired} hari, Anda memerlukan setidaknya ${expired * COINLY_PRICE} 🧭 Coinly!
Anda dapat memperoleh Coinly 🧭 dengan mengetikkan *${usedPrefix}coinly*

Harga: ${COINLY_PRICE} 🧭 / hari
`.trim())
  
  let res = await conn.groupAcceptInvite(code)
  if (!res) {
    return await m.reply(`Gagal bergabung dengan grup ${code}. Bot mungkin akan otomatis keluar dari grup jika bot sudah tergabung. Silakan coba lagi lain kali...`)
  }
  
  await db.users.update(m.sender, (user) => {
    user.coinly -= COINLY_PRICE * expired
  })
  
  m.reply(`Berhasil bergabung dengan grup ${res}${expired ? ` selama ${expired} hari` : ''}\nAnda telah membeli join selama ${expired} hari dengan harga ${expired * COINLY_PRICE} coinly 🪙`)
  
  let chats = await db.users.get(res)
  if (!chats) {
    chats = {}
    await db.users.update(res, (user) => {
      user.chats = chats
    })
  }
  
  if (expired) {
    await db.users.update(res, (user) => {
      user.chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
    })
  }
}

handler.help = ['buyjoin <chat.whatsapp.com>']
handler.tags = ['premium']
handler.command = /^buyjoin$/i

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))