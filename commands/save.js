const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save') //name of command (displayed in discord)
    .setDescription('Save your entry') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('password')
        .setDescription('Your journal password')
        .setRequired(true)),

  async execute(interaction) {
    const { options, user } = interaction
    const plainPassword = options.getString('password')

    const channel = interaction.channel
    const privateThread = 12

    const threadName = `${user.username}#${user.discriminator}'s-Daily-Journal`

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

    //check if the channel is a private thread owned by the user
    if (channel.type !== privateThread) {
      interaction.reply("This is not a private thread!")
      return
    } else if (channel.name !== threadName) {
      interaction.reply("This journal is not owned by you!")
      return
    }

    //compare given password with the hashed password in database
    const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    if (isPasswordMatch) {

      //add mood chart here
      const one = new ButtonBuilder()
        .setCustomId('one')
        .setLabel('1️')
        .setStyle(ButtonStyle.Primary);

      const two = new ButtonBuilder()
        .setCustomId('two')
        .setLabel('2')
        .setStyle(ButtonStyle.Primary);

      const three = new ButtonBuilder()
        .setCustomId('three')
        .setLabel('3')
        .setStyle(ButtonStyle.Primary);

      const four = new ButtonBuilder()
        .setCustomId('four')
        .setLabel('4')
        .setStyle(ButtonStyle.Primary);

      const five = new ButtonBuilder()
        .setCustomId('five')
        .setLabel('5')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(one, two, three, four, five);

      const embed = new EmbedBuilder()
        .setTitle("Daily Mood Check-In")
        .setColor(0x7289DA)
        .setDescription("Please select how your feeling today on a scale of 1 (Not great) to 5 (Amazing)")
    
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } else {
      await interaction.reply("Incorrect password!");
    }
  }
}