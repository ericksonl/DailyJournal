const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help') //name of command (displayed in discord)
    .setDescription('Support for BirdWatcher commands and abilities'), //description of command (displayed in discord)

  async execute(interaction) {

    const embed = new EmbedBuilder()

    const menu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help-menu')
          .setPlaceholder('Select a command to see more')
          .addOptions(
            {
              label: 'setup',
              value: "embed1"
            },
            {
              label: 'forgot-pass',
              value: "embed2"
            },
            {
              label: 'add-entry',
              value: "embed3"
            },
            {
              label: 'get-entry',
              value: "embed4"
            },
            {
              label: 'delete-entry',
              value: "embed5"
            },
            {
              label: 'save',
              value: "embed6"
            },
            {
              label: 'index',
              value: "embed7"
            },
            {
              label: 'mood-chart',
              value: "embed8"
            },
            {
              label: 'help',
              value: "embed9"
            }
          ),
      )

      embed.setTitle("DailyJournal | Help Menu")
      .setDescription("Select an option from the drop-down menu below to see more information about these commands")
      .setColor(0x7289DA)
      .addFields(
          { name: "Configuration Commands", value: "`/setup`\n`/forgot-pass`" },
          { name: "Journal Commands", value: "`/add-entry`\n`/get-entry`\n`/delete-entry`\n`/save`" },
          { name: "Extra Commands", value: "`/index`\n`/mood-chart`\n`/help`" }
      )
    await interaction.reply({ embeds: [embed], components: [menu] })
  }
}