import Connection from '../lib/connection.js'
import { randomBytes } from 'crypto'

const {
    DisconnectReason,
    areJidsSameUser,
    useMultiFileAuthState
} = await import('@whiskeysockets/baileys')

let handler = async (m, { conn: _conn, conn, text }) => {
    
  const parent = await Connection.conn
  if (areJidsSameUser(parent.user.id, _conn.user.id)) {
      throw '⚠️ Tidak bisa superbroadcast di bot utama! ⚠️'
      return
  }  
    
  let chats = Object.entries(Connection.store.chats).filter(([_, chat]) => chat).map(v => v[0])
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
  for (let id of chats) await conn.copyNForward(id, conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : teks + '\n\n' + '[ ' + author + ' Broadcast 🔊 ]\n'), true).catch(_ => _)
  m.reply('Selesai Broadcast All Chat :)')
}
handler.help = ['superbroadcast', 'sbc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(superbroadcast|sbc)$/i

handler.rowner = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)