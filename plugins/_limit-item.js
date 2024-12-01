import db from '../lib/database/index.js'

export async function all(m) {
    let user = await db.users.get(m.sender)

    if (user) {
        let followers = Object.entries(await db.users.get()).filter(([key, data]) => (data.following || []).includes(m.sender)).map(([key, data]) => key)
        await db.users.update(m.sender, (user) => {
            user.followers = followers.length
        });

        if (!m.message)
            return

        await db.users.update(m.sender, (user) => {
            user.protection = (user.defense * user.psychic) / (user.strength / 10)
        });

        if (user.luck > 100) {
            await db.users.update(m.sender, (user) => {
                user.luck = 100
            });
        }
        
        if (user.health > 100) {
            await db.users.update(m.sender, (user) => {
                user.health = 100
            });
        }

        const items = [
            'money', 'coinly', 'potion', 'keping', 
            'sphere', 'elixir', 'trash', 'wood',
            'rock', 'string', 'pet', 'iron',
            'gold', 'diamond', 'emerald', 'orb', 'common',
            'rare', 'mythic', 'legendary',
            'safana', 'luxury', 'car', 'fuel', 'crypto', 
            'bruh', 'lona', 'loana', 'rivena', 'aurora', 'safari', 'ducky',
            'cashly', 'cardly', 'gamepass', 
            'phone', 'smartphone', 'aranara',
            'vcoin', 'scoin', 'auricore',
            'kentang', 'burger', 'pizza',
            'gmoney', 'credit', 'rupiah', 'gems',
            'ironore', 'goldore', 'diamondore', 'ancientdebris', 'pickaxe', 
        ]

        if (user.health <= 0) {
            for (let i = 0; i < items.length; i++) {
                await db.users.update(m.sender, (user) => {
                    user[items[i]] = Math.floor(user[items[i]] * 8 / 10)
                });
            }
            await db.users.update(m.sender, (user) => {
                user.health = 10
                user.death += 1
            });
            m.reply('Kamu kehabisan darah dan 💀 meninggal\nMeregenerasi ❤️‍🩹 Health kembali 🍎')
        }

        if (!(new Date() - user.lastluck < 604800000) && (user.luck > 0) && (user.luck <= 10)) {
            await db.users.update(m.sender, (user) => {
                user.luck -= 1
            });
        }

        if ((+new Date() + 21 * 24 * 60 * 60 * 1000) < user.lasteat) {
            await db.users.update(m.sender, (user) => {
                user.lasteat = +new Date() + 21 * 24 * 60 * 60 * 1000
            });
        }

        if ((+new Date() >= user.lasteat) && (user.level > 10)) {
            for (let i = 0; i < items.length; i++) {
                await db.users.update(m.sender, (user) => {
                    user[items[i]] = Math.floor(user[items[i]] * 1 / 10)
                });
            }
            await db.users.update(m.sender, (user) => {
                user.health = 10
                user.death += 1
                user.lasteat = +new Date() + 7 * 24 * 60 * 60 * 1000
            });
            m.reply('Kamu mati kelaparan dan 💀 meninggal')
        }

        if (user.location === 'homebase') {
            await db.users.update(m.sender, (user) => {
                user.strength_multiplier_extra = 1
                user.defense_multiplier_extra = 1
                user.psychic_multiplier_extra = 1
                user.speed_multiplier_extra = 1
            });
        }
    }
}