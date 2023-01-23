const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping') //name of command (displayed in discord)
    .setDescription('Responds with pong'), //description of command (displayed in discord)

  async execute(interaction) {
    await interaction.reply("pong")
  }
}