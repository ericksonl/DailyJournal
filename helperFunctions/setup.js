
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");

async function setupUser(interaction, value) {

    const user = interaction.user

    const randKey = CryptoJS.lib.WordArray.random(16).toString(); // 16 bytes (128 bits) key
    var userKey = CryptoJS.AES.encrypt(randKey, process.env.MASTER_KEY).toString();

    let dailyJournalObj = {}
    let moodChartObj = {}

    // Create a new entry in the database
    await setupSchema.create({
        UserID: user.id,
        Key: userKey,
        DailyJournal: dailyJournalObj,
        MoodChart: moodChartObj,
        TimeZone: value
    })

}

module.exports = { setupUser };