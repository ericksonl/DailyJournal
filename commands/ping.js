const { SlashCommandBuilder } = require('discord.js')
// const setupSchema = require('../mongooseSchema/schema.js')

// const CryptoJS = require("crypto-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') //name of command (displayed in discord)
    .setDescription('Responds with pong'), //description of command (displayed in discord)

  async execute(interaction) {
    // const user = interaction.user.id

    interaction.reply("pong")

    // var encrypted

    // setupSchema.findOne({ UserID: user }, async (err, data) => {
    //   if (data) {    
    //     encrypted = data.Key

    //     console.log(encrypted)


    //     var decrypted = CryptoJS.AES.decrypt(encrypted, process.env.PASSWORD_ENCRYPTION_KEY);

    //     await interaction.followUp({ content: "Decrypted: " + decrypted })

    //     var actual = decrypted.toString(CryptoJS.enc.Utf8)

    //     await interaction.followUp({ content: "Actual: " + actual })
    //   }
    // })   
  }
}