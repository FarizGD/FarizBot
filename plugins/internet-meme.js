import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://meme-api.com/')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendButton(m.chat, 'Random Meme', author, json.url, [['meme', `${usedPrefix}meme`]], m)
}
handler.help = ['meme']
handler.tags = ['internet']
handler.command = /^(meme)$/i

export default handler