const { SlashCommandBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-entry') //name of command (displayed in discord)
    .setDescription('Add an entry to your journal'), //description of command (displayed in discord)

  async execute(interaction) {

    const channel = interaction.channel
    const user = interaction.user
    const userName = user.username
    const userId = user.id
    //Have to get the user's discriminator in the event two people have the same name
    const threadName = userName + "#" + user.discriminator + "'s-Daily-Journal"
    const privateThread = 12

    // 0 is normal text channel
    //If command is run inside anything besides a GUILD_TEXT channel the command will error
    if (channel.type !== 0) {
      interaction.reply("Sorry, you cannot do that in this channel!")
      return
    }
    
    //search through entire guild to find thread with the same name
    const thread = channel.guild.channels.cache.find(x => x.isThread() && x.name === threadName)

    setupSchema.findOne({ UserID: userId }, async (err, data) => {
      //if no data, user has not completed setup
      if (!data) {
        
        await interaction.reply({ content: "Welcome to DailyJournal!"
        , ephemeral: true})
        
        //else if there is data, and a current journal open, redirect user to the open journal
      } else if (data && thread !== undefined) {

        await interaction.reply({ content: '<@' + user + '>\nIt seems you still have an active journal entry named ' + threadName + '!', ephemeral: true })

        await thread.send({ content: 'Hello <@' + user + '>, ' })
        await thread.send({
          content: "This is your DailyJournal!\nWhen you're done typing remember to `/save` your entry.\nI will close this thread once your done," +
            "but don't worry! You can always add something to today's entry with `/add-entry`.\n**Remember: Moderators can see the contents of this thread.**"
        })

        //else there is data and no current journal open, so create a journal
      } else {

        await interaction.reply({ content: '<@' + user + '>\nJournal time! A private thread has been created for you named: ' + threadName, ephemeral: true })

        try {
          // Create a new private thread
          const threadChannel = await channel.threads
            .create({
              name: threadName,
              autoArchiveDuration: 60,
              type: privateThread,
              reason: 'DailyJournal',
            })

          await threadChannel.members.add(user);

          await threadChannel.send({ content: 'Hello ' + userName + '! ' })
          await threadChannel.send({
            content: "Its time to add to your DailyJournal!\nWhen you're done typing remember to `/save` your entry.\nI will close this thread once your done," +
              "but don't worry! You can always add something to today's entry with `/add-entry`.\n**Remember: Moderators can see the contents of this thread.**"
          })

        } catch (error) {
          console.log(error)
        }
      }
    })
  }
}