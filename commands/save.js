const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save') //name of command (displayed in discord)
    .setDescription('Save your entry') //description of command (displayed in discord)
    .addStringOption((option) =>
      option.setName('password')
        .setDescription('Your journal password')
        .setRequired(true)),

  async execute(interaction) {
    const { options } = interaction
    const plainPassword = options.getString('password')

    const channel = interaction.channel
    const privateThread = 12

    const user = interaction.user
    const threadName = `${user.username}#${user.discriminator}'s-Daily-Journal`

    const data = await setupSchema.findOne({ UserID: user.id })

    //check if user has data in the databse
    if (!data) {
      //user is a first-time user, provide setup instructions
      await interaction.reply({
        content: `Welcome to Daily Journal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account and create a password using the command "/setup". Your password will be used to access your past journal entries.
          \n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**`,
        ephemeral: true
      });
      return;
    }

    //check if the channel is a private thread owned by the user
    if (channel.type !== privateThread) {
      interaction.reply("This is not a private thread!")
      return
    } else if (channel.name !== threadName) {
      interaction.reply("This journal is not owned by you!")
      return
    }

    //compare given password with the hashed password in database
    const isPasswordMatch = await bcrypt.compare(plainPassword, data.Key);

    if (isPasswordMatch) {
      await interaction.reply("Saving...")
      try {
        //fetching messages sent by user
        const messages = await channel.messages.fetch({ limit: 100 })
        const allMessagesPostedByUser = messages.filter(msg => msg.author.id === user.id)

        //messages are fetched backwards, so reverse the array
        const reversedMessages = allMessagesPostedByUser.reverse()

        //join all messages with a new line between each message
        const combinedContent = reversedMessages.map(msg => msg.content).join('\n');

        var encrypt = CryptoJS.AES.encrypt(combinedContent, data.Key);
        var encryptedMsg = encrypt.toString()

        await journalSchema(interaction, user, encryptedMsg, data)
      } catch (error) {
        await interaction.followUp("There was a problem saving your messages. Please try again later")
        console.log(error)
      }
    } else {
      await interaction.reply("Incorrect password!");
    }
  }
}

async function journalSchema(interaction, user, encryptedMsg, data) {
  const embed = new EmbedBuilder()

  var date = new Date()

  const currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  // Initialize inJournal with data.DailyJournal or an empty object if data.DailyJournal is empty
  const inJournal = data.DailyJournal || {};
  if (inJournal[currentDate] !== undefined) {
    // Append the encrypted message to the existing entry for the current date
    inJournal[currentDate].push(encryptedMsg);
  } else {
    // Create a new entry for the current date and store the encrypted message in it
    inJournal[currentDate] = [encryptedMsg];
  }

  // Update the DailyJournal field in the database with the updated inJournal
  await setupSchema.updateOne(
    { UserID: user.id },
    {
      $set: { DailyJournal: inJournal }
    })

  // Build and send completion message via embed
  embed.setTitle("Save Complete")
    .setColor(0x7289DA)
    .setDescription("Thanks for using DailyJournal! All messages in this thread have been saved. This thread will be automatically deleted in 10 seconds")
  await interaction.followUp({ embeds: [embed] })

  // delay thread deletion by 5 seconds
  const delay = ms => new Promise(res => setTimeout(res, ms));

  await delay(5000);
  let thread = interaction.channel
  try {
    await thread.delete();
  } catch (error) {
    interaction.followUp("There was an error when trying to delete the thread!\nPlease manually close this thread.")
    console.log(error)
  }
}