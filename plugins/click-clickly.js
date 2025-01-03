import db from '../lib/database/index.js';
import Connection from '../lib/connection.js';

import { areJidsSameUser } from '@whiskeysockets/baileys';

const cooldown = 1000;
let handler = async (m, { isPrems, conn: _conn, conn }) => {
  let user = await db.users.get(m.sender);
  const rewards = {
    clickly: 1 + user.palu,
  };

  if (new Date() - user.lastclickly < cooldown) {
    throw `Kamu sudah ambil 🪸 clickly!, tunggu selama *${((user.lastclickly + cooldown) - new Date()).toTimeString()}*`;
  }  

  let text = '';
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    await db.users.update(m.sender, (user) => {
      user[reward] += rewards[reward];
    });
    text += `*+${rewards[reward]}* ${global.rpg.emoticon(reward)}${reward}\n`;
  }

  if (user.silent === false) {
    m.reply(text.trim());
  }

  await db.users.update(m.sender, (user) => {
    user.lastclickly = new Date() * 1;
  });
};

handler.help = ['clickly'];
handler.tags = ['click'];
handler.command = /^(click)$/i;
handler.cooldown = cooldown;

export default handler;