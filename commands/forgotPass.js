const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");
const { enc } = require('crypto-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forgot-password') //name of command (displayed in discord)
        .setDescription("Reset your password if you've forgotten it") //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('new-password')
                .setDescription("The password you will use to save and view your daily journals")
                .setRequired(true)), //add required string arg for Twitter Username

    async execute(interaction) {

        const user = interaction.user

        const { options } = interaction

        const userPassword = options.getString("new-password")

        var encryptedPass = CryptoJS.AES.encrypt(userPassword, process.env.PASSWORD_ENCRYPTION_KEY);

        try {
            await setupSchema.updateOne(
                { UserID: user },
                {
                    $set: { "Key": encryptedPass }
                })           
        } catch (error) {
            console.log(error)
        }
        
        await interaction.reply("did this work")
    }
}
