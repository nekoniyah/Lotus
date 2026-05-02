import type { ChatInputCommandInteraction } from "discord.js";
import embeds from "../../utils/embeds";
import db from "../../utils/db";
import { guilds, levelRoles } from "../../src/db/schema";
import { eq } from "drizzle-orm";

const leveling = async (interaction: ChatInputCommandInteraction) => {
  const sc = interaction.options.getSubcommand(true);
  const roles = db
    .select()
    .from(levelRoles)
    .where(eq(levelRoles.guildId, interaction.guild!.id))
    .all();

  if (sc === "list") {
    let text = "";

    for (let l of roles) {
      text += `\`${l.roleId}\` - <@&${l.roleId}> is earned at level ${l.level} \n`;
    }

    const embed = embeds
      .base()
      .setDescription(text || "No level-role registered.");

    await interaction.reply({
      embeds: [embed],
      flags: ["Ephemeral"],
    });

    return;
  }

  if (sc === "add") {
    await db.insert(levelRoles).values({
      guildId: interaction.guild!.id,
      level: interaction.options.getNumber("min_level", true),
      roleId: interaction.options.getRole("role", true).id,
    });
  }

  if (sc === "remove") {
    const id = interaction.options.getString("id", true);

    await db.delete(levelRoles).where(eq(levelRoles.roleId, id));
  }

  if (sc === "channel") {
    const channel = interaction.options.getChannel("channel", true);

    await db
      .update(guilds)
      .set({ levelingChannelId: channel.id })
      .where(eq(guilds.id, interaction.guildId!));
  }

  await interaction.reply({
    content: "> :white_check_mark: Ok!",
    flags: ["Ephemeral"],
  });
};
export default leveling;
