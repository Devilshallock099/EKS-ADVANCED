const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "emoji_voice",
    version: "3.0.0",
    author: "SHALLOCK",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: "ইমোজিতে ভয়েস এবং গালি দিলে কিক!",
    longDescription: "ইমোজি দিলে অডিও পাঠাবে এবং গালি দিলে সাথে সাথে কিক মারবে।"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, api, threadsData }) {
    const { body, senderID, threadID, messageID } = event;
    if (!body || senderID === api.getCurrentUserID()) return;

    // ==========================================
    // ১. গালি প্রোটেকশন সিস্টেম (Direct Kick)
    // ==========================================
    const badWords = ["চুতিয়া", "কুত্তা", "শুয়োর", "শালা", "হারামি", "মাদারচুদ", "খানকি", "বাল", "চুদি"];
    const text = body.toLowerCase();
    
    if (badWords.some(word => text.includes(word))) {
      try {
        // মেসেজ ডিলিট
        api.unsendMessage(messageID);
        
        // কিক মেসেজ
        await message.send({
          body: `🚫 𝗗𝗶𝗿𝗲𝗰𝘁 𝗞𝗶𝗰𝗸!\n━━━━━━━━━━━━━━━━━━\nঐ বেয়াদব! মুখে লাগাম নাই? ওনারকে বা গ্রুপে গালি দেওয়ার সাহস কই পাস? \n\n👤 অপরাধী: @${senderID}\n❌ অপরাধ: গালিগালাজ\n🔨 শাস্তি: চিরস্থায়ী বহিষ্কার!\n━━━━━━━━━━━━━━━━━━\n👑 𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗲𝗱 𝗯𝘆: SHALLOCK`,
          mentions: [{ tag: senderID, id: senderID }]
        });

        // কিক মারা
        return api.removeUserFromGroup(senderID, threadID);
      } catch (err) {
        return message.reply("⚠️ এই আবালরে কিক মারতে পারছি না, আমাকে এডমিন দাও!");
      }
    }

    // ==========================================
    // ২. ইমোজি ভয়েস সিস্টেম
    // ==========================================
    if (body.length > 2) return;

    const emojiAudioMap =  {
      "🥱": ["https://files.catbox.moe/9pou40.mp3","https://files.catbox.moe/60cwcg.mp3"],
      "😁": ["https://files.catbox.moe/60cwcg.mp3"],
      "😌": ["https://files.catbox.moe/epqwbx.mp3"],
      "🥺": ["https://files.catbox.moe/wc17iq.mp3","https://files.catbox.moe/dv9why.mp3"],
      "🤭": ["https://files.catbox.moe/cu0mpy.mp3"],
      "😅": ["https://files.catbox.moe/jl3pzb.mp3"],
      "😏": ["https://files.catbox.moe/z9e52r.mp3"],
      "😞": ["https://files.catbox.moe/tdimtx.mp3"],
      "🤫": ["https://files.catbox.moe/0uii99.mp3"],
      "🍼": ["https://files.catbox.moe/p6ht91.mp3"],
      "🤔": ["https://files.catbox.moe/hy6m6w.mp3"],
      "🥰": ["https://files.catbox.moe/dv9why.mp3"],
      "🤦": ["https://files.catbox.moe/ivlvoq.mp3"],
      "😘": ["https://files.catbox.moe/sbws0w.mp3","https://files.catbox.moe/37dqpx.mp3"],
      "😑": ["https://files.catbox.moe/p78xfw.mp3"],
      "😢": ["https://files.catbox.moe/shxwj1.mp3"],
      "🙊": ["https://files.catbox.moe/3bejxv.mp3"],
      "🤨": ["https://files.catbox.moe/4aci0r.mp3"],
      "😡": ["https://files.catbox.moe/shxwj1.mp3","https://files.catbox.moe/h9ekli.mp3"],
      "🤬": ["https://files.catbox.moe/shxwj1.mp3","https://files.catbox.moe/h9ekli.mp3"],
      "🙈": ["https://files.catbox.moe/3qc90y.mp3"],
      "😍": ["https://files.catbox.moe/qjfk1b.mp3"],
      "😭": ["https://files.catbox.moe/itm4g0.mp3"],
      "😱": ["https://files.catbox.moe/mu0kka.mp3"],
      "😻": ["https://files.catbox.moe/y8ul2j.mp3"],
      "😿": ["https://files.catbox.moe/tqxemm.mp3"],
      "💔": ["https://files.catbox.moe/6yanv3.mp3"],
      "🤣": ["https://files.catbox.moe/2sweut.mp3","https://files.catbox.moe/jl3pzb.mp3"],
      "🥹": ["https://files.catbox.moe/jf85xe.mp3"],
      "😩": ["https://files.catbox.moe/b4m5aj.mp3"],
      "🫣": ["https://files.catbox.moe/ttb6hi.mp3"],
      "🐸": ["https://files.catbox.moe/utl83s.mp3","https://files.catbox.moe/sg6ugl.mp3"],
      "💋": ["https://files.catbox.moe/37dqpx.mp3"],
      "🫦": ["https://files.catbox.moe/61w3i0.mp3"],
      "😴": ["https://files.catbox.moe/rm5ozj.mp3"],
      "🙏": ["https://files.catbox.moe/7avi7u.mp3"],
      "😼": ["https://files.catbox.moe/4oz916.mp3"],
      "🖕": ["https://files.catbox.moe/593u3j.mp3","https://files.catbox.moe/dtua60.mp3"],
      "🥵": ["https://files.catbox.moe/l90704.mp3"],
      "🙂": ["https://files.catbox.moe/4oks08.mp3"],
      "😒": ["https://files.catbox.moe/mt5il0.mp3"],
      "😓": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🤧": ["https://files.catbox.moe/zh3mdg.mp3"],
      "🙄": ["https://files.catbox.moe/vgzkeu.mp3"]

    } ;

    const emoji = body.trim();
    const audioList = emojiAudioMap[emoji];
    if (!audioList) return;

    const audioUrl = audioList[Math.floor(Math.random() * audioList.length)];
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    const filePath = path.join(cacheDir, `${Date.now()}.mp3`);

    try {
      const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data));

      await message.reply({ attachment: fs.createReadStream(filePath) });
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
    }
  }
};
