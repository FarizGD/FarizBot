import { bucin } from '@bochilteam/scraper'

let handler = async (m, { conn, usedPrefix, command }) => m.reply(await bucin())

handler.help = ['bucin']
handler.tags = ['quotes']
handler.command = /^(bucin)$/i

export default handler
