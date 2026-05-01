import path from "path";
import fs from "fs";
import { TemplateEvent } from "../../utils/typers";
import {
  currencies,
  memberQuizzes,
  multiplierRoles,
  quizzes,
  wallets,
} from "../../src/db/schema";
import db from "../../utils/db";
import registerMember from "../../utils/registerMember";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

export default TemplateEvent<"interactionCreate">(async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("quiz")) return;
  const member = await interaction.guild!.members.fetch(interaction.user.id);
  const profile = await registerMember(member);
  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, interaction.guild!.id))
    .get();

  if (!currency) throw Error();

  const quizzesX = db.select().from(quizzes).all();

  const quiz = quizzesX.find((q: any) =>
    interaction.customId.startsWith(`quiz-${q.id}`),
  );

  if (!quiz) return;

  const u = interaction.message.embeds[0]!.footer!.text;

  if (u !== interaction.user.id) {
    await interaction.reply({
      content: "Tss.. not yours!",
      flags: ["Ephemeral"],
    });
    return;
  }

  const optionIndex = parseInt(
    interaction.customId.replace(`quiz-${quiz.id}-`, ""),
  );
  const opt = quiz.options!.split(";")[optionIndex - 1];

  if (opt === quiz.answer) {
    let gain = profile.amount! + quiz.amount!;

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

    const embed = embeds.success(
      `Right! You earned ${quiz.amount} ${currency.emoji} ${currency.name}.`,
    );

    await interaction.message.edit({
      content: "",
      components: [],
      embeds: [embed],
    });

    await interaction
      .reply({ content: "_ _" })
      .then(async (i) => await i.delete());
  } else {
    const embed = embeds.error("Wrong! Try next time :c");
    await interaction.message.edit({
      content: "",
      components: [],
      embeds: [embed],
    });
  }
});
