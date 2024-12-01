import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/sfw/shinobu')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, json.url, `shinobu`.trim(), m)
    conn.sendButton(m.chat, 'Shinobu', author, json.url, [['shinobu', `${usedPrefix}shinobu`]], m)
}
handler.help = ['shinobu']
handler.tags = ['internet']
handler.command = /^(shinobu)$/i
export default handler