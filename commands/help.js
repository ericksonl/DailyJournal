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
              label: 'save',
              value: "embed4"
            },
            {
              label: 'get-entry',
              value: "embed5"
            },
            {
              label: 'index',
              value: "embed6"
            },
            {
              label: 'help',
              value: "embed7"
            },
          ),
      )

    embed.setTitle("DailyJournal | Help Menu")
      .setDescription("Select an option from the drop-down to see more information about that command")
      .setColor(0x7289DA)
      .addFields(
        { name: "Configuration Commands", value: "`/setup`\n`/forgot-pass`" },
        { name: "Journal Commands", value: "`/add-entry`\n`/save`\n`/get-entry`\n`/index`" },
        { name: "Extra Commands", value: "`/help`" },
      )
    await interaction.reply({ embeds: [embed], components: [menu] })
  }
}