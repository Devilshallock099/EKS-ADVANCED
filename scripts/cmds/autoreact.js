module.exports = {
  config: {
    name: "autoreact",
    version: "5.0.0",
    author: "SHALLOCK",
    role: 0,
    category: "system",
    shortDescription: "মেসেজের মুড বুঝে অটো রিয়েক্ট দিবে",
    longDescription: "এটি মেসেজ থেকে ইমোজি এবং টেক্সট কিউয়োর্ড ডিটেক্ট করে সঠিক রিয়েক্ট দেয়।"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const { messageID, body, senderID, threadID } = event;
      if (!messageID || !body || senderID === api.getCurrentUserID()) return;

      // 🛑 কুলডাউন প্রোটেকশন (যাতে বট পাগল না হয়ে যায়)
      global.__autoReactCooldown ??= {};
      if (global.__autoReactCooldown[threadID] && Date.now() - global.__autoReactCooldown[threadID] < 2000) return;
      global.__autoReactCooldown[threadID] = Date.now();

      const text = body.toLowerCase();
      let react = null;

      // 🧠 অ্যাডভ্যান্স কিউয়োর্ড ও রিয়েক্ট ম্যাপিং
      const triggers = [
        { keys: ["😂", "🤣", "হাসি", "haha", "lol", "xd", "হাসলি", "moja"], r: "😆" },
        { keys: ["😭", "😢", "🥺", "sad", "কান্না", "মন খারাপ", "cry", "ব্যথা"], r: "😢" },
        { keys: ["❤️", "🥰", "😍", "love", "ভালোবাসি", "ভালবাসি", "বাবু", "miss"], r: "❤️" },
        { keys: ["😡", "🤬", "রাগ", "angry", "কুত্তা", "শুয়োর", "শালা"], r: "😡" },
        { keys: ["😮", "😱", "wow", "omg", "অবাক", "কি?", "ki?"], r: "😮" },
        { keys: ["👍", "ok", "ঠিক", "হুম", "hmm", "okay", "yes"], r: "👍" },
        { keys: ["🔥", "💯", "সেরা", "best", "আগুন", "op", "nice"], r: "😎" },
        { keys: ["🎉", "🥳", "congrats", "অভিনন্দন", "বিয়া", "বিয়ে"], r: "🎉" }
      ];

      // লুপ চালিয়ে চেক করা
      for (const item of triggers) {
        if (item.keys.some(k => text.includes(k))) {
          react = item.r;
          break;
        }
      }

      if (!react) return;

      // 🕒 হিউম্যান-লাইক ডিলে (বট যে ভাবছে তা বোঝানোর জন্য)
      const delay = Math.floor(Math.random() * (1500 - 800 + 1)) + 800;
      await new Promise(res => setTimeout(res, delay));

      // ✅ রিয়েক্ট সেন্ড
      api.setMessageReaction(react, messageID, () => {}, true);

    } catch (err) {
      // সাইলেন্ট এরর হ্যান্ডলিং
    }
  }
};
