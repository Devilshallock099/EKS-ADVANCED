const { getTime } = global.utils;

module.exports = {
  config: {
    name: "logsbot",
    isBot: true,
    version: "2.0",
    author: "SHALLOCK",
    envConfig: {
      allow: true
    },
    category: "events"
  },

  onStart: async ({ usersData, threadsData, event, api }) => {
    const botID = api.getCurrentUserID();
    if (
      (event.logMessageType == "log:subscribe" && event.logMessageData.addedParticipants.some(item => item.userFbId == botID))
      || (event.logMessageType == "log:unsubscribe" && event.logMessageData.leftParticipantFbId == botID)
    ) return async function () {
      
      const { author, threadID } = event;
      if (author == botID) return;

      let msg = "🔔 === 𝗕𝗢𝗧 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗬 𝗟𝗢𝗚 === 🔔\n━━━━━━━━━━━━━━━━━━";
      let threadName;
      const { config } = global.GoatBot;

      if (event.logMessageType == "log:subscribe") {
        threadName = (await api.getThreadInfo(threadID)).threadName || "Unknown Group";
        const authorName = await usersData.getName(author);
        msg += `\n✅ 𝗡𝗲𝘄 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗱𝗲𝗱\n- অ্যাড করেছে: ${authorName}\n- আইডি: ${author}`;
      }
      else if (event.logMessageType == "log:unsubscribe") {
        const threadData = await threadsData.get(threadID);
        threadName = threadData.threadName || "Unknown Group";
        const authorName = await usersData.getName(author);
        msg += `\n❌ 𝗕𝗼𝘁 𝗞𝗶𝗰𝗸𝗲𝗱 𝗢𝘂𝘁\n- কিক মেরেছে: ${authorName}\n- আইডি: ${author}`;
      }

      const time = getTime("DD/MM/YYYY | hh:mm:ss A");
      msg += `\n\n🏢 গ্রুপ: ${threadName}\n🆔 গ্রুপ আইডি: ${threadID}\n⏰ সময়: ${time}\n━━━━━━━━━━━━━━━━━━\n👑 𝗢𝘄𝗻𝗲𝗿: SHALLOCK`;

      // এডমিনদের মেসেজ পাঠানো
      for (const adminID of config.adminBot) {
        api.sendMessage(msg, adminID);
      }
    };
  }
};
