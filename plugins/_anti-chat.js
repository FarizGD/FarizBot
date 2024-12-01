const forbiddenWords = ['hentai', 'bangsat', 'memek', 'kontol', 'tolol', 'ngentot', 'kontoi', 'penis', 'fuck', 'shit', 'bitch','wa.me', 'setting'] // daftar kata terlarang

export async function before(m, { conn, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true // abaikan pesan yang dikirim oleh bot itu sendiri
  if (!m.isGroup || !isBotAdmin) return true // terima pesan jika bukan pesan grup atau bot bukan admin grup
  if (m.text && forbiddenWords.some(word => m.text.toLowerCase().replace(/\s+/g, '').includes(word))) {
    await m.delete() // hapus pesan yang mengandung kata terlarang
    return false // tolak pesan
  }
  return true // terima pesan
}

handler.group = true
handler.botAdmin = true
