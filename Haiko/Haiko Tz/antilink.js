import { serialize } from '../../lib/Serializer.js';
import config from '../../config.cjs';

const antilinkSettings = {}; // { groupId: { antilink: false, action: null, warnings: {} } }

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const contextInfoHans = {
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "MYSTIC-HAIKO-TECH",
                newsletterJid: "120363397722863547@newsletter",
            },
        }
    };

    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (!antilinkSettings[m.from]) {
        antilinkSettings[m.from] = { antilink: false, action: null, warnings: {} };
    }

    if (cmd === 'antilink') {
        if (!m.isGroup) return await sock.sendMessage(m.from, { text: `━━⚠️ *Group Only Command* ⚠️━━`, ...contextInfoHans }, { quoted: m });
        if (!isBotAdmins) return await sock.sendMessage(m.from, { text: `━━⚠️ *I need admin permission to work!* ⚠️━━`, ...contextInfoHans }, { quoted: m });
        if (!isAdmins) return await sock.sendMessage(m.from, { text: `━━⚠️ *Only Admins can use Antilink settings!* ⚠️━━`, ...contextInfoHans }, { quoted: m });

        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const subcmd = args[0] ? args[0].toLowerCase() : '';

        if (subcmd === 'on') {
            antilinkSettings[m.from].antilink = true;
            antilinkSettings[m.from].action = null;
            return await sock.sendMessage(m.from, {
                text: `━⚡ *Haiko Mdx AntiLink Activated* ⚡━\n` +
                      `> 🔹 Choose an action:\n` +
                      `> 🚫 ${prefix}antilink action delete 📌only for delete\n` +
                      `> ⚠️ ${prefix}antilink action warn 📌for warning 4 to kick\n` +
                      `> 🚪 ${prefix}antilink action kick 📌for kick user\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━`,
                ...contextInfoHans
            }, { quoted: m });
        }

        if (subcmd === 'off') {
            antilinkSettings[m.from].antilink = false;
            antilinkSettings[m.from].action = null;
            antilinkSettings[m.from].warnings = {};
            return await sock.sendMessage(m.from, {
                text: `━❌ *Haiko Mdx Antilink Deactivated* ❌━`,
                ...contextInfoHans
            }, { quoted: m });
        }

        if (subcmd === 'action') {
            if (!antilinkSettings[m.from].antilink) {
                return await sock.sendMessage(m.from, {
                    text: `━━⚠️ *Antilink is OFF*\n> Please turn on using ${prefix}antilink on ⚠️━━`,
                    ...contextInfoHans
                }, { quoted: m });
            }

            const actionType = args[1] ? args[1].toLowerCase() : '';
            if (['delete', 'warn', 'kick'].includes(actionType)) {
                antilinkSettings[m.from].action = actionType;
                return await sock.sendMessage(m.from, {
                    text: `━━✅ *Antilink action set to ${actionType.toUpperCase()}* ✅━━`,
                    ...contextInfoHans
                }, { quoted: m });
            } else {
                return await sock.sendMessage(m.from, {
                    text: `━━⚡ *Invalid Action!*\n> 🚫 ${prefix}antilink action delete\n> ⚠️ ${prefix}antilink action warn\n> 🚪 ${prefix}antilink action kick ⚡━━`,
                    ...contextInfoHans
                }, { quoted: m });
            }
        }

        return await sock.sendMessage(m.from, {
            text: `━━📌 *Haiko Mdx Antilink Usage:*\n> ${prefix}antilink on\n> ${prefix}antilink off\n> ${prefix}antilink action delete | warn | kick 📌━━`,
            ...contextInfoHans
        }, { quoted: m });
    }

    // Detect Links if antilink is ON
    if (antilinkSettings[m.from].antilink && m.body && m.body.match(/https?:\/\/[^\s]+/)) {
        if (!isBotAdmins) return;

        let gclink = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.from)}`;
        let isLinkThisGc = new RegExp(gclink, 'i');
        let isgclink = isLinkThisGc.test(m.body);

        if (isgclink) return await sock.sendMessage(m.from, {
            text: `━━✅ *Own Group Link Detected, Safe!* ✅━━`,
            ...contextInfoHans
        });

        if (isAdmins || isCreator) return await sock.sendMessage(m.from, {
            text: `━━✅ *Admin Message, Ignored!* ✅━━`,
            ...contextInfoHans
        });

        // Action based
        const action = antilinkSettings[m.from].action;

        if (!action) {
            return await sock.sendMessage(m.from, {
                text: `━━⚡ *No Action Set!*\n> Set action using:\n> 🚫 ${prefix}antilink action delete\n> ⚠️ ${prefix}antilink action warn\n> 🚪 ${prefix}antilink action kick ⚡━━`,
                ...contextInfoHans
            }, { quoted: m });
        }

        await sock.sendMessage(m.from, { delete: m.key });

        if (action === 'delete') {
            return await sock.sendMessage(m.from, {
                text: `━━🚫 *@${m.sender.split('@')[0]} Link detected and deleted!* 🚫━━`,
                mentions: [m.sender],
                ...contextInfoHans
            }, { quoted: m });
        }

        if (action === 'warn') {
            if (!antilinkSettings[m.from].warnings[m.sender]) {
                antilinkSettings[m.from].warnings[m.sender] = 0;
            }
            antilinkSettings[m.from].warnings[m.sender] += 1;

            const userWarnings = antilinkSettings[m.from].warnings[m.sender];
            const maxWarnings = config.ANTILINK_WARNINGS || 4;

            if (userWarnings >= maxWarnings) {
                await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove');
                delete antilinkSettings[m.from].warnings[m.sender];
                return await sock.sendMessage(m.from, {
                    text: `━━🚪 *@${m.sender.split('@')[0]} kicked after 4 warnings!* 🚪━━`,
                    mentions: [m.sender],
                    ...contextInfoHans
                });
            } else {
                return await sock.sendMessage(m.from, {
                    text: `━━⚠️ *Warning ${userWarnings}/4*\n@${m.sender.split('@')[0]} Links are not allowed! ⚠️━━`,
                    mentions: [m.sender],
                    ...contextInfoHans
                }, { quoted: m });
            }
        }

        if (action === 'kick') {
            await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove');
            return await sock.sendMessage(m.from, {
                text: `━━🚪 *@${m.sender.split('@')[0]} kicked for sending a link!* 🚪━━`,
                mentions: [m.sender],
                ...contextInfoHans
            }, { quoted: m });
        }
    }
};

                                          
