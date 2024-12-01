import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/nsfw/waifu')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, json.url, `Pelayanan 😉`.trim(), m)
    //conn.sendButton(m.chat, 'Pelayanan 😉', author, json.url, [['hentai', `${usedPrefix}hentai`]], m)
}

handler.help = ['hentai']
handler.tags = ['haram']
handler.command = /^(hentai)$/i
handler.private = false

export default handler