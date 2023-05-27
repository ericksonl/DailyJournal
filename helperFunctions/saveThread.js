
const { EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");

async function saveThread(interaction, value) {

  const channel = interaction.channel
  const user = interaction.user

  const data = await setupSchema.findOne({ UserID: user.id })
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

    await journalSchema(interaction, user, encryptedMsg, data, value)
  } catch (error) {
    await interaction.followUp("There was a problem saving your messages. Please try again later")
    console.log(error)
  }
}

async function journalSchema(interaction, user, encryptedMsg, data, value) {
  var date = new Date()

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const currentDate = `${month}/${day}/${year}`;

  // Initialize inJournal with data.DailyJournal or an empty object if data.DailyJournal is empty
  const inJournal = data.DailyJournal || {};
  const MoodChart = data.MoodChart || {};

  if (inJournal[currentDate] !== undefined) {
    // Append the encrypted message to the existing entry for the current date
    inJournal[currentDate].push(encryptedMsg);
    console.log(inJournal[currentDate])
    MoodChart[currentDate] = value
  } else {
    // Create a new entry for the current date and store the encrypted message in it
    inJournal[currentDate] = [encryptedMsg];
    console.log(inJournal[currentDate])
    MoodChart[currentDate] = value
  }

  // Update the DailyJournal field in the database with the updated inJournal
  await setupSchema.updateOne(
    { UserID: user.id },
    {
      $set: {
        DailyJournal: inJournal,
        MoodChart: MoodChart
      }
    })

  // delay thread deletion by 5 seconds
  const delay = ms => new Promise(res => setTimeout(res, ms));

  // await delay(5000);
  // let thread = interaction.channel
  // try {
  //   await thread.delete();
  // } catch (error) {
  //   interaction.followUp("There was an error when trying to delete the thread!\nPlease manually close this thread.")
  //   console.log(error)
  // }
}

module.exports = { saveThread };