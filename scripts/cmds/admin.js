const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "2.0",
		author: "SHALLOCK",
		countDown: 5,
		role: 2, // শুধুমাত্র মেইন অ্যাডমিনরাই এই কমান্ড ব্যবহার করতে পারবে
		category: "system",
		guide: {
			en: '   {pn} add <uid | @tag>: বট অ্যাডমিন নিয়োগ করুন'
				+ '\n	  {pn} remove <uid | @tag>: বট অ্যাডমিন থেকে বরখাস্ত করুন'
				+ '\n	  {pn} list: বর্তমান বট অ্যাডমিনদের তালিকা দেখুন'
		}
	},

	langs: {
		en: {
			added: "✅ | অভিনন্দন! %1 জনকে নতুন বট অ্যাডমিন হিসেবে নিয়োগ দেওয়া হয়েছে:\n%2",
			alreadyAdmin: "\n⚠️ | %1 জন আগে থেকেই বট অ্যাডমিন হিসেবে আছেন:\n%2",
			missingIdAdd: "⚠️ | কাকে অ্যাডমিন বানাতে চান? তার আইডি দিন বা তাকে মেনশন করুন।",
			removed: "✅ | সফলভাবে %1 জনকে বট অ্যাডমিন পদ থেকে সরিয়ে দেওয়া হয়েছে:\n%2",
			notAdmin: "⚠️ | %1 জন মেম্বার আমাদের অ্যাডমিন লিস্টেই নেই:\n%2",
			missingIdRemove: "⚠️ | কাকে সরাতে চান? তার আইডি দিন বা তাকে মেনশন করুন।",
			listAdmin: "👑 === [ 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡 𝗟𝗜𝗦𝗧 ] === 👑\n━━━━━━━━━━━━━━━━━━\n%1\n━━━━━━━━━━━━━━━━━━\n🛠 𝗢𝘄𝗻𝗲𝗿: SHALLOCK"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1] || event.messageReply) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.filter(u => notAdminIds.includes(u.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r": {
				if (args[1] || event.messageReply) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name}`).join("\n")));
			}
			default:
				return message.reply("❌ ভুল কমান্ড! সঠিক ব্যবহার: admin [add|remove|list]");
		}
	}
};
