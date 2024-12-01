import fetch from 'node-fetch';

let handler = async (m, { conn, args, isROwner }) => {

  if (!args[0]) throw 'Silakan masukkan URL yang akan discreenshot!';

  let url = args[0];

  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }

  let encodedUrl = encodeURIComponent(url);
  let apikey = '34153f4eaeb4410f95a39249b6054cab';

  // tambahan opsi penundaan
  let delay = args[1] ? parseInt(args[1]) : 0; // ambil opsi penundaan dalam detik
  let waitUntil = delay > 0 ? `&wait_until=page_loaded&delay=${delay * 1000}` : ''; // konversi ke milidetik

  let apiurl = `https://api.apiflash.com/v1/urltoimage?access_key=${apikey}${waitUntil}&url=${encodedUrl}`;

  let res = await fetch(apiurl);

  if (!res.ok) throw 'Terjadi kesalahan saat mengambil screenshot!';

  let buffer = await res.buffer();
  conn.sendFile(m.chat, buffer, 'screenshot.png', 'Berikut adalah screenshot dari halaman web yang diminta.');

};

handler.help = ['screenshot <url>', 'ss <url>'];

handler.tags = ['internet'];

handler.command = /^(screenshot|ss)$/i;

export default handler;
