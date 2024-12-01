import fetch from 'node-fetch';
import db from '../lib/database/index.js';

async function getChatGptResponse(user, prompt) {
  const apiKey = 'sk-dFN9P1oLtyfd0n7t2dB5Fd0342Ee44C981E14e9aAd96741f'; // Ganti dengan kunci API ChatGPT Anda
  const apiUrl = 'https://free.churchless.tech/v1/chat/completions'; // Pastikan Anda menggunakan URL yang benar untuk endpoint API ChatGPT

  let textcontent = `
Anda adalah FarizAI, kecerdasan buatan dari Fariz yang bertujuan untuk membantu dan mengarahkan sistem

FarizAI adalah AI yang berada dengan tugas utama untuk membantu para pengguna Fariz-Bot dalam menggunakan bot tersebut.
Bot ini memiliki berbagai macam fitur, baik untuk RPG hingga untuk fitur yang dapat di pakai sehari - hari.

Untuk membuka menu, harus ketik /menu (bagian "/" bisa juga diganti dengan ".", ";", dan lainnya)
`.trim()  
    
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo', // Ganti dengan model yang sesuai jika diperlukan
        'messages': [{'role': 'system', 'content': textcontent}, {'role': 'user', 'content': prompt}]
      })
    });

    const data = await response.json();

    if (data && data.choices && data.choices.length > 0) {
      const chatGptResponse = data.choices[0].message.content;
      return chatGptResponse;
    } else {
      return 'Maaf, saya tidak bisa memproses permintaan Anda.';
    }
  } catch (error) {
    console.error('Error saat berkomunikasi dengan API ChatGPT:', error);
    return 'Terjadi kesalahan saat berkomunikasi dengan server.';
  }
}

async function handler(m, { conn, text, usedPrefix, command }) {
  if (!text) {
    conn.reply(m.chat, `Anda harus menyertakan prompt untuk menggunakan perintah ini. Contoh: ${usedPrefix}an <prompt>`, m);
    return;
  }

  const prompt = text.trim();
  const who = m.sender;
  const user = await db.users.get(who);
  const response = await getChatGptResponse(user, prompt);
  conn.reply(m.chat, response, m);

  await db.users.update(who, (user) => {
    const prevMessages = user.autofarizplus || [];
    const allMessages = prevMessages.concat(prompt, response);
    user.autofarizplus = allMessages.slice(Math.max(allMessages.length - 10, 0));
  });
}

handler.help = ['aip', 'aiplus'];
handler.tags = ['ai'];
handler.command = /^(aip|aiplus)$/i;

export default handler;