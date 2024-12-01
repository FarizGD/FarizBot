const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let tutorial = `
❖ ===================== ❖ ➦
Hai! Selamat datang di tutorial untuk mempelajari cara bermain game di FarizBot! 🤖🎮

Sebelum memulai permainan, disarankan untuk menyetel profile terlebih dahulu dengan perintah /set. 🧑‍🤝‍🧑
❖ ===================== ❖ ➥

${readMore}Mari mulai dengan yang pertama, yaitu uang dasar yang dibutuhkan di semua tempat dengan perintah /coinly. Setiap kali kamu mengirim pesan /coinly ke FarizBot baik di grup maupun secara pribadi, kamu akan mendapatkan 1 coinly! 💰

Dalam FarizBot, kamu dapat melihat inventaris dengan perintah /inventory atau /inv. Jangan lupa juga ada sistem jual beli (shop) yang dapat ditemukan melalui perintah /buy, /cbuy, /pbuy, dan lainnya! 💸🛍️

Ayo mainkan game di FarizBot dan jangan lupa untuk mengikuti tutorial selanjutnya! 🤗

${readMore}◈ *=====================* ◈
Berikut adalah daftar perintah (RPG) yang dapat kamu gunakan di FarizBot: 📜🎲

 • /adventure ~ Berpetualangan untuk mendapatkan item dan uang
 • /blackjack <number> ~ Untuk berjudi coinly
 • /check <@tag> ~ Melihat inventaris orang lain
 • /daily ~ Mendapatkan hadiah harian
 • /enchant ~ Mendapatkan item langka
 • /eat ~ Untuk makan
 • /hatch ~ Menetaskan kandang hewan
 • /judi <number> ~ Untuk berjudi uang
 • /shop ~ Toko untuk jual beli barang
 • /quest ~ Tantangan dan misi untuk mendapatkan hadiah
 • /open ~ Membuka kandang (sumber penghasilan utama di awal game)
Yuk, mainkan permainan RPG di FarizBot dan nikmati keseruannya! 🤩🎮
◈ *=====================* ◈
`.trim()

    m.reply(tutorial)
}

handler.help = ['tutorial']
handler.tags = ['rpg']
handler.command = /^(tutorial)/i

export default handler