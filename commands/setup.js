const { SlashCommandBuilder } = require('discord.js')
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

        let dailyJournalObj = {}
        let moodChartObj = {}

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

            const randKey = CryptoJS.lib.WordArray.random(16).toString(); // 16 bytes (128 bits) key
            var userKey = CryptoJS.AES.encrypt(randKey, process.env.MASTER_KEY).toString();

            // Create a new entry in the database
            await setupSchema.create({
                UserID: user.id,
                Key: userKey,
                DailyJournal: dailyJournalObj,
                MoodChart: moodChartObj
            })

            const central = new ButtonBuilder()
                .setCustomId('central')
                .setLabel('1️')
                .setStyle(ButtonStyle.Primary);

            const mountainD = new ButtonBuilder()
                .setCustomId('mountainD')
                .setLabel('2')
                .setStyle(ButtonStyle.Primary);

            const mountainS = new ButtonBuilder()
                .setCustomId('mountainS')
                .setLabel('3')
                .setStyle(ButtonStyle.Primary);

            const pacific = new ButtonBuilder()
                .setCustomId('pacific')
                .setLabel('4')
                .setStyle(ButtonStyle.Primary);

            const alaska = new ButtonBuilder()
                .setCustomId('alaska')
                .setLabel('5')
                .setStyle(ButtonStyle.Primary);

            const hawaii = new ButtonBuilder()
                .setCustomId('hawaii')
                .setLabel('5')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
                .addComponents(one, two, three, four, five);

            const embed = new EmbedBuilder()
                .setTitle("Time Zone Selector")
                .setColor(0x7289DA)
                .setDescription("Please select your local time zone")

            await interaction.reply({
                embeds: [embed],
                components: [row],
            });

        } else {
            interaction.reply({ content: "Hey there DailyJournal user!\nIt looks like you already completed the setup!", ephemeral: true })
        }
    }
}