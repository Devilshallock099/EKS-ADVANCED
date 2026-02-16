const { getTime } = global.utils;

module.exports = {
  config: {
    name: "autoinvite",
    version: "3.0",
    author: "SHALLOCK",
    category: "events"
  },

  onStart: async ({ api, event, usersData, message }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;
    const leftID = logMessageData.leftParticipantFbId;

    // যদি কেউ নিজে লিভ নেয়
    if (leftID === author) {
      const userData = await usersData.get(leftID);
      const userName = userData.name;
      const gender = userData.gender; // 1 = Female, 2 = Male

      // Bold Text Converter
      const boldMap = {
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
        K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
        U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
        a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷",
        k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁",
        u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇"
      };
      const boldName = userName.split("").map(c => boldMap[c] || c).join("");

      // র্যান্ডম ডায়ালগ লিস্ট
      const maleDialogs = [
        "ঐ আবাল! লিভ নেওয়া কি তোর বিয়ার দাওয়াত? 🐸",
        "লিভ নিয়া কই যাবি? আমি থাকতে পালানোর পথ নাই! 😂",
        "এই মুরগি আবার চইলা আইছে! লিভ নিলে কিন্তু ঠ্যাং ভাইঙ্গা দিমু। 🔪"
      ];
      
      const femaleDialogs = [
        "ঐ ঢংগি! লিভ নিয়া ভাব দেখাও কেন? 🙄",
        "যাইবা কই সুন্দরী?SHALLOCK এর গ্রুপে ঢোকা সহজ, বের হওয়া না! 💃",
        "আবার ব্যাক করায় দিলাম। লিভ নিয়া ইমপ্রেশন ঝাড়ার দরকার নাই। 💅"
      ];

      const randomMale = maleDialogs[Math.floor(Math.random() * maleDialogs.length)];
      const randomFemale = femaleDialogs[Math.floor(Math.random() * femaleDialogs.length)];
      
      const replyMsg = (gender == 1) ? randomFemale : randomMale;

      const form = {
        body: `⚠️ 𝗔𝗹𝗲𝗿𝘁! 𝗦𝗼𝗺𝗲𝗼𝗻𝗲 𝗧𝗿𝗶𝗲𝗱 𝘁𝗼 𝗘𝘀𝗰𝗮𝗽𝗲! 🏃‍♂️💨\n\n👤 𝗡𝗮𝗺𝗲: ${boldName}\n💬 ${replyMsg}\n\n👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: SHALLOCK 💎`,
        mentions: [{ tag: userName, id: leftID }]
      };

      try {
        // আবার গ্রুপে অ্যাড করা
        await api.addUserToGroup(leftID, threadID);
        // মেসেজ পাঠানো
        await message.send(form);
      } catch (err) {
        message.send(`❌ ${boldName}-রে অ্যাড করতে পারলাম না! হয়তো ও আমায় ব্লক দিছে বা ওর সেটিংস অফ। মুরগিটা বেঁচে গেল! 😒`);
      }
    }
  }
};
