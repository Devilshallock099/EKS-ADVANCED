const axios = require('axios');

module.exports = {
  config: {
    name: "activemember",
    aliases: ["am", "top"],
    version: "2.0",
    author: "SHALLOCK",
    countDown: 10,
    role: 0,
    shortDescription: "গ্রুপের শীর্ষ ১৫ জন সক্রিয় মেম্বার দেখুন",
    longDescription: "গত ১০০০টি মেসেজ বিশ্লেষণ করে সবচেয়ে সক্রিয় ১৫ জন মেম্বার খুঁজে বের করে।",
    category: "box chat",
    guide: "{pn}",
  },
  
  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const { participantIDs } = threadInfo;
      
      // গত ১০০০ মেসেজ ফেচ করা
      const history = await api.getThreadHistory(threadID, 1000);
      
      const messageCounts = {};
      let totalMessages = 0;

      // মেসেজ কাউন্ট করা
      history.forEach(msg => {
        const sender = msg.senderID;
        if (participantIDs.includes(sender)) {
          messageCounts[sender] = (messageCounts[sender] || 0) + 1;
          totalMessages++;
        }
      });

      // সর্টিং (বেশি থেকে কম)
      const topUsers = Object.entries(messageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

      if (topUsers.length === 0) {
        return message.reply("⚠️ পর্যাপ্ত মেসেজ ডেটা পাওয়া যায়নি!");
      }

      let responseMsg = `🏆 === [ 𝗧𝗢𝗣 𝗔𝗖𝗧𝗜𝗩𝗘 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 ] === 🏆\n━━━━━━━━━━━━━━━━━━━━\n📊 গত ১০০০ মেসেজের রিপোর্ট:\n`;

      for (let i = 0; i < topUsers.length; i++) {
        const [userID, count] = topUsers[i];
        const userInfo = await api.getUserInfo(userID);
        const name = userInfo[userID].name;
        const percentage = ((count / totalMessages) * 100).toFixed(1);
        
        // মেডেল ইমোজি
        const rankEmoji = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
        
        responseMsg += `\n${rankEmoji} ${i + 1}. ${name}\n💬 মেসেজ: ${count} (${percentage}%)\n`;
      }

      responseMsg += `\n━━━━━━━━━━━━━━━━━━━━\n👑 𝗢𝘄𝗻𝗲𝗿: SHALLOCK 💎`;

      api.sendMessage(responseMsg, threadID);

    } catch (error) {
      console.error(error);
      message.reply("🥹 উফ! ডেটা সংগ্রহ করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    }
  },
};
