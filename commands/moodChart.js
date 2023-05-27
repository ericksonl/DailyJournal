const fs = require('fs')
const setupSchema = require('../mongooseSchema/schema.js')
const { SlashCommandBuilder } = require('discord.js')
const { spawn } = require('child_process')


//TODO: 
// Create mood charts for the month and year
// Graphs are set sizes, and the more data the worse the graph looks

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mood-chart')
    .setDescription('Sends you a graphical representation of your documented moods'),

  async execute(interaction) {
    // Gather user ID and username
    const user = interaction.user.id
    const userName = interaction.user.username

    // Retrieve data from database
    const data = await setupSchema.findOne({ UserID: user })

    await interaction.reply({
      content: "Compiling your mood chart...",
      ephemeral: true
    })

    // Check if user has data in the databse
    if (!data) {
      // User is a first-time user, provide setup instructions
      await interaction.reply({
        content: `Welcome to DailyJournal! It seems you're a first-time user. Please complete the setup to get started!
          \nTo start, you need to set up your account and create a password using the command "/setup". Your password will be used to access your past journal entries.
          \n**WRITE THIS DOWN IN A SAFE PLACE AND DO NOT GIVE IT OUT TO ANYONE**`,
        ephemeral: true
      })
      return
    }

    // Extract keys and values from MoodChart object
    const val_array = Object.keys(data.MoodChart)
    const num_array = Object.values(data.MoodChart)

    console.log(val_array, num_array)

    if (val_array.length === 0 || num_array.length === 0) {
      // User is a first-time user, provide setup instructions
      await interaction.reply({
        content: "Hey there DailyJournal user!\nTo be able to access your Mood Chart, you must have at least one entry!\nYou can start a new journal entry by typing `/add-entry`",
        ephemeral: true
      })
      return
    }

    // Prepare arguments to pass to Python script

    //TODO:
    // Have the user give a month or by default resort to the year
    // Idk if theres a better way but im sure you can think of it when its not 2am
    // GOd im tired

    const month = "June"
    const args = [num_array, val_array, user, userName, month]
    const savePath = `./helperFunctions/graphImages/${user}graph.png`

    // Spawn a child process for running the Python script
    const pythonProcess = spawn('python', ['./helperFunctions/plotMoods.py', ...args])

    // Listen for the close event of the Python process
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        fs.readFile(savePath, async (err, data) => {
          if (err) {
            console.error('Error reading the image:', err)
          } else {
            console.log('Python script finished. Sending the image to the client...')
            // Send image to user's DMs
            await interaction.user.send({
              files: [
                {
                  attachment: data,
                  name: 'graph.png',
                },
              ],
            })
              .then(async () => {
                await interaction.followUp({ content: "Your mood chart has been sent to your DM's", ephemeral: true })
              })

            // Delete the generated image
            fs.unlink(savePath, (err) => {
              if (err) {
                console.error('Error deleting the file:', err)
              } else {
                console.log('File deleted successfully')
              }
            })
          }
        })
      } else {
        console.error(`Python script exited with code ${code}`)
      }
    })
  }
}


