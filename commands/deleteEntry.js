const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-entry') //name of command (displayed in discord)
    .setDescription('Sends you a direct message with your journal entry on the given date') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('password')
        .setDescription('Your DailyJournal password')
        .setRequired(true))
    .addStringOption((option) =>
      option.setName('date')
        .setDescription("Date of the journal entry")
        .setRequired(true)),

  async execute(interaction) {
    const { options } = interaction
    const user = interaction.user
    const date = options.getString('date')
    const plainPassword = options.getString('password')

    const data = await setupSchema.findOne({ UserID: user.id })

    //check if user has data in the databse
    if (!data) {
      //user is a first-time user, provide setup instructions
      await interaction.reply({
        content: `Welcome to DailyJournal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account and create a password using the command "/setup". Your password will be used to access your past journal entries.
          \n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**`,
        ephemeral: true
      });
      return;
    }

    //compare given password with the hashed password in database
    const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    if (isPasswordMatch) {
      
    } else {
      //Password does not match
      await interaction.reply('Incorrect password!');
    }
  }
}