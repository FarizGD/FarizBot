import { tebakgambar } from '@bochilteam/scraper'

let timeout = 120000
let poin = 4999
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
    let id = m.chat
    if (id in conn.tebakgambar) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgambar[id][0])
        //conn.sendButton(m.chat, 'Masih ada soal belum terjawab di chat ini', author, null, buttons, conn.tebakgambar[id][0])
        throw false
    }
    let json = await tebakgambar()
    // if (!json.status) throw json
    let caption = `
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hint untuk hint
Bonus: ${poin} XP
    `.trim()
    conn.tebakgambar[id] = [
        await conn.sendMessage(m.chat, { image: { url }, caption: }, { quoted: m }),
        //await conn.sendFile(m.chat, json.img, json.img, caption, m, false, { asImage: true }),
        json, poin,
        //await conn.sendButton(m.chat, caption, author, json.img, buttons, m),
        setTimeout(() => {
            if (conn.tebakgambar[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgambar[id][0])
            delete conn.tebakgambar[id]
        }, timeout)
    ]
}
handler.help = ['tebakgambar']
handler.tags = ['game']
handler.command = /^tebakgambar/i

export default handler

const buttons = [
    ['hint', '/hint'],
    ['nyerah', 'menyerah']
]