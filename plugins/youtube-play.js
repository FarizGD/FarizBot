import { youtubeSearch } from '@bochilteam/scraper'
import db from '../lib/database/index.js';
let handler = async (m, { conn, command, text, usedPrefix }) => {
  let user = await db.users.get(m.sender)
  if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
  if (user.level < 25) {
    text = (`
Untuk menggunakan fitur ini, 🧬 level anda minimal 25!
Anda bisa meningkatkan 🧬 level dengan memainkan botnya 🤯
`.trim())
    conn.sendButton(m.chat, text, author, [
      ['🎒 Inventory (untuk melihat level)', '/inventory'],
      ['📈 Naikan Level', '/levelup'],
      ['🖥️ Menu', '/menu']
    ], m)
    return
    }
  let vid = (await youtubeSearch(text)).video[0]
  if (!vid) throw 'Video/Audio Tidak ditemukan'
  let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId
  await conn.sendHydrated(m.chat, `
📌 *Title:* ${title}
🔗 *Url:* ${url}
🖹 *Description:* ${description}
⏲️ *Published:* ${publishedTime}
⌚ *Duration:* ${durationH}
👁️ *Views:* ${viewH}
  `.trim(), author, thumbnail + '.png', url, '📺Go To Youtube!', null, null, [
    ['Audio 🎧', `${usedPrefix}yta ${url} yes`],
    ['Video 🎥', `${usedPrefix}ytv ${url} yes`],
    ['Youtube Search🔎', `${usedPrefix}yts ${url}`]
  ], m)
}
handler.help = ['play', 'play2'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play2?$/i

handler.exp = 0
handler.limit = false

export default handler

