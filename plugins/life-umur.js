import db from '../lib/database/index.js'

let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  const user = await db.users.get(m.sender)

  if (user.verified == true) {
    m.reply(`Kamu sudah terverifikasi ☑️, tidak bisa ganti umur 🎂\nHubungi wa.me/6282213162100 untuk mengganti`)
    return
  }

  if (!text) {
    m.reply('❗ Mohon masukkan umur Anda.')
    return
  }

  // Cek apakah pengguna sudah menentukan umur sebelumnya
  if (user.umur != '-' && isPrems == false && user.gamepass < 1) {
    m.reply('❗ Umur hanya bisa diatur satu kali saja.\n💳 atau gunakan gamepass')
    return
  }

  // Memeriksa apakah input hanya berupa angka
  if (isNaN(text)) {
    m.reply('❗ Mohon masukkan umur dalam bentuk angka.')
    return
  }

  // Memeriksa apakah umur kurang dari 6
  if (parseInt(text) < 6) {
    m.reply('❗ Maaf, Anda terlalu muda untuk menggunakan bot ini.')
    return
  }

  // Memeriksa apakah umur lebih dari 99
  if (parseInt(text) > 99) {
    m.reply('❗ Maaf, Anda terlalu tua untuk menggunakan bot ini.')
    return
  }

  // Set umur pengguna
  await db.users.update(m.sender, (userData) => {
    userData.umur = text.trim()
  })
  m.reply(`✅ Umur Anda berhasil diatur menjadi *${text.trim()}*.`)

  if (user.gamepass >= 1 && isPrems == false && user.umur != '-') {
    await db.users.update(m.sender, (userData) => {
      userData.gamepass -= 1
    })
    m.reply('-1 💳 gamepass')
  }
}

handler.help = ['setumur <umur>']
handler.tags = ['life']
handler.command = /^setumur|setage$/i

export default handler
