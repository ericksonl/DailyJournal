require('dotenv').config();

const { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v10'),
    { Client, Intents, Collection, Guild } = require('discord.js'),
    { requestData } = require('./functions/requestData.js')

const fs = require('fs'),
    path = require('path'),
    cron = require('node-cron'),
    mongoose = require('mongoose'),
    setupSchema = require('./mongooseSchema/Setup.js')

//allow bot to have access to guild and send messages
const client = new Client({
    intents: ['Guilds', 'GuildMessages']
});

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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

    //Cron values: * * * * *
    //In: minute, hour, day, month, day of the week 
    var cron_value = '0 6,10,14 * * *'

    var task = cron.schedule(cron_value, async () => {
        //execute this code for every guild that has run /set-up
        console.log("Beginning scheduled task..")
        console.log("--------------------------------------------------------------------------")
        for (var j = 0; j < guild_ids.length; j++) {
            const guildId = guild_ids[j]
            
        }
    })

    console.log("Validating cron...\n")
    //validate cron value just in case they change their shit or mine doesnt work
    if (cron.validate(cron_value) === true) {
        console.log("Cron validated. \nString " + cron_value + " registered as current cron value")
        task.start()
    } else {
        console.log("Cron invalid. \nString " + cron_value + " does not appear to be a valid cron value")
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
