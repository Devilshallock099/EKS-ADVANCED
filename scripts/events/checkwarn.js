module.exports = {
  config: {
    name: "checkwarn",
    version: "2.0",
    author: "SHALLOCK",
    category: "events"
  },

  langs: {
    en: {
      warn: "🛑 𝗔𝗟𝗘𝗥𝗧: 𝗕𝗔𝗡𝗡𝗘𝗗 𝗠𝗘𝗠𝗕𝗘𝗥 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗!\n━━━━━━━━━━━━━━━━━━━\n👤 নাম: %1\n🆔 আইডি: %2\n⚠️ অপরাধ: ইতিপূর্বে ৩ বার ওয়ার্নিং খেয়েছেন।\n🚫 অবস্থা: এই গ্রুপে আপনার প্রবেশ নিষিদ্ধ!\n━━━━━━━━━━━━━━━━━━━\n🛠 আনব্যান করতে ওনারকে বলুন।\n👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : SHALLOCK",
      needPermission: "⚠️ আমাকে গ্রুপের এডমিন বানান, নয়তো আমি এই অপরাধীকে বের করতে পারবো না!"
    }
  },

  onStart: async ({ threadsData, message, event, api, globalData, getLang }) => {
    if (event.logMessageType == "log:subscribe") {
      const { threadID } = event;
      const threadData = await threadsData.get(threadID);
      const { data } = threadData;
      
      // ওয়ার্নিং লিস্ট চেক
      const warnList = data.warn || [];
      const { addedParticipants } = event.logMessageData;

      for (const user of addedParticipants) {
        const userID = user.userFbId;
        const userName = user.fullName;

        // ইউজারের ওয়ার্নিং কাউন্ট দেখা
        const findUser = warnList.find(i => i.userID == userID);

        if (findUser && findUser.list.length >= 3) {
          const form = {
            body: getLang("warn", userName, userID),
            mentions: [{ tag: userName, id: userID }]
          };

          // মেসেজ পাঠিয়ে কিক মারা
          return message.send(form, () => {
            api.removeUserFromGroup(userID, threadID, (err) => {
              if (err) return message.send(getLang("needPermission"));
            });
          });
        }
      }
    }
  }
};
