# DailyJournal
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue.svg)](https://github.com/ericksonl/DailyJournal/blob/main/LICENSE)

DailyJournal is a Discord bot that brings the joy of journaling to your server. With DailyJournal, you can keep track of your thoughts, experiences, and reflections right within Discord. It provides a private and personal space for users to express themselves, set goals, and document their daily journey.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)
- [License](#license)

## About

DailyJournal is a secure and private Discord bot that brings the joy of journaling to your server. With DailyJournal, you can keep track of your thoughts, experiences, and reflections with peace of mind.

## Features

* **Encryption at Rest:** All messages added to your journal are encrypted using AES encryption, ensuring that your entries remain confidential and secure.
* **Password Protection:** Each entry is password protected using the user's chosen password, adding an extra layer of security to your personal writings.
* **Secure Password Storage:** Passwords are securely hashed using salt and bcrypt, preventing unauthorized access to your journal.
* **Past Journal Entry Lookup:** Easily browse and revisit your past journal entries, providing a valuable reference to reflect on your personal growth and experiences.
* **Entry Sharing:** Share selected entries with others, allowing you to express and communicate your thoughts, stories, or ideas with friends or trusted individuals.
* **Mood Chart:** Track your mood over time with a built-in mood chart, providing insights into your emotional well-being and patterns.

## Installation

* Download and set up Node.js
* Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications). Save the `Token` and `Client ID Token`. A guide to do this can be found [here](https://developer.twitter.com/en/docs/projects/overview#:~:text=To%20create%20a%20Project%2C%20click,%2C%20description%2C%20and%20use%20case.)
* Create a new project in [MongoDB](https://cloud.mongodb.com/). Save the `Connection String`. A guide to do this can be found [here](https://www.mongodb.com/docs/cloud-manager/tutorial/manage-projects/)

After you have the necessary requirements, run the following commands:

```sh
git clone https://github.com/ericksonl/DailyJournal.git
cd DailyJournal
npm install
```

## Commands

> Note: DailyJournal uses Discord slash commands

| Command | Description | Arguments | Requirements | Usage(s) |
| --- | --- | --- | --- | --- |
| `/setup` | Set up DailyJournal | `set-password` | - Hasn't run setup yet | `/setup pass1234`
| `/addEntry` | Add an entry to your journal | None | - Must be a valid text channel | `/addEntry`
| `/getEntry` | Get entry from specified date | `password` <br /> `date` | None | `/getEntry pass1234 1/01/2020`
| `/save` | Save your journal entry | `password` | - Must be inside a journal text channel | `/save pass1234`
| `/help` | Displays all the commands of the bot. <br /> Providing the name of a command will return all available information about that command. | `Command` | None | `/help` <br /> `/help command`

## License

CC BY-NC 4.0 License

Copyright (c) [2023] [Liam Erickson]

[Full license text](https://github.com/ericksonl/DailyJournal/blob/main/LICENSE)
