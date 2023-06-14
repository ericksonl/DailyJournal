const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
// const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-entry') //name of command (displayed in discord)
    .setDescription('Sends you a direct message with your journal entry on the given date') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('date')
        .setDescription("Date of the journal entry")
        .setRequired(true)),

  async execute(interaction) {
    const { options, user } = interaction
    const date = options.getString('date')

    const data = await setupSchema.findOne({ UserID: user.id })

    //check if user has data in the databse
    if (!data) {
      //user is a first-time user, provide setup instructions
      await interaction.reply({
        content: `Welcome to DailyJournal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account and create a password using the command "/setup".`,
        ephemeral: true
      });
      return;
    }

    //compare given password with the hashed password in database
    // const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    // if (!isPasswordMatch) {
    //   await interaction.reply({
    //     content: "Incorrect password!",
    //     ephemeral: true
    //   })
    //   return
    // }

    const keys = Object.keys(data.DailyJournal)
    const saved_entries = data.DailyJournal[date];

    //if user has no saved entries
    if (keys.length === 0) {
      await interaction.reply({
        content: "Hey there DailyJournal user!\YYou must have at least one entry to be able to delete one!\nYou can start a new journal entry by typing `/add-entry`",
        ephemeral: true
      })
      return
    }

    const embed = new EmbedBuilder();

    if (saved_entries === undefined) {
      // no saved entries for the specified date
      embed
        .setTitle(`${user.username}'s Journal Entries`)
        .setColor(0x7289DA)
        .setDescription(keys.map(String).join('\n'));

      await interaction.reply({
        content: "You don't have any saved entries on this date! Here is a list of the entries you have: ",
        embeds: [embed]
      });
    } else {

      let userResponded = false;

      const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('confirm')
        .setStyle(ButtonStyle.Danger);

      const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('cancel')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(confirm, cancel);

      await interaction.reply({
        content: `Are you sure you want to delete your journal entry for ${date}?`,
        components: [row],
        ephemeral: true
      })

      const filter = (interaction) => interaction.user.id === user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async (interaction2) => {

        interaction.editReply({
          components: []
        })

        userResponded = true

        if (interaction2.customId === 'confirm') {
          // Delete the entry
          delete data.DailyJournal[date];
          delete data.MoodChart[date];

          // Update the DailyJournal field in the database with the updated entries
          await setupSchema.updateOne(
            { UserID: user.id },
            {
              $set: {
                DailyJournal: data.DailyJournal,
                MoodChart: data.MoodChart
              }
            }
          );

          await interaction2.reply({
            content: `Your journal entry for ${date} has been deleted. Thank you for using DailyJournal!`,
            ephemeral: true
          });
        } else if (interaction2.customId === 'cancel') {
          await interaction2.reply({
            content: `Deletion of the journal entry for ${date} has been cancelled.`,
            ephemeral: true
          });
        }
      });

      collector.on('end', () => {
        if (!userResponded) {
          interaction.editReply({
            content: 'The prompt has expired. Deletion cancelled.',
            components: []
          })
        }
      })
    }
  }
}



