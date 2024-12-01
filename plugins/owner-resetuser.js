import path from 'path';
import db from '../lib/database/index.js'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Siapa yang mau di-reset?'
    let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
    if (!who) return m.reply('Tag salah satu, atau ketik Nomernya!!')
    const user = await db.users.get(who)
    if (!user) return m.reply(`User ${who} tidak ada dalam database`)
    
    // Menghapus data pengguna dari basis data
    const deleteSuccess = await db.users.delete(who);
    if (deleteSuccess) {
        conn.reply(who, '*❌ Data Anda telah dihapus oleh Owner ⚠️*');
        conn.reply(m.chat, `🗑 Berhasil menghapus data *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* dari basis data! 🗑`, null, { mentions: [who] });
    } else {
        conn.reply(m.chat, `⚠️ Gagal menghapus data *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* dari basis data! ⚠️`, null, { mentions: [who] });
    }
}

handler.help = ['reset @user']
handler.tags = ['owner']
handler.command = /^reset$/i
handler.rowner = true
handler.disabled = false

export default handler;