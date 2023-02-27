const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup') //name of command (displayed in discord)
        .setDescription('Set up Daily Journal') //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('set-password')
                .setDescription("The password you will use to save and view your daily journals")
                .setRequired(true)) //add required string arg for Twitter Username
        .addStringOption((option) =>
            option.setName('set-timezone')
                .setDescription("Your local timezone")
                .setRequired(true)), //add required string arg for Twitter Username


    async execute(interaction) {

        const { options } = interaction

        const userPassword = options.getString("set-password")

        const userTimeZone = options.getString("set-timezone")

        const user = interaction.user.id
        console.log(user)

        let dailyJournalObj = {}

        setupSchema.findOne({ UserID: user }, async (err, data) => {
            //if no data, begin setup
            if (!data) {

                var encrypt = CryptoJS.AES.encrypt(userPassword, process.env.PASSWORD_ENCRYPTION_KEY);

                var encryptedPass = encrypt.toString()

                await setupSchema.create({
                    UserID: user,
                    Key: encryptedPass,
                    TimeZone: userTimeZone,
                    DailyJournal: dailyJournalObj
                })

                interaction.reply({
                    content: "Congrats, you completed the setup! Your password is set to: ||" + userPassword +
                        "||.\nYour password will be used to save and access your journal entries.\n" +
                        "**Write it down in a safe place and don't give it out to anyone!**", ephemeral: true
                })
            } else {
                interaction.reply({ content: "It looks like you already completed the setup.\n If you need to, you can reset your password using the `/forgot-password` command.", ephemeral: true })
            }
        })
    }
}