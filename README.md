# DailyJournal

DailyJournal is a Discord bot that brings the joy of journaling to your server. With DailyJournal, you can keep track of your thoughts, experiences, and reflections right within Discord. It provides a private and personal space for users to express themselves, set goals, and document their daily journey.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)

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
* Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications). Save the `Token` and `Client ID Token`. A guide to do this can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
* Create a new project in [MongoDB](https://cloud.mongodb.com/). Save the `Connection String`. A guide to do this can be found [here](https://www.mongodb.com/docs/cloud-manager/tutorial/manage-projects/)

Create a .env file in the root directory. It should look like the following:

```env
DISCORD_TOKEN = <Token>
CLIENT_ID = <Client ID Token>

DATABASE_TOKEN = <Connection String>
```

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
| `/setup` | Set up DailyJournal | `set-password` | - First time running `/setup` | `/setup pass1234`
| `/forgot-pass` | Change your password if you have forgotten it | `new-password` | - Must have completed `/setup` | `/forgot-pass newPass1234`
| `/add-entry` | Add an entry to your journal | None | - Must be run in a valid text channel (where a thread can be created) | `/add-entry`
| `/save` | Save your journal entry | `password` | - Can only be used in your personal journal thread <br /> - Must have completed `/setup` | `/save pass1234`
| `/get-entry` | Sends you a DM with your journal entry for the specified date | `password` <br /> `date` | Must have completed `/setup` | `/getEntry pass1234 1/01/2020`
| `/help` | Displays all the commands of the bot. | None | None | `/help`