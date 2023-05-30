const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forgot-pass') //name of command (displayed in discord)
        .setDescription("Reset your password if you've forgotten it") //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('new-password')
                .setDescription("The password you will use to save and view your journal entries")
                .setRequired(true)),

    async execute(interaction) {
        const { options } = interaction

        // const userPassword = options.getString("new-password")

        interaction.reply({
            content: "This command is currently being created",
            ephemeral: true
        })
    }
}