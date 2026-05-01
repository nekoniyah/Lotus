import type { ChatInputCommandInteraction } from "discord.js";
import db from "../../utils/db";
import { quizzes } from "../../src/db/schema";

export default async function (interaction: ChatInputCommandInteraction) {
  const quizzesX = db.select().from(quizzes).all();

  let text = "";

  for (let q of quizzesX) {
    text += `\`${q.id}\` - ${q.question} (${q.options}) = ${q.answer}\n`;
  }

  await interaction.reply({
    content: text || "No quiz created yet.",
    flags: ["Ephemeral"],
  });
}
