let handler = async (m, { conn }) => {
    conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
    let id = m.chat
    if (!(id in conn.tebakgambar)) throw false
    let json = conn.tebakgambar[id][1]
    conn.reply(m.chat, '```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```', m)
    //conn.sendButton(m.chat, '```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/ig, '_') + '```', author, null, [['nyerah', 'menyerah']], m)
}
handler.command = /^hint$/i

handler.limit = true

export default handler