const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-entry') //name of command (displayed in discord)
    .setDescription('Add an entry to the journal'), //description of command (displayed in discord)

  async execute(interaction) {

    const channel = interaction.channel
    const user = interaction.user
    const userName = user.username
    const threadName = userName + "'s-Daily-Journal"
    const privateThread = 12
    const thread = channel.threads.cache.find(x => x.name === threadName)

    if (thread === undefined) {

      await interaction.reply({ content: '<@' + user + '>\nIts time to add an entry to your daily journal! A private thread has been created for you named: ' + threadName, ephemeral: true })

      try {
        // Create a new private thread
        const threadChannel = await channel.threads
          .create({
            name: threadName,
            autoArchiveDuration: 60,
            type: privateThread,
            reason: 'Daily journal',
          })

        await threadChannel.members.add(user);

        await threadChannel.send({ content: 'Hello ' + userName + '! ' })
        await threadChannel.send({
          content: "Its time to add to your daily journal!\nWhen you're done typing remember to `/save` your entry.\nI will close this thread once your done," +
            "but don't worry! You can always add something to today's entry with `/add-entry`.\n**Remember: Moderators can see the contents of this thread.**"
        })

      } catch (error) {
        console.log(error)
      }

    } else {
      await interaction.reply({ content: '<@' + user + '>\nIt seems you still have an active journal entry named ' + threadName + '!', ephemeral: true })

      await thread.send({ content: 'Hello <@' + user + '>, ' })
      await thread.send({
        content: "This is your daily Journal!\nWhen you're done typing remember to `/save` your entry.\nI will close this thread once your done," +
          "but don't worry! You can always add something to today's entry with `/add-entry`.\n**Remember: Moderators can see the contents of this thread.**"
      })
    }
  }
}