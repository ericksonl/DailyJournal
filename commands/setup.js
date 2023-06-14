const { SlashCommandBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup') //name of command (displayed in discord)
        .setDescription('Set up DailyJournal') //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('set-password')
                .setDescription("used to save and view your journal entries")
                .setRequired(true)),

    //TODO: Add timezone functionality

    async execute(interaction) {

        const { options, user } = interaction
        const userPassword = options.getString("set-password")

        let dailyJournalObj = {}
        let moodChartObj = {}

        const data = await setupSchema.findOne({ UserID: user.id })

        //if no data, begin setup
        if (!data) {
            // Hashing the plain password using bcrypt
            const plainPassword = userPassword;
            const saltRounds = 10;

            bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    interaction.reply({
                        content: "There was an error with your passcode, please run the setup again", ephemeral: true
                    })
                    return;
                }

                const randKey = CryptoJS.lib.WordArray.random(16); // 16 bytes (128 bits) key
                var userKey = CryptoJS.AES.encrypt(randKey, process.env.MASTER_KEY).toString();

                // Create a new entry in the database
                await setupSchema.create({
                    UserID: user.id,
                    Pass: hash,
                    Key: userKey,
                    DailyJournal: dailyJournalObj,
                    MoodChart: moodChartObj
                })
            })

            // Send setup completion message to user
            interaction.reply({
                content: "Congrats, you completed the setup! Your password is set to: ||" + userPassword +
                    "||.\nYour password will be used to save and access your journal entries.\n" +
                    "**Write it down in a safe place and don't give it out to anyone!**",
                ephemeral: true
            })
        } else {
            interaction.reply({ content: "Hey there DailyJournal user!\nIt looks like you already completed the setup!\nIf you need to, you can reset your password using the `/forgot-password` command.", ephemeral: true })
        }
    }
}