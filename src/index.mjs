import {DiscordSetup} from "./discord.mjs";

import { Client, Intents } from 'discord.js';

export const discord_client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

DiscordSetup()