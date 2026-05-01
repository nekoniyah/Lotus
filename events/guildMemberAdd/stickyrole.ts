import { and, eq } from "drizzle-orm";
import { memberRoles, stickyRoles } from "../../src/db/schema";
import db from "../../utils/db";
import { TemplateEvent } from "../../utils/typers";

export default TemplateEvent<"guildMemberAdd">(async (member) => {
  const allStickyRoles = db
    .select()
    .from(stickyRoles)
    .where(eq(stickyRoles.guildId, member.guild.id))
    .all();

  for (let stickyRole of allStickyRoles) {
    const pRole = db
      .select()
      .from(memberRoles)
      .where(
        and(
          eq(memberRoles.userId, member.id),
          eq(memberRoles.roleId, stickyRole.roleId),
        ),
      )
      .get();

    if (!pRole) continue;

    const role = await member.guild.roles.fetch(pRole.roleId);

    if (role) member.roles.add(role);
    else {
      await db.delete(memberRoles).where(eq(memberRoles.roleId, pRole.roleId));
    }
  }
});
