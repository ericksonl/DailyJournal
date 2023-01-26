const { SlashCommandBuilder } = require('discord.js')
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('encrypt') //name of command (displayed in discord)
        .setDescription('Encrypts a message') //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('code')
                .setDescription("Specify String")
                .setRequired(true)) //add required string arg for Twitter Username
        .addStringOption((option) =>
            option.setName('key')
                .setDescription("Specify Key")
                .setRequired(true)), //add required string arg for Twitter Username

    async execute(interaction) {

        const { options } = interaction

        const code = options.getString("code")

        const key = "Guerald"

        const userKey = options.getString("key")

        if (userKey !== key) {
            await interaction.reply({ content: "Incorrect key!" })
        } else {

            var encrypted = CryptoJS.AES.encrypt(code, key);
            //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

            await interaction.reply({ content: "Encrypted: " + encrypted })

            var decrypted = CryptoJS.AES.decrypt(encrypted, userKey);

            await interaction.followUp({ content: "Decrypted: " + decrypted })

            var actual = decrypted.toString(CryptoJS.enc.Utf8)

            await interaction.followUp({ content: "Actual: " + actual })
        }

    }
}