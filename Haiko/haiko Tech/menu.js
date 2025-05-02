import config from '../../config.cjs';

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('📑');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const menuText = `
╭─〔 *✦ HAIKO-MDX-V2 ✦* 〕─◆
│
│ ❂ *Owner*   : ${config.OWNER_NAME}
│ ❂ *User*      : ${m.pushName}
│ ❂ *Baileys*  : Multi Device
│ ❂ *Mode*     : ${mode}
│ ❂  *DEV*      : *MYSTIC HAIKO*
│ ❂ *Prefix*    : [${prefix}] ╰──────────────────

*✪WELCOME TO HAIKO-MDX✪*
━━━━━━━━━━━━━━━━━━━━

╭─〔 ✦ Download Menu ✦ 〕─◆
│ 𖣐 apk
│ 𖣐 facebook
│ 𖣐 mediafire
│ 𖣐 pinterestdl
│ 𖣐 gitclone
│ 𖣐 gdrive
│ 𖣐 insta
│ 𖣐 ytmp3
│ 𖣐 ytmp4
│ 𖣐 play
│ 𖣐 song
│ 𖣐 video
│ 𖣐 ytmp3doc
│ 𖣐 ytmp4doc
│ 𖣐 tiktok
╰──────────────────◆

╭─〔 ✦ Converter Menu ✦ 〕─◆
│ 𖣐 attp
│ 𖣐 attp2
│ 𖣐 attp3
│ 𖣐 ebinary
│ 𖣐 dbinary
│ 𖣐 emojimix
│ 𖣐 mp3
╰──────────────────◆

╭─〔 ✦ AI Menu ✦ 〕─◆
│ 𖣐 ai
│ 𖣐 bug
│ 𖣐 report
│ 𖣐 gpt
│ 𖣐 dalle
│ 𖣐 remini
│ 𖣐 gemini
╰──────────────────◆

╭─〔 ✦ Tools Menu ✦ 〕─◆
│ 𖣐 calculator
│ 𖣐 tempmail
│ 𖣐 checkmail
│ 𖣐 trt
│ 𖣐 tts
╰──────────────────◆

╭─〔 ✦ Group Menu ✦ 〕─◆
│ 𖣐 linkgc
│ 𖣐 setppgc
│ 𖣐 setname
│ 𖣐 setdesc
│ 𖣐 group
│ 𖣐 gcsetting
│ 𖣐 welcome
│ 𖣐 add
│ 𖣐 kick
│ 𖣐 kickall
│ 𖣐 promote
│ 𖣐 promoteall
│ 𖣐 demote
│ 𖣐 demoteall
│ 𖣐 hidetag
│ 𖣐 tagall
│ 𖣐 antilink
│ 𖣐 antitoxic
│ 𖣐 getbio
╰──────────────────◆

╭─〔 ✦ Search Menu ✦ 〕─◆
│ 𖣐 play
│ 𖣐 yts
│ 𖣐 imdb
│ 𖣐 google
│ 𖣐 gimage
│ 𖣐 pinterest
│ 𖣐 wallpaper
│ 𖣐 wikimedia
│ 𖣐 ytsearch
│ 𖣐 ringtone
│ 𖣐 lyrics
╰──────────────────◆

╭─〔 ✦ Main Menu ✦ 〕─◆
│ 𖣐 ping
│ 𖣐 alive
│ 𖣐 owner
│ 𖣐 menu
│ 𖣐 infobot
╰──────────────────◆

╭─〔 ✦ Owner Menu ✦ 〕─◆
│ 𖣐 join
│ 𖣐 leave
│ 𖣐 block
│ 𖣐 unblock
│ 𖣐 setppbot
│ 𖣐 anticall
│ 𖣐 setstatus
│ 𖣐 setnamebot
│ 𖣐 autotyping
│ 𖣐 alwaysonline
│ 𖣐 autoread
│ 𖣐 autosview
╰──────────────────◆

╭─〔 ✦ Stalk Menu ✦ 〕─◆
│ 𖣐 truecaller
│ 𖣐 instastalk
│ 𖣐 githubstalk
╰──────────────────◆

> ©BY MYSTIC HAIKO
`;

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/ln0h0u.jpg' },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "MYSTIC-HAIKO-TECH",
          newsletterJid: "120363397722863547@newsletter",
        },
      }
    }, { quoted: m });
  }
};

export default ping;
