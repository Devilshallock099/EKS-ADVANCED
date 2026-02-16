module.exports = {
  config: {
    name: "anti-toxic",
    version: "2.5.0",
    author: "SHALLOCK",
    role: 0,
    category: "system",
    shortDescription: "গালি দিলে অটোমেটিক ওয়ার্নিং ও কিক দিবে",
    longDescription: "গ্রুপে কেউ গালি দিলে বট তাকে শনাক্ত করে এবং ৩ বার ওয়ার্নিং পূর্ণ হলে কিক মারে।"
  },

  onStart: async function () {},

  onChat: async function ({ api, event, threadsData, message }) {
    try {
      const { body, senderID, threadID, messageID } = event;
      if (!body || senderID === api.getCurrentUserID()) return;

      // ❌ গালি বা খারাপ শব্দের লিস্ট (এখানে আপনি আরো যোগ করতে পারেন)
      const badWords = ["চুতিয়া", "কুত্তা", "শুয়োর", "শালা", "হারামি", "মাদারচুদ", "খানকি", "বাল", "চুদি" , "madarcud" , "khanki" "magi" , " মাগী " , "তোর মারে"];
      
      const text = body.toLowerCase();
      const hasBadWord = badWords.some(word => text.includes(word));

      if (hasBadWord) {
        // ১. মেসেজ ডিলিট করার চেষ্টা (বট এডমিন থাকলে কাজ করবে)
        api.unsendMessage(messageID);

        // ২. ওয়ার্নিং ডাটাবেস আপডেট
        const threadData = await threadsData.get(threadID);
        const data = threadData.data || {};
        const warnList = data.warn || [];

        let userWarn = warnList.find(i => i.userID == senderID);

        if (!userWarn) {
          userWarn = { userID: senderID, count: 1 };
          warnList.push(userWarn);
        } else {
          userWarn.count++;
        }

        // ৩. ডাটাবেস সেভ
        data.warn = warnList;
        await threadsData.setData(threadID, { data });

        const remaining = 3 - userWarn.count;

        // ৪. কিক মারার লজিক
        if (userWarn.count >= 3) {
          // ৩ বার পূর্ণ হলে কিক
          message.send({
            body: `🚫 সীমা অতিক্রম করেছেন!\nবারবার গালি দেওয়ার অপরাধে আপনাকে গ্রুপ থেকে কিক মারা হলো। বাই বাই! 👋`,
            mentions: [{ tag: "User", id: senderID }]
          });
          
          // ওয়ার্নিং রিসেট করে কিক মারা
          userWarn.count = 0;
          await threadsData.setData(threadID, { data });
          
          return api.removeUserFromGroup(senderID, threadID);
        } else {
          // ওয়ার্নিং মেসেজ
          return message.reply({
            body: `⚠️ [ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 ] ⚠️\n━━━━━━━━━━━━━━━━━━\nঐ বেয়াদব! গ্রুপে গালি দেওয়া নিষেধ।\n\n👤 অপরাধী: @${senderID}\n❌ অপরাধ: গালি ব্যবহার করা\n📉 ওয়ার্নিং বাকি: ${remaining} বার\n━━━━━━━━━━━━━━━━━━\n👑 𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗲𝗱 𝗯𝘆: SHALLOCK`,
            mentions: [{ tag: senderID, id: senderID }]
          });
        }
      }

    } catch (err) {
      // সাইলেন্ট এরর
    }
  }
};
        
