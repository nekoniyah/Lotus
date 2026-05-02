import "dotenv/config";
import { TextChannel } from "discord.js";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { guilds, levelRoles, levels } from "../../src/db/schema";
import { and, eq } from "drizzle-orm";
import * as embeds from "../../utils/embeds";
import registerMember from "../../utils/registerMember";

export default TemplateEvent<"messageCreate">(async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const guildConfig = db
    .select()
    .from(guilds)
    .where(eq(guilds.id, message.guild.id))
    .get();

  if (!guildConfig) return;

  const member = await message.guild.members.fetch(message.author);
  let profile = await registerMember(member);

  // Give experience based on length of the message (divided by 2, rounded down)
  let experienceToGive = 1;

  if (message.content) {
    experienceToGive = 1 + Math.ceil(message.content.length / 2);
  } else if (message.attachments.size) {
    experienceToGive = 1 + message.attachments.size;
  }

  const level = profile.level ?? 0;
  const xp = profile.experience ?? 0;
  const experienceNeededToLevelUp = 100 + level * 150;

  const allLevelRoles = db
    .select()
    .from(levelRoles)
    .where(eq(levelRoles.guildId, message.guild.id))
    .all();

  for (let lrg of allLevelRoles) {
    if (level >= lrg.level) {
      const role = await message.guild.roles.fetch(lrg.roleId);

      if (!member.roles.cache.has(lrg.roleId)) member.roles.add(role!);
    }
  }

  if (xp >= experienceNeededToLevelUp) {
    const newLevel = level + 1;
    await db
      .update(levels)
      .set({ experience: 0, level: newLevel })
      .where(eq(levels.userId, message.author.id));

    const embed = embeds
      .base({ icon: message.author.displayAvatarURL(), user: message.author })
      .setTitle("Level Up!")
      .setDescription(`Congrats, you passed level ${newLevel}`);

    if (guildConfig.levelingChannelId) {
      const ch = (await message.guild.channels.fetch(
        guildConfig.levelingChannelId,
      )) as TextChannel;

      ch.send({
        content: `<@${message.author.id}>`,
        embeds: [embed],
        allowedMentions: { parse: [] },
      });
    }
  } else {
    await db
      .update(levels)
      .set({ experience: xp + experienceToGive })
      .where(eq(levels.userId, message.author.id));
  }
});
