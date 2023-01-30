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
                .setRequired(true)), //add required string arg for Twitter Username

    async execute(interaction) {

        const { options } = interaction

        const userPassword = options.getString("set-password")

        const user = interaction.user.id
        console.log(user)

        const emptyArr = []

        setupSchema.findOne({ UserID: user }, async (err, data) => {
            //if no data, begin setup
            if (!data) {

                var encryptedPass = CryptoJS.AES.encrypt(userPassword, process.env.PASSWORD_ENCRYPTION_KEY);

                await setupSchema.create({
                    UserID: user,
                    Key: encryptedPass,
                    DailyJournal: emptyArr
                  })

                interaction.reply({
                    content: "Your password is now set to: ||" + userPassword +
                        "||.\nYour password will be used to save and access your journal entries.\n" +
                        "**Write this down in a safe place and don't give it out to anyone!**", ephemeral: true
                })
            } else {
                interaction.reply({ content: "It looks like you already completed the setup.\n If you need to, you can reset your password using the `/forgot-password` command.", ephemeral: true })
            }
        })
    }
}