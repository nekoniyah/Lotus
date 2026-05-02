import type { GuildMember } from "discord.js";
import db from "./db";
import { levels, wallets } from "../src/db/schema";
import { and, eq } from "drizzle-orm";

export default async function registerMember(member: GuildMember) {
  let levelProfile = db
    .select()
    .from(levels)
    .where(
      and(
        eq(levels.guildId, member.guild.id),
        eq(levels.userId, member.user.id),
      ),
    )
    .get();

  if (!levelProfile) {
    levelProfile = db
      .insert(levels)
      .values({ guildId: member.guild.id, userId: member.user.id })
      .returning()
      .get();
  }

  let profile = db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, member.user.id))
    .get();

  if (!profile) {
    profile = db
      .insert(wallets)
      .values({
        guildId: member.guild.id,
        userId: member.user.id,
        amount: 0,
      })
      .returning()
      .get();
  }

  return {
    ...levelProfile,
    ...profile,
  };
}
