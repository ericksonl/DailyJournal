const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-entry') //name of command (displayed in discord)
    .setDescription('Add an entry to the journal'), //description of command (displayed in discord)

  async execute(interaction) {

    const channel = interaction.channel
    const user = interaction.user.username

    const threadName = user + "'s-Daily-Journal"

    // Create a new private thread
    channel.threads
      .create({
        name: threadName,
        autoArchiveDuration: 60,
        type: 12,
        reason: 'Needed a separate thread for moderation',
      })
      .then(threadChannel => console.log(threadChannel))
      .catch("BAD BAD" + console.error);

    const thread = channel.threads.cache.find(x => x.name === threadName);
    await thread.members.add(interaction.user);

    await interaction.reply({ content: 'Its time to add an entry to your daily journal! A private thread has been created for you named: ' + threadName, ephemeral: true })

    // embed.setTitle("Daily Entry")
    // .setColor(0x7289DA)
    // .setAuthor({

    // })

    // await interaction.reply({ embeds: [embed] })

    //   //changed this
    //   await message.reply({embeds: [suggestEmbed]}).then(function (message) {
    //       message.react("👍")
    //       message.react("👎")
    //       message.startThread({
    //           name: `${threadAuthor}-${message.createdTimestamp}`,
    //           autoArchiveDuration: 60,
    //           type: 'GUILD_PUBLIC_THREAD'
    //       });
    //   });


  }
}