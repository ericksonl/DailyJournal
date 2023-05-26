const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-entry') //name of command (displayed in discord)
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
        content: `Welcome to Daily Journal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account and create a password using the command "/setup". Your password will be used to access your past journal entries.
          \n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**`,
        ephemeral: true
      });
      return;
    }

    //compare given password with the hashed password in database
    const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    if (isPasswordMatch) {
      const saved_entries = data.DailyJournal[date];
      const keys = Object.keys(data.DailyJournal)

      //if user has no saved entries
      if (keys.length === 0) {
        await interaction.reply("You don't have any saved entries yet! Please use `/add-entry` to get started!")
        return
      }

      const embed = new EmbedBuilder();

      if (saved_entries === undefined) {
        // no saved entries for the specified date
        const keys = Object.keys(data.DailyJournal);

        embed
          .setTitle(`${user.username}'s Journal Entries`)
          .setColor(0x7289DA)
          .setDescription(keys.map(String).join('\n'));

        await interaction.reply({
          content: "You don't have any saved entries on this date! Here is a list of the entries you have: ",
          embeds: [embed]
        });
      } else {
        //entry has been found
        var decrypted_entries = saved_entries.map(entry => {
          //decrypt each entry
          var decrypted = CryptoJS.AES.decrypt(entry, data.Key);
          var actual = decrypted.toString(CryptoJS.enc.Utf8)

          return actual
        })

        const formattedEntries = decrypted_entries.join('\n');
        embed
          .setTitle(`${user.username}'s ${date} Journal Entry`)
          .setColor(0x7289DA)
          .setDescription(formattedEntries)
          .addFields(
            { name: "Mood Value", value: String(data.MoodChart[date]) + "/5"})

        //send the jounral entry as a DM to the user
        await user.send({ embeds: [embed] })
          .then(async () => {
            await interaction.reply("Your journal entry has been sent to your DM's");
          })
      }
    } else {
      //Password does not match
      await interaction.reply('Incorrect password!');
    }
  }
}