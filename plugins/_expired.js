import db from '../lib/database/index.js';

export async function all(m) {
  if (m.isGroup) {
    let chats = await db.chats.get(m.chat);
    if (chats && chats.expired && +new Date() > chats.expired) {
      await this.reply(m.chat, 'Bye🖐 bot akan left!!');
      await this.groupLeave(m.chat);
      await db.chats.update(m.chat, (chat) => {
        chat.expired = -1;
      });
    }
  }
  
  const user = await db.users.get(m.sender);
  if (user && user.banned && user.bannedExpired !== -1 && +new Date() > user.bannedExpired) {
    await db.users.update(m.sender, (user) => {
      user.banned = false;
      user.bannedExpired = -1;
    });
  }
}