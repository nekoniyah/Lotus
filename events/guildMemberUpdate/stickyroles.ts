import "dotenv/config";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { memberRoles } from "../../src/db/schema";
import { and, eq } from "drizzle-orm";

export default TemplateEvent<"guildMemberUpdate">(async (oldMember, member) => {
  if (member.user.bot) return;

  try {
    await member.fetch();

    const oldRoles = oldMember.roles.cache;
    const memberRolesx = (await member.fetch()).roles.cache;

    let addedRoles = [];
    let removedRoles = [];

    for (let [id, _] of oldRoles) {
      if (!memberRolesx.has(id)) removedRoles.push(_);
    }

    for (let [id, _] of memberRolesx) {
      if (!oldRoles.has(id)) addedRoles.push(_);
    }

    for (let addedRole of addedRoles) {
      await db.insert(memberRoles).values({
        guildId: member.guild.id,
        roleId: addedRole.id,
        userId: member.user.id,
      });
    }

    for (let removedRole of removedRoles) {
      const pRole = db
        .select()
        .from(memberRoles)
        .where(
          and(
            eq(memberRoles.userId, member.user.id),
            eq(memberRoles.roleId, removedRole.id),
          ),
        )
        .get();

      if (pRole) {
        await db
          .delete(memberRoles)
          .where(
            and(
              eq(memberRoles.userId, member.user.id),
              eq(memberRoles.roleId, removedRole.id),
            ),
          );
      }
    }
  } catch {}
});
