import type { ChatInputCommandInteraction } from "discord.js";
import db from "../../utils/db";
import { currencies, wallets } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import registerMember from "../../utils/registerMember";
import embeds from "../../utils/embeds";

export default async function (interaction: ChatInputCommandInteraction) {
  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, interaction.guild!.id))
    .get();

  if (!currency) return;

  const user = interaction.options.getUser("user")
    ? interaction.options.getUser("user", true)
    : interaction.user;

  const member = await interaction.guild!.members.fetch(user.id);
  const p = await registerMember(member);

  const sc = interaction.options.getSubcommand(true);

  if (sc === "give") {
    const amount = interaction.options.getNumber("amount", true);

    await db
      .update(wallets)
      .set({ amount: p.amount! + amount })
      .where(eq(wallets.userId, user.id));

    const embed = embeds
      .base()
      .setTitle(`Gave ${amount} ${currency.emoji} ${currency.name} to ${user}`);

    await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });
  }
}
