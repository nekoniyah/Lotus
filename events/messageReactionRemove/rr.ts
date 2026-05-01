import "dotenv/config";
import { writeFileSync } from "fs";
import path from "path";
import { TemplateEvent } from "../../utils/typers";
import { reactionRoles } from "../../src/db/schema";
import db from "../../utils/db";
import { and, eq } from "drizzle-orm";

export default TemplateEvent<"messageReactionAdd">(async (reaction, user) => {
  if (!reaction.message.guild) return;
  if (user.bot) return;

  const rr = db
    .select()
    .from(reactionRoles)
    .where(
      and(
        eq(reactionRoles.channelId, reaction.message.channel.id),
        eq(reactionRoles.emoji, reaction.emoji.name!),
      ),
    )
    .get();

  if (!rr) return;

  if (!reaction.users.cache.get(reaction.client.user.id)) {
    reaction.message.reactions.cache.forEach(async (r) => {
      if (r.emoji.name === reaction.emoji.name) {
        await r.remove();
      }
    });

    // Remove reaction role from db

    await db
      .delete(reactionRoles)
      .where(eq(reactionRoles.emoji, reaction.emoji.name!));

    return;
  }

  let member = await reaction.message.guild.members.fetch(user.id);

  const role = member.guild.roles.cache.get(rr.roleId);
  if (member.roles.cache.get(rr.roleId)) member.roles.remove(role!);

  return;
});
