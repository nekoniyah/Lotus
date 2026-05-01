import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import fs from "fs";
import path from "path";
import db from "../../utils/db";
import { guilds } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const logs = async (interaction: ChatInputCommandInteraction) => {
  const channel = interaction.options.getChannel(
    "channel",
    true,
  ) as TextChannel;

  await db
    .update(guilds)
    .set({ logChannelId: channel.id })
    .where(eq(guilds.id, interaction.guild!.id));

  await interaction.reply({
    content: "> :white_check_mark: Ok!",
    flags: ["Ephemeral"],
  });

  await channel.send({
    content:
      "Logs of ticket creation, deletion, etc as well as other stuff with be sent here!",
  });
};

export default logs;
