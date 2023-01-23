require('dotenv').config();

const { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v10'),
    { Client, Collection } = require('discord.js')

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
