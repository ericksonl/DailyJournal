const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
// const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup') //name of command (displayed in discord)
        .setDescription('Set up DailyJournal'), //description of command (displayed in discord)
    //TODO: Add timezone functionality

    async execute(interaction) {

        const { user } = interaction

        const data = await setupSchema.findOne({ UserID: user.id })

        //if no data, begin setup
        if (!data) {
            //TAKING OUT PASSWORD AUTHENTICATION FOR NOW, UNABLE TO IMPLEMENT
            // Hashing the plain password using bcrypt
            // const plainPassword = userPassword;
            // const saltRounds = 10;

            // bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
            //     if (err) {
            //         console.error('Error hashing password:', err);
            //         interaction.reply({
            //             content: "There was an error with your passcode, please run the setup again", ephemeral: true
            //         })
            //         return;
            //     }

            const time_menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('time-zone-menu')
                        .setPlaceholder('Please select your time-zone')
                        .addOptions(
                            {
                                label: 'Hawaii Standard (HST)',
                                value: "hawaiiS"
                            },
                            {
                                label: 'Hawaii-Aleutian Standard (HDT)',
                                value: "hawaiiA"
                            },
                            {
                                label: 'Alaska Daylight (AKDT)',
                                value: "alaska"
                            },
                            {
                                label: 'Pacific Standard (PST)',
                                value: "pacific"
                            },
                            {
                                label: 'Mountain Standard (MST)',
                                value: "mountainS"
                            },
                            {
                                label: 'Mountain Daylight (MDT)',
                                value: "mountainD"
                            },
                            {
                                label: 'Central (CT)',
                                value: "central"
                            },
                            {
                                label: 'Eastern Standard (EST)',
                                value: "eastern"
                            },
                        ),
                )
            const embed = new EmbedBuilder()
                .setTitle("DailyJournal | Setup")
                .setDescription("Select your time-zone from the drop-down menu below")
                .setColor(0x7289DA)
            await interaction.reply({ embeds: [embed], components: [time_menu], ephemeral: true })

        } else {
            interaction.reply({ content: "Hey there DailyJournal user!\nIt looks like you already completed the setup!", ephemeral: true })
        }
    }
}