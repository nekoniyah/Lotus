import type { ChatInputCommandInteraction } from "discord.js";
import registerMember from "../../utils/registerMember";
import db from "../../utils/db";
import { currencies } from "../../src/db/schema";
import { eq } from "drizzle-orm";

export default async function (interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild!.members.fetch(interaction.user.id);
  const profile = await registerMember(member);
  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, interaction.guild!.id))
    .get();

  if (!currency) throw Error();

  await interaction.reply({
    content: `You have ${profile.amount} ${currency.emoji} ${currency.name}`,
    flags: ["Ephemeral"],
  });
}
