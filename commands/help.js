const { SlashCommandBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')

//DEBUG: Command does not work in threads

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help') //name of command (displayed in discord)
    .setDescription('Get help using DailyJournal'), //description of command (displayed in discord)

  async execute(interaction) {

    interaction.reply('Future help command')
    
    }
}