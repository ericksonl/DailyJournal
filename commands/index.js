const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
// const bcrypt = require('bcrypt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('index') //name of command (displayed in discord)
        .setDescription('See a list of your journal entry dates'), //description of command (displayed in discord)

    async execute(interaction) {
        const { user } = interaction

        const data = await setupSchema.findOne({ UserID: user.id })

        //check if user has data in the databse
        if (!data) {
            //user is a first-time user, provide setup instructions
            await interaction.reply({
                content: `Welcome to DailyJournal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account using the command "/setup".`,
                ephemeral: true
            });
            return;
        }

        //compare given password with the hashed password in database
        //const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

        //if (isPasswordMatch) {
        const keys = Object.keys(data.DailyJournal)

        //if user has no saved entries
        if (keys.length === 0) {
            await interaction.reply({
                content: "Hey there DailyJournal user!\nTo be able to access your journal entries, you must have at least one entry!\nYou can start a new journal entry by typing `/add-entry`",
                ephemeral: true
            })
            return
        }

        const embed = new EmbedBuilder();

        embed
            .setTitle(`${user.username}'s Journal Entries`)
            .setColor(0x7289DA)
            .setDescription(keys.map(String).join('\n'));

        await interaction.reply({
            content: "Here is a list of the entries you have."
                + "\nUse the command `/get-entry <password> <date>` to view a specific entry.",
            embeds: [embed]
        });
        // } else {
        //     //Password does not match
        //     await interaction.reply('Incorrect password!');
        // }
    }
}