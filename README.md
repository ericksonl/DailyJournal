# DailyJournal

DailyJournal is a Discord bot that brings the joy of journaling to your server. With DailyJournal, you can keep track of your thoughts, experiences, and reflections right within Discord. It provides a private and personal space for users to express themselves, set goals, and document their daily journey.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)

## About

DailyJournal is a secure and private Discord bot that brings the joy of journaling to your server. With DailyJournal, you can keep track of your thoughts, experiences, and reflections with peace of mind.

<sub><sup>
Disclaimer: This bot uses private threads to be your journal space. These threads can only be seen by you, the DailyJournal bot and users with Admin priviledges. Threads are automatically deleted once you save your journal. 
</sup></sub>

## Features

* **Encryption at Rest:** All messages added to your journal are encrypted using AES encryption, ensuring that your entries remain confidential and secure.
* **Past Journal Entry Lookup:** Easily browse and revisit your past journal entries, providing a valuable reference to reflect on your personal growth and experiences.
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
MASTER_KEY = <Strong key you create>
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
| `/setup` | Set up DailyJournal | None | - First time running `/setup` | `/setup`
| `/add-entry` | Add an entry to your journal | None | - Must be run in a valid text channel (where a thread can be created) | `/add-entry`
| `/get-entry` | Sends you a DM with your journal entry for the specified date | `date` | Must have completed `/setup` | `/get-entry 01/01/2020`
| `/delete-entry` | Deletes the journal entry for the specified date | `date` | Must have completed `/setup` | `/delete-entry 1/01/2020`
| `/save` | Save your journal entry | None | - Can only be used in your personal journal thread <br /> - Must have completed `/setup` | `/save`
| `/index` | See a list of your journal entry dates | None | Must have completed `/setup` | `/index pass1234`
| `/mood-chart` | Sends you a graphical representation of your documented moods | None | Must have completed `/setup` | `/mood-chart`
| `/help` | Displays all the commands of the bot | None | None | `/help`
