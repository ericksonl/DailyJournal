const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')
const CryptoJS = require("crypto-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save') //name of command (displayed in discord)
    .setDescription('Save your entry'), //description of command (displayed in discord)

  async execute(interaction) {

    const channel = interaction.channel
    const channelType = channel.type
    const privateThread = 12

    const user = interaction.user
    const userName = user.username
    const threadName = userName + "#" + user.discriminator + "'s-Daily-Journal"

    var contentArr = []
    var outArr = []

    setupSchema.findOne({ UserID: user.id }, async (err, data) => {
      if (!data) {
        await interaction.reply({
          content: "Welcome to Daily Journal! It seems you're a first time user, please complete the setup to get started!" +
            '\nTo start you need to setup your account and create a password using the command `/setup`. Your password will be used to access your past journal entries.' +
            '\n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**', ephemeral: true
        })
      } else {
        if (channelType !== privateThread) {
          interaction.reply("This is not a private thread!")
        } else if (channel.name !== threadName) {
          interaction.reply("This is not your journal!")
        } else {
          await interaction.reply({ content: "Saving..." })
          try {
            const messages = await channel.messages.fetch({ limit: 100 })
            const allMessagesPostedByUser = messages.filter(msg => msg.author.id === user.id)

            allMessagesPostedByUser.forEach(message => {

              var decrypted = CryptoJS.AES.decrypt(data.Key, process.env.PASSWORD_ENCRYPTION_KEY);    
              var actual = decrypted.toString(CryptoJS.enc.Utf8)  

              var encrypt = CryptoJS.AES.encrypt(message.content, actual);
              var encryptedMsg = encrypt.toString()
              contentArr.push(encryptedMsg)
            })


            outArr = contentArr.reverse()

            journalSchema(interaction, user, outArr, data)

          } catch (error) {
            await interaction.followUp({ content: "There was a problem saving your messages. Please try again later" })
            console.log(error)
          }
        }
      }
    })
  }
}

async function journalSchema(interaction, user, inArray, data) {
  const embed = new EmbedBuilder()

  var date = new Date()

  let currentDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()

  if (data.DailyJournal[currentDate] !== undefined) {
    let inJournal = data.DailyJournal

    inArray.forEach(element => {
      inJournal[currentDate].push(element)
    });

    console.log(inJournal)


    await setupSchema.updateOne(
      { UserID: user.id },
      {
        $set: { DailyJournal: inJournal }
      })

    embed.setTitle("Save Complete")
      .setColor(0x7289DA)
      .setDescription("Thanks for using DailyJournal! All messages in this thread have been saved. This thread will be automatically deleted in 10 seconds")
    await interaction.followUp({ embeds: [embed] })

  } else {

    let inJournal = data.DailyJournal

    inJournal[currentDate] = inArray

    //this overwrites anything with the same name
    await setupSchema.updateOne(
      { UserID: user.id },
      {
        $set: { DailyJournal: inJournal }
      })

    embed.setTitle("Save Complete")
      .setColor(0x7289DA)
      .setDescription("Thanks for using DailyJournal! All messages in this thread have been saved. This thread will be automatically deleted in 5 seconds")
    await interaction.followUp({ embeds: [embed] })
  }

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