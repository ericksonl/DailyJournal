const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const bcrypt = require('bcrypt');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup') //name of command (displayed in discord)
        .setDescription('Set up Daily Journal') //description of command (displayed in discord)
        .addStringOption((option) =>
            option.setName('set-password')
                .setDescription("The password you will use to save and view your daily journals")
                .setRequired(true)), //add required string arg for Twitter Username

    //TODO: Add timezone functionality

    async execute(interaction) {

        const { options } = interaction

        const userPassword = options.getString("set-password")

        const user = interaction.user.id
        console.log(user)

        let dailyJournalObj = {}

        setupSchema.findOne({ UserID: user }, async (err, data) => {
            //if no data, begin setup
            if (!data) {

                // Hashing a password
                const plainPassword = userPassword;

                // Generate a salt to strengthen the hashing algorithm
                const saltRounds = 10;

                //create hash of password
                bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        interaction.reply({
                            content: "There was an error with your passcode, please run the setup again", ephemeral: true
                        })
                        return;
                    }
                    // Create database and store the hashed password
                    console.log(hash)
                    await setupSchema.create({
                        UserID: user,
                        Key: hash,
                        TimeZone: userTimeZone,
                        DailyJournal: dailyJournalObj
                    })
                })

                interaction.reply({
                    content: "Congrats, you completed the setup! Your password is set to: ||" + userPassword +
                        "||.\nYour password will be used to save and access your journal entries.\n" +
                        "**Write it down in a safe place and don't give it out to anyone!**", ephemeral: true
                })
            } else {
                interaction.reply({ content: "It looks like you already completed the setup.\n If you need to, you can reset your password using the `/forgot-password` command.", ephemeral: true })
            }
        })
    }
}