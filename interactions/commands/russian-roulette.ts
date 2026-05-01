import type { ChatInputCommandInteraction } from "discord.js";
import registerMember from "../../utils/registerMember";
import db from "../../utils/db";
import { currencies, multiplierRoles, wallets } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

export default async function (interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild!.members.fetch(interaction.user.id);
  const p = await registerMember(member);
  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, interaction.guild!.id))
    .get();

  if (!currency) return;

  const pick = interaction.options.getNumber("pick", true);
  const money = interaction.options.getNumber("money", true);

  let purse = p.amount!;

  if (money >= 1000) {
    await interaction.reply({
      content: `> :x: You can't bet 1000 or more!`,
    });

    return;
  }

  if (money > purse) {
    await interaction.reply({
      content: `> :x: You don't have enough ${currency.emoji} ${currency.name} to do that!`,
    });

    return;
  }

  let roulette = [0, 0, 0, 0, 0, 0];

  for (let i = 0; i < 1 + Math.floor(Math.random() * 5); i++) {
    const rdShotPos = Math.floor(Math.random() * roulette.length);
    roulette[rdShotPos] = 1;
  }

  let gotShot = false;

  let index = 0;

  for (let i = 0; i < pick; i++) {
    if (roulette[index] === 1) gotShot = true;
    index++;
  }

  if (gotShot) {
    purse = purse - money;

    await db
      .update(wallets)
      .set({ amount: purse })
      .where(eq(wallets.userId, interaction.user.id));

    let embed = embeds
      .base()
      .setTitle(`Bet better, you got shot!`)
      .setColor("Red");

    await interaction.reply({ embeds: [embed] });
  } else {
    let m = Math.round(money * 1.5);
    let embed = embeds
      .base()
      .setTitle(`You survived! +${m} ${currency.emoji} ${currency.name}`);

    let gain = purse + m;

    const multipliers = db
      .select()
      .from(multiplierRoles)
      .where(eq(multiplierRoles.guildId, interaction.guild!.id))
      .all();

    const member = await interaction.guild?.members.fetch(interaction.user.id)!;

    for (let { roleId, multiplier } of multipliers) {
      if (member.roles.cache.has(roleId)) {
        gain = Math.round(gain * multiplier!);
      }
    }

    await db
      .update(wallets)
      .set({ amount: gain })
      .where(eq(wallets.userId, interaction.user.id));

    await interaction.reply({ embeds: [embed] });
  }
}
