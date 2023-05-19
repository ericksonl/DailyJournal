//TODO: Get entry from saved entries
//Entries are encrypted with users actual passcode
//Decrypt and recrypt all messages(?) after they change their passcode
//Look into adding encryption to entire array, rather than each message


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const setupSchema = require('../mongooseSchema/schema.js')

const CryptoJS = require("crypto-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-entry') //name of command (displayed in discord)
    .setDescription('Responds with pong'), //description of command (displayed in discord)

  async execute(interaction) {
    const user = interaction.user.id

    interaction.reply("huh")
  }
}