const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('save') //name of command (displayed in discord)
    .setDescription('Save your entry'), //description of command (displayed in discord)

  async execute(interaction) {

    const channel = interaction.channel
    const channelType = channel.type
    const privateThread = 12

    const guildID = interaction.guild.id
    const user = interaction.user
    const userName = user.username
    const threadName = userName + "'s-Daily-Journal"

    var contentArr = []
    var outArr = []

    if (channelType !== privateThread) {
      interaction.reply("This is not a private thread!")
    } else if (channel.name !== threadName) {
      interaction.reply("This is not your journal!")
    } else {
      await interaction.reply({ content: "Saving..." })
      try {
        const messages = await channel.messages.fetch({ limit: 100 })
        console.log("Fetching messages...")
        const allMessagesPostedByUser = messages.filter(msg => msg.author.id === user.id)

        console.log("Messages collected. Adding to array...")
        allMessagesPostedByUser.forEach(message => contentArr.push(message.content))

        console.log("Previewing message array...")
        console.log(contentArr)

        console.log("Merging array...")

        outArr = contentArr.reverse()
        console.log(outArr)

      } catch (error) {
        await interaction.followUp({ content: "There was a problem saving your messages. Please try again later" })
        console.log(error)
      }

      await interaction.followUp({ content: "Successfully saved!" })

      journalSchema(interaction, user, outArr)
    }
  }
}

async function journalSchema(interaction, user, inArray) {
  const embed = new EmbedBuilder()
  //first see if there already exists a database for UserID
  setupSchema.findOne({ UserID: user.id }, async (err, data) => {
    //if no data, create an object for the user

    if (!data) {
      interaction.followUp("How are you here right now....")

    } else {

      let items = data.DailyJournal
      items.push(inArray)

      await setupSchema.updateOne(
        { UserID: user.id },
        {
          $set: { DailyJournal: items }
        })

      embed.setTitle("Save Complete")
        .setColor(0x7289DA)
        .setDescription("Thanks for using DailyJournal! All messages in this thread have been saved. This thread will be automatically deleted in 10 seconds")
      await interaction.followUp({ embeds: [embed] })

      const delay = ms => new Promise(res => setTimeout(res, ms));
      
      await delay(10000);
      let thread = interaction.channel
      try {
        await thread.delete();
      } catch (error) {
        interaction.followUp("There was an error when trying to delete the thread!\nPlease manually close this thread.")
        console.log(error)
      }
    }
  })
}