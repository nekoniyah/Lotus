import type { ChatInputCommandInteraction } from "discord.js";
import { writeFileSync } from "fs";
import path from "path";
import { quizzes } from "../../src/db/schema";
import db from "../../utils/db";
import { eq } from "drizzle-orm";
export default async function (interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getNumber("id", true);

  await db.delete(quizzes).where(eq(quizzes.id, id));

  await interaction.reply({
    content: "> :white_check_mark: Ok!",
    flags: ["Ephemeral"],
  });
}
