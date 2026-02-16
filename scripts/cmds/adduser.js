const { findUid } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
	config: {
		name: "adduser",
		version: "2.0",
		author: "SHALLOCK",
		countDown: 5,
		role: 0, // সবাই ব্যবহার করতে পারবে (যদি গ্রুপের সেটিংস এলাও করে)
		category: "box chat",
		guide: {
			en: "   {pn} [লিঙ্ক অথবা আইডি]"
		}
	},

	langs: {
		en: {
			alreadyInGroup: "আগে থেকেই গ্রুপে আছে",
			successAdd: "✅ সফলভাবে %1 জন মেম্বারকে অ্যাড করা হয়েছে।",
			failedAdd: "❌ %1 জন মেম্বারকে অ্যাড করা যায়নি।",
			approve: "⏳ %1 জন মেম্বারকে অ্যাপ্রুভাল লিস্টে রাখা হয়েছে।",
			invalidLink: "ভুল লিঙ্ক দিয়েছেন!",
			cannotGetUid: "ইউআইডি (UID) খুঁজে পাওয়া যায়নি।",
			linkNotExist: "এই ফেসবুক প্রোফাইলটির অস্তিত্ব নেই।",
			cannotAddUser: "বট ব্লক আছে অথবা ইউজারটি প্রাইভেসি দিয়ে রেখেছে।"
		}
	},

	onStart: async function ({ message, api, event, args, threadsData, getLang }) {
		if (args.length === 0) return message.reply("⚠️ আপনি কাকে অ্যাড করতে চান? তার প্রোফাইল লিঙ্ক বা আইডি দিন।");
		
		const { members, adminIDs, approvalMode } = await threadsData.get(event.threadID);
		const botID = api.getCurrentUserID();

		const success = [{ type: "success", uids: [] }, { type: "waitApproval", uids: [] }];
		const failed = [];

		function checkErrorAndPush(messageError, item) {
			const findType = failed.find(error => error.type == messageError);
			if (findType) findType.uids.push(item);
			else failed.push({ type: messageError, uids: [item] });
		}

		const regExMatchFB = /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;
		
		for (const item of args) {
			let uid;
			let continueLoop = false;

			if (isNaN(item) && regExMatchFB.test(item)) {
				try {
					uid = await findUid(item);
				} catch (err) {
					checkErrorAndPush(getLang('cannotGetUid'), item);
					continueLoop = true;
				}
			} else if (!isNaN(item)) {
				uid = item;
			} else {
				continue;
			}

			if (continueLoop) continue;

			if (members.some(m => m.userID == uid && m.inGroup)) {
				checkErrorAndPush(getLang("alreadyInGroup"), item);
			} else {
				try {
					await api.addUserToGroup(uid, event.threadID);
					if (approvalMode === true && !adminIDs.includes(botID))
						success[1].uids.push(uid);
					else
						success[0].uids.push(uid);
				} catch (err) {
					checkErrorAndPush(getLang("cannotAddUser"), item);
				}
			}
		}

		let msg = "📥 === [ 𝗔𝗗𝗗 𝗠𝗘𝗠𝗕𝗘𝗥 𝗥𝗘𝗣𝗢𝗥𝗧 ] === 📥\n━━━━━━━━━━━━━━━━━━\n";
		if (success[0].uids.length) msg += `${getLang("successAdd", success[0].uids.length)}\n`;
		if (success[1].uids.length) msg += `${getLang("approve", success[1].uids.length)}\n`;
		if (failed.length) {
			msg += `${getLang("failedAdd", failed.reduce((a, b) => a + b.uids.length, 0))}\n`;
			failed.forEach(err => {
				msg += `🚫 ${err.type}\n`;
			});
		}
		msg += "━━━━━━━━━━━━━━━━━━\n👑 𝗢𝘄𝗻𝗲𝗿: SHALLOCK";
		
		await message.reply(msg);
	}
};
