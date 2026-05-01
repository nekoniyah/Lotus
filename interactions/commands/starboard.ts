import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import db from "../../utils/db";
import { starboards } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const starboard = async (interaction: ChatInputCommandInteraction) => {
  const minimum_stars = interaction.options.getNumber("minimum_stars", true);
  const channel = interaction.options.getChannel(
    "channel",
    true,
  ) as TextChannel;

  const foundOne = db
    .select()
    .from(starboards)
    .where(eq(starboards.guildId, interaction.guildId!))
    .get();

  if (foundOne) {
    await db
      .update(starboards)
      .set({ channelId: channel.id, goal: minimum_stars });
  } else {
    await db
      .insert(starboards)
      .values({
        channelId: channel.id,
        guildId: interaction.guildId!,
        goal: minimum_stars,
      });
  }

  await interaction.reply({
    content: "> :white_check_mark: Ok!",
    flags: ["Ephemeral"],
  });
};

export default starboard;
