import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/nsfw/blowjob')
    if (!res.ok) throw await res.text()
    let json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, json.url, `Budak kartun 😉`.trim(), m)
    //conn.sendButton(m.chat, 'Budak kartun', author, json.url, [['blowjob', `${usedPrefix}blowjob`]], m)
}
handler.help = ['blowjob']
handler.tags = ['haram']
handler.command = /^(blowjob)$/i
handler.private = false

export default handler