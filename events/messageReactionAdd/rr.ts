import "dotenv/config";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { reactionRoles } from "../../src/db/schema";
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

  let member = await reaction.message.guild.members.fetch(user.id);

  const role = member.guild.roles.cache.get(rr.roleId);
  if (!member.roles.cache.get(rr.roleId)) member.roles.add(role!);

  return;
});
