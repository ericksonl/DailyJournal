const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
// const setupSchema = require('../mongooseSchema/setup.js')

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

    const embed = new EmbedBuilder()

    var contentArr = []
    var outArr = []

    if (channelType !== privateThread) {
      interaction.reply("This is not a private thread!")
    } else if (channel.name !== threadName) {
      interaction.reply("This is not your journal!")
    } else {
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
        console.log(error)
      }

      await interaction.reply({ embeds: "Saving..." })

      // journalSchema(user, outArr)
    }
  }
}


// async function journalSchema(user, inArray) {
//   //first see if there already exists a database for UserID
//   setupSchema.findOne({ UserID: user }, async (err, data) => {
//     //if no data, create an object for the user
//     if (!data) {
//       //Get user to create a key

//       //if not, create a new one
//       await setupSchema.create({
//         UserID: user,
//         Key: key,
//         DailyJournal: inArray
//       })



//     } else {

//       //add contents of outArr to 

//       let result = await setupSchema.updateOne(
//         { UserID: user },
//         {
//           $set: { DailyJournal: update }
//         })
//       console.log(result)

//       embed.setTitle("Save Complete")
//         .setColor(0x7289DA)
//         .setDescription("Thanks for using DailyJournal! All messages in this thread have been saved. This thread will be automatically deleted in x hours")
//       await interaction.followUp({ embeds: [embed] })

//     }
//   })
// }