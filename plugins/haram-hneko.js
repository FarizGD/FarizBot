import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/nsfw/neko')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, json.url, `Budak kartun 😉`.trim(), m)
    //conn.sendButton(m.chat, 'Budak kartun', author, json.url, [['hneko', `${usedPrefix}hneko`]], m)
}
handler.help = ['hneko']
handler.tags = ['haram']
handler.command = /^(hneko)$/i
handler.private = false

export default handler