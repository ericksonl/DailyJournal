const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') //name of command (displayed in discord)
    .setDescription('Responds with pong') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('pass')
        .setDescription("The password you will use to save and view your daily journals")
        .setRequired(true)), //add required string arg for Twitter Username

  async execute(interaction) {
    const user = interaction.user.id

    const { options } = interaction

    const pass = options.getString("pass")

    await setupSchema.updateOne(
      { UserID: user },
      {
        $set: { "Key" : pass }
      })

    await interaction.reply("did this work")

  }
}