const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forgot-password') //name of command (displayed in discord)
        .setDescription("Reset your password if you've forgotten it") //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('new-password')
                .setDescription("The password you will use to save and view your daily journals")
                .setRequired(true)), //add required string arg for Twitter Username

    async execute(interaction) {

        const user = interaction.user.id
        
        const { options } = interaction

        const userPassword = options.getString("new-password")

        //This becomes an object, so you must convert to a string before updating MongoDB
        var encrypt = CryptoJS.AES.encrypt(userPassword, process.env.PASSWORD_ENCRYPTION_KEY);

        var encryptedPass = encrypt.toString()

        setupSchema.findOne({ UserID: user }, async (err, data) => {
            if (!data) {
                await interaction.reply({
                    content: "Welcome to Daily Journal! It seems you're a first time user, please complete the setup to get started!" +
                        '\nTo start you need to setup your account and create a password using the command `/setup`. Your password will be used to save and access your journal entries.' +
                        '\n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**', ephemeral: true
                })
            } else {
                await setupSchema.updateOne({ UserID: user },
                    {
                        $set: { "Key": encryptedPass }
                    })

                interaction.reply({
                    content: "Your password has been reset. It is now: ||" + userPassword +
                        "||.\nYour password is used to save and access your journal entries.\n" +
                        "**Write it down in a safe place and don't give it out to anyone!**", ephemeral: true
                })
            }
        })
    }
}
