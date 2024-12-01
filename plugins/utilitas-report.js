async function handler(m, { conn, text }) {
    if (!text) return conn.reply(m.chat, 'Silakan masukkan hal yang ingin di request', m)
    let ownerNumber = '6282213162100@s.whatsapp.net'
    let ownerNumber2 = '6281319944687@s.whatsapp.net'
    let message = `Ada permintaan baru:\n\n${text}\n\nDari: *@${m.sender.split('@')[0]}*`
    await conn.reply(ownerNumber, message, m, { mentions: [m.sender] })
    await conn.reply(ownerNumber2, message, m, { mentions: [m.sender] })
    m.reply('Permintaan kamu telah terkirim ke owner, terima kasih!', null)
}

handler.help = ['request <hal yang ingin di request>']
handler.tags = ['utilitas']
handler.command = /^(saran|report)$/i

handler.disabled = false

export default handler