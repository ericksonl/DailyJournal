const fs = require('fs')
const setupSchema = require('../mongooseSchema/schema.js')
const { SlashCommandBuilder } = require('discord.js')
const { spawn } = require('child_process')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mood-tracker')
    .setDescription('Sends a graph of your moods'),

  async execute(interaction) {

    const user = interaction.user.id

    const userName = interaction.user.username

    const data = await setupSchema.findOne({ UserID: user })

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

    const keys = Object.keys(data.MoodChart)
    const values = Object.values(data.MoodChart)

    const num_array = values
    const val_array = keys

    const args = [num_array, val_array, user, userName];

    const savePath = `./helperFunctions/graphImages/${user}graph.png`

    const pythonProcess = spawn('python', ['./helperFunctions/plotMoods.py', ...args])

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        fs.readFile(savePath, (err, data) => {
          if (err) {
            console.error('Error reading the image:', err)
          } else {
            console.log('Python script finished. Sending the image to the client...')
            interaction.reply({
              files: [
                {
                  attachment: data,
                  name: 'graph.png',
                },
              ],
            })
            fs.unlink(savePath, (err) => {
              if (err) {
                console.error('Error deleting the file:', err);
              } else {
                console.log('File deleted successfully');
              }
            });
          }
        })
      } else {
        console.error(`Python script exited with code ${code}`)
      }
    })
  }
}


