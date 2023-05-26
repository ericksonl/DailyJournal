const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mood-tracker')
    .setDescription('Sends a graph of your moods'),

  async execute(interaction) {
    const user = interaction.user.id

    const numArray = [1, 2, 3, 4, 2, 3, 1];

    const savePath = './helperFunctions/graphImages/graph.png';

    const pythonProcess = spawn('python', ['./helperFunctions/plotMoods.py', ...numArray, user]);

    pythonProcess.stdout.on('data', (data) => {
      // Handle any output from the Python script if needed
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        interaction.channel.send({
          files: [
            {
              attachment: savePath,
              name: 'graph.png',
            },
          ],
        });
      } else {
        interaction.reply('There was an error while generating the graph.');
      }
    });
  },
};