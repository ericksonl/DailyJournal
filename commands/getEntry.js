const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-entry') //name of command (displayed in discord)
    .setDescription('Responds with pong') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('date')
        .setDescription("The desired date")
        .setRequired(true)) //add required string arg for Twitter Username
    .addStringOption((option) =>
      option.setName('password')
        .setDescription('Your journal password')
        .setRequired(true)),

  async execute(interaction) {
    const { options } = interaction
    const user = interaction.user
    const date = options.getString('date')
    const plainPassword = options.getString('password')

    const data = await setupSchema.findOne({ UserID: user.id })

    // if no data, user has not completed setup
    if (!data) {
      await interaction.reply({
        content: "Welcome to Daily Journal! It seems you're a first-time user, please complete the setup to get started!" +
          '\nTo start, you need to set up your account and create a password using the command `/setup`. Your password will be used to save and access your journal entries.' +
          '\n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**',
        ephemeral: true
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    if (isPasswordMatch) {

      const saved_entries = data.DailyJournal[date];
      const keys = Object.keys(data.DailyJournal)

      if (keys.length === 0) {
        await interaction.reply("You don't have any saved entries yet! Please use `/add-entry` to get started!")
        return
      }

      const embed = new EmbedBuilder();

      if (saved_entries === undefined) {
        const keys = Object.keys(data.DailyJournal);

        embed
          .setTitle(user.username + "'s Journal Entries")
          .setColor(0x7289DA)
          .setDescription(keys.map(String).join('\n'));

        await interaction.reply({
          content: "You don't have any saved entries on this date! Here is a list of the entries you have: ",
          embeds: [embed]
        });
      } else {

        var decrypted_entries = saved_entries.map(entry => {
          
          var decrypted = CryptoJS.AES.decrypt(entry, data.Key);
          var actual = decrypted.toString(CryptoJS.enc.Utf8)

          return actual
        })

        const formattedEntries = decrypted_entries.join('\n');
        embed
          .setTitle(user.username + "'s " + date + " Journal Entry")
          .setColor(0x7289DA)
          .setDescription(formattedEntries);
        await user.send({ embeds: [embed] })
          .then(async () => {
            await interaction.reply("Your journal entry has been sent to your DM's");
          })
      }
    } else {
      await interaction.reply({ content: "Incorrect password!" });
    }
  }
}