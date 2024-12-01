import db from '../lib/database/index.js';

const cooldown = 300;
const BANNED_TIME = 60 * 60 * 1000

export async function all(m) {
  let user = await db.users.get(m.sender);
  const prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

  if (user) {
    
    if (user.banned == true) {
        return
    }
    
    const lowercaseText = m.text.toLowerCase(); // Mengubah teks menjadi huruf kecil

    if (
      !prefix.test(lowercaseText) && // Memeriksa apakah teks dimulai dengan prefix yang diabaikan
      (user.nama != '-' || user.gender != 'non-binary 🎭' || user.umur != '-')
    ) {
      await db.users.update(m.sender, (user) => {
        user.chat += 1;
      });
    }

    if (
      !prefix.test(lowercaseText) && // Memeriksa apakah teks dimulai dengan prefix yang diabaikan
      (user.nama != '-' || user.gender != 'non-binary 🎭' || user.umur != '-') &&
      m.chat == '120363026841847133@g.us'
    ) {
      await db.users.update(m.sender, (user) => {
        user.chatneri += 1;
      });
    }
    
    if (prefix.test(lowercaseText) && (+new Date() <= user.lastcommand)) { 
        const timeLeft = ((user.lastcommand) - +new Date());
    	const waitTime = timeLeft < 1000 ? `*${timeLeft} milisecond(ms)*` : `*${(timeLeft / 1000).toFixed(1)} second(s)*`;
        m.reply(`Kamu baru saja memakai bot! Tunggu selama ${waitTime}`)
        await db.users.update(m.sender, (user) => {
            user.warn += 1;
        });
        return
    }
      
    if (user.warn > 0) {
        if (user.warn > 1 && prefix.test(lowercaseText)) {
            await db.users.update(m.sender, (user) => {
                user.chat = Math.floor(user.chat / 2);
                user.chatneri = Math.floor(user.chatneri / 2);
                user.banned = true
                user.bannedExpired = Date.now() + BANNED_TIME
                user.warn = 0
            })
            m.reply(`Anda spam, ckckck`)
            return
        } else {
            await db.users.update(m.sender, (user) => {
                user.warn = 0
            })
        }
    }
      
    if (prefix.test(lowercaseText) && (user.nama != '-' || user.gender != 'non-binary 🎭' || user.umur != '-')) {
        await db.users.update(m.sender, (user) => {
            user.lastcommand = +new Date() + cooldown;
        });
    }
  }
}