import db from '../lib/database/index.js';
import daily from './rpg-daily.js';
import monthly from './rpg-monthly.js';
import adventure from './rpg-adventure.js';
import trading from './rpg-trading.js';
import coinly from './click-coinly.js';
import Connection from '../lib/connection.js';
import { getUserCache } from './_cache.js';

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const inventory = {
  others: {
    gender: true,
    nama: true,
    umur: true,
    agama: true,
    role: true
  },
  items: {
    potion: true,
    elixir: true,
    sphere: true,
    trash: true,
    wood: true,
    rock: true,
    string: true,
    emerald: true,
    diamond: true,
    orb: true,
    keping: true,
    crypto: true,
    car: true,
    gold: true,
    iron: true,
  },
  tools: {
    armor: {
      '0': '❌',
      '1': 'Leather Armor',
      '2': 'Iron Armor',
      '3': 'Gold Armor',
      '4': 'Diamond Armor',
      '5': 'Emerald Armor',
      '6': 'Crystal Armor',
      '7': 'Obsidian Armor',
      '8': 'Netherite Armor',
      '9': 'Wither Armor',
      '10': 'Dragon Armor',
      '11': 'Hacker Armor'
    },
  },
};

let handler = async (m, { conn, args, text, usedPrefix, command, isROwner }) => {
  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1;
  let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
  if (!who) {
    who = m.sender;
  }
  const user = await db.users.get(who);
  let users = getUserCache();
  let followers = users.filter(user => user.following.includes(who)).map(follower => Object.values(follower)[0].slice(0, -5)).length;
    
  if (!user) return m.reply(`User ${who} tidak ada dalam database`);
  // Make sure role is correct
  user.role = global.rpg.role(user.level).name;
  const tools = Object.keys(inventory.tools).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${typeof inventory.tools[v] === 'object' ? inventory.tools[v][user[v]?.toString()] : `Level(s) ${user[v]}`}`).filter(v => v).join('\n').trim();
  const items = Object.keys(inventory.items).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n').trim();
  let pasangan = user.partner;
  if (user.partner != '-') {
    let _user = await db.users.get(user.partner);
    pasangan = `${_user.nama}`;
  } else if (user.partner == '-') {
    pasangan = user.partner;
  }

  let belumsetprofile = '';
  if (user.nama == '-' && user.gender == 'non-binary 🎭' && user.umur == '-') {
    belumsetprofile = `\n\n☉❧ Ketik /set untuk mengatur profil`;
  }

  let verified = '👥';
  if (user.verified == true) {
    verified = '☑️';
  }

  const pp = await conn.profilePictureUrl(who).catch(_ => './src/avatar_contact.png');
  let apakahpremium = '❌';
  if (([conn.decodeJid(Connection.conn.user?.id || ''), ...global.owner.map(([number]) => number)].map(v => v?.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who)) || (global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(who))) {
    apakahpremium = '✅';
  }

  const caption = `
💠 *${conn.getName(who)}* Biodata 💠

🧾 Username: ${user.nama} ${verified}
*+==============+*
*◉ Info 📷*
${Object.keys(inventory.others).map(v => user[v] && `*${global.rpg.emoticon(v)}${v}:* ${toSimple(user[v])}`).filter(v => v).join('\n')}${tools ? `


${tools}` : ''}

*◉ Sosial 💬*
💐 Pasangan: ${pasangan}
🫱🏻‍🫲🏼 Sahabat: (coming soon)
👥 *followers:* ${followers}
✨ *Social Points:* ${user.social}${belumsetprofile}
*================*
`.trim();
  conn.sendFile(m.chat, pp, pp, caption, m);

  if (apakahpremium == '✅' && !isROwner) {
    conn.reply(who, `🧾 Profile kamu baru saja diperiksa oleh *@${m.sender.split('@')[0]}* ✏️`, m, { mentions: [m.sender] });
  }
};

handler.help = ['view <user>', 'profile <user>'];
handler.tags = ['rpg', 'life'];
handler.command = /^(view|profile|pp|profil)$/i;

export default handler;

function isNumber(number) {
  if (!number) return number;
  number = parseInt(number);
  return typeof number == 'number' && !isNaN(number);
}

function toSimple(number) {
  if (!isNumber(number)) return number;
  number = parseInt(number * 1);
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(number);
}
