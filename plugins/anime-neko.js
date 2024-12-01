import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/sfw/neko')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, json.url, `neko`.trim(), m)
    conn.sendButton(m.chat, 'Istri kartun', author, json.url, [['neko', `${usedPrefix}neko`]], m)
}
handler.help = ['neko']
handler.tags = ['internet']
handler.command = /^(neko)$/i
export default handler