import dayjs from "dayjs";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";
import registerMember from "../../utils/registerMember";
import db from "../../utils/db";
import { currencies, memberQuizzes, quizzes } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import embeds from "../../utils/embeds";

export default async function (interaction: ChatInputCommandInteraction) {
  const member = await interaction.guild!.members.fetch(interaction.user.id);
  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, interaction.guild!.id))
    .get();

  if (!currency) return;

  const daDayJs = dayjs(Date.now());

  const lastQuiz = db
    .select()
    .from(memberQuizzes)
    .where(eq(memberQuizzes.userId, interaction.user.id))
    .get();

  const quizzeX = db.select().from(quizzes).all();

  let accept = true;

  if (lastQuiz) {
    const lastDayJs = dayjs(lastQuiz.lastQuizAt as number);

    if (
      daDayJs.hour() - lastDayJs.hour() <= 3 &&
      daDayJs.format("DD/MM/YYYY") === lastDayJs.format("DD/MM/YYYY")
    )
      accept = false;
  }

  if (!accept) {
    let embed = embeds.error("You already did a quiz in the last 3 hours");

    await interaction.reply({
      embeds: [embed],
      flags: ["Ephemeral"],
    });

    return;
  }

  let components: any[] = [];
  let row = new ActionRowBuilder();

  let i = 1;
  let gi = 1;

  if (!quizzeX.length) {
    await interaction.reply({
      embeds: [embeds.error("No quiz has been created yet :c")],
      flags: ["Ephemeral"],
    });
    return;
  }

  const rdQuiz = quizzeX[Math.floor(Math.random() * quizzeX.length)]!;

  const buttonCountPerRow = rdQuiz.options!.split(";").length;

  for (let b of rdQuiz.options!.split(";")) {
    const buttonComponent = new ButtonBuilder()
      .setCustomId(`quiz-${rdQuiz.id}-${gi}`)
      .setLabel(b)
      .setStyle(ButtonStyle.Primary);

    row.addComponents(buttonComponent);

    if (i == buttonCountPerRow) {
      components.push(row.toJSON());
      row = new ActionRowBuilder();
      i = 0;
    }

    i++;
    gi++;
  }

  const embed = embeds
    .base()
    .setTitle(rdQuiz.question)
    .setFooter({ text: interaction.user.id });

  await interaction.reply({
    content: `**Quiz! - Guess right and earns ${rdQuiz.amount} ${currency.emoji} ${currency.name}**`,
    embeds: [embed],
    components,
  });

  if (lastQuiz) {
    await db
      .update(memberQuizzes)
      .set({ lastQuizAt: Date.now() })
      .where(eq(memberQuizzes.userId, interaction.user.id));
  } else await db.insert(memberQuizzes).values({ userId: interaction.user.id });
}
