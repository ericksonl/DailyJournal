require('dotenv').config();

const { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v10'),
    { Client, Collection, Events, EmbedBuilder } = require('discord.js')

const { saveThread } = require('./helperFunctions/saveThread.js');
const { setupUser } = require('./helperFunctions/setup.js');

const fs = require('fs'),
    path = require('path')
mongoose = require('mongoose')

//allow bot to have access to guild and send messages
const client = new Client({
    intents: ['Guilds', 'GuildMessages']
});


//load all commands
const commands = [] //a list of all commands in commands folder
client.commands = new Collection() //collection of all command names with command functions

const commandsPath = path.join(__dirname, "commands"); //holds path to commands 
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

//when bot comes online:
client.on("ready", async () => {

    //connect to mongoDB database
    console.log("Connecting to MongoDB database...\n")
    await mongoose.connect(process.env.DATABASE_TOKEN || '', {
        keepAlive: true
    }).then(console.log("Connected to database"))

    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    //update commands for guilds
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands })
            .then(() => console.log('Successfully updated commands for guild ' + guildId))
            .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    //try to execute the command    
    try {
        await command.execute(interaction);
    }
    //if it doesnt work, log it and reply to the user there was an error
    catch (error) {
        console.error(error);
        try {
            await interaction.reply({ content: "There was an error when trying to execute this command" });
        } catch (e) {
            console.log(e)
            await interaction.followUp({ content: "There was an error when trying to execute this command" });
        }
    }
});

client.on('guildCreate', guild => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    //update commands for guilds
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands })
            .then(() => console.log('Successfully updated commands for guild ' + guildId))
            .catch(console.error);
    }
});



process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

client.login(process.env.DISCORD_TOKEN);


client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isMessageComponent()) return;

    if (interaction.isButton()) {
        const btn_id = interaction.customId

        const embed = new EmbedBuilder()
            .setTitle("Saving...")
            .setColor(0x7289DA)
            .setDescription("Thanks for using DailyJournal! All messages in this thread are being saved. This jouranl will be automatically closed in 5 seconds")

        if (btn_id === 'one') {
            await interaction.update({ embeds: [embed], components: [] });
            saveThread(interaction, 1)
        } else if (btn_id === 'two') {
            await interaction.update({ embeds: [embed], components: [] });
            saveThread(interaction, 2)
        } else if (btn_id === 'three') {
            await interaction.update({ embeds: [embed], components: [] });
            saveThread(interaction, 3)
        } else if (btn_id === 'four') {
            await interaction.update({ embeds: [embed], components: [] });
            saveThread(interaction, 4)
        } else if (btn_id === 'five') {
            await interaction.update({ embeds: [embed], components: [] });
            saveThread(interaction, 5)
        }
    }

    if (interaction.customId === 'help-menu') {
        const selectedOption = interaction.values[0];

        const embed = new EmbedBuilder()

        if (selectedOption === "embed1") {
            embed.setTitle("setup")
                .setDescription("Set up DailyJournal")
                .addFields(
                    { name: "• Arguments", value: "None" },
                    { name: "• Requirements", value: "First time running `/setup`" },
                    { name: "• Usage", value: "`/setup`" }
                )
        } else if (selectedOption === "embed2") {
            embed.setTitle("add-entry")
                .setDescription("Add an entry to your journal")
                .addFields(
                    { name: "• Arguments", value: "None" },
                    { name: "• Requirements", value: "Must be run in a valid text channel (where a thread can be created)" },
                    { name: "• Usage", value: "`/add-entry`" }
                )
        } else if (selectedOption === "embed3") {
            embed.setTitle("get-entry")
                .setDescription("Sends you a DM with your journal entry for the specified date")
                .addFields(
                    { name: "• Arguments", value: "date (the date (MM/DD/YYYY) of the journal entry you wish to view)\n[Required: Yes]" },
                    { name: "• Requirements", value: "Must have completed `/setup`" },
                    { name: "• Usages", value: "`/get-entry 01/01/2020`" }
                )
        } else if (selectedOption === "embed4") {
            embed.setTitle("delete-entry")
                .setDescription("Deletes the journal entry for the specified date")
                .addFields(
                    { name: "• Arguments", value: "date (the date (MM/DD/YYYY) of the journal entry you wish to delete)\n[Required: Yes]" },
                    { name: "• Requirements", value: "Must have completed `/setup`" },
                    { name: "• Usages", value: "`/delete-entry 01/01/2020`" }
                )
        } else if (selectedOption === "embed5") {
            embed.setTitle("save")
                .setDescription("Save your journal entry")
                .addFields(
                    { name: "• Arguments", value: "None" },
                    { name: "• Requirements", value: "Can only be used in your personal journal thread\nMust have completed `/setup`" },
                    { name: "• Usage", value: "`/save`" }
                )
        } else if (selectedOption === "embed6") {
            embed.setTitle("index")
                .setDescription("See a list of your journal entry dates")
                .addFields(
                    { name: "• Arguments", value: "None" },
                    { name: "• Requirements", value: "Must have completed `/setup`" },
                    { name: "• Usage", value: "`/index`" }
                )
        } else if (selectedOption === "embed7") {
            embed.setTitle("mood-chart")
                .setDescription("Sends you a graphical representation of your documented moods")
                .addFields(
                    { name: "• Arguments", value: "None" },
                    { name: "• Requirements", value: "Must have completed `/setup`" },
                    { name: "• Usage", value: "`/mood-chart`" }
                )
        } else if (selectedOption === "embed8") {
            embed.setTitle("DailyJournal | Help Menu")
                .setDescription("Select an option from the drop-down menu below to see more information about these commands")
                .addFields(
                    { name: "Configuration Commands", value: "`/setup`" },
                    { name: "Journal Commands", value: "`/add-entry`\n`/get-entry`\n`/delete-entry`\n`/save`" },
                    { name: "Extra Commands", value: "`/index`\n`/mood-chart`\n`/help`" }
                )
        }
        await interaction.update({ embeds: [embed] });
    }

    if (interaction.customId === 'time-zone-menu') {
        const selectedOption = interaction.values[0];
        console.log(interaction)
        const embed = new EmbedBuilder()
            .setTitle("DailyJournal | Setup")
            .setColor(0x7289DA)
        if (selectedOption === "hawaiiS") {
            embed.setDescription("You chose **Hawaii Standard Time (HST)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "HST")
        } else if (selectedOption === "hawaiiA") {
            embed.setDescription("You chose **Hawaii-Aleutian Standard Time (HDT)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "HDT")
        } else if (selectedOption === "alaska") {
            embed.setDescription("You chose **Alaska Daylight Time (AKDT)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "AKDT")
        } else if (selectedOption === "pacific") {
            embed.setDescription("You chose **Pacific Standard Time (PST)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "PST")
        } else if (selectedOption === "mountainS") {
            embed.setDescription("You chose **Mountain Standard Time (MST)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "MST")
        } else if (selectedOption === "mountainD") {
            embed.setDescription("You chose **Mountain Daylight Time (MDT)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "MDT")
        } else if (selectedOption === "central") {
            embed.setDescription("You chose **Central Time (CT)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "CT")
        } else if (selectedOption === "eastern") {
            embed.setDescription("You chose **Eastern Standard Time (EST)**\nThank you for completing the setup!")
            await interaction.update({ embeds: [embed], components: [] });
            setupUser(interaction, "EST")
        }
    }
});