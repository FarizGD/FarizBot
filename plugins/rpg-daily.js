import db from '../lib/database/index.js';

const cooldown = 86400000;
let handler = async (m) => {
  const user = await db.users.get(m.sender);
  
  let rewards = {
    exp: 300,
    money: 70,
  };
  if (user.level >= 30) {
    rewards = {
      exp: 300,
      money: 1 / 100 * user.money,
    };
  }
  
  if (new Date - user.lastclaim < cooldown) throw `Kamu sudah mengklaim reward harian ini! Tunggu selama *${((user.lastclaim + cooldown) - new Date()).toTimeString()}*`

  let text = '';
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue;
    user[reward] += rewards[reward];
    text += `*+${toSimple(rewards[reward])}* ${global.rpg.emoticon(reward)}${reward}\n`;
  }

  m.reply(text.trim());
  user.lastclaim = new Date() * 1;

  await db.users.update(m.sender, (userData) => {
    Object.assign(userData, user);
  });
};

handler.help = ['daily', 'claim'];
handler.tags = ['xp'];
handler.command = /^(daily|claim)$/i;

handler.cooldown = cooldown;

export default handler;

function toSimple(number) {
  if (isNaN(parseFloat(number))) return number;
  if (parseFloat(number) === 0) return '0';
  number = parseFloat(number).toFixed(0);
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'N', 'Dc', 'Ud', 'Dd', 'Td', 'Qua', 'Qui'];
  const base = 1000;
  const exponent = Math.floor(Math.log10(Math.abs(number)) / 3);
  const suffix = suffixes[exponent] || '';
  const simplified = number / Math.pow(base, exponent);
  const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 1 });
  return formatter.format(simplified) + suffix;
}
