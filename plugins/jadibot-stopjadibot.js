import { areJidsSameUser } from '@whiskeysockets/baileys'
import Connection from '../lib/connection.js'

let handler = async (m, { conn: _conn, conn }) => {
  const parent = await Connection.conn
  if (areJidsSameUser(parent.user.id, conn.user.id) || areJidsSameUser(parent.user.id, _conn.user.id)) {
    m.reply('Kenapa tidak langsung ke terminalnya?')
    return
  } else if (!areJidsSameUser(parent.user.id, conn.user.id) || !areJidsSameUser(parent.user.id, _conn.user.id)) {
    const index = [...Connection.connections.entries()].findIndex(([_, { conn: _conn }]) => areJidsSameUser(conn.user.id, _conn.user.id))
    if (index == -1) throw '??'
    await conn.reply(m.chat, 'Goodbye bot :\')', m)
    conn.end()
    Connection.conns.delete(index)
  }
}

handler.help = ['berhenti', 'stop']
handler.tags = ['jadibot']
handler.command = /^(((berhenti|stop)jadibot)|stop)$/i
handler.owner = true

export default handler