import type { ChatInputCommandInteraction } from "discord.js";
import db from "../../utils/db";
import { quizzes } from "../../src/db/schema";

export default async function (interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString("question", true);
  const options = interaction.options.getString("options", true);
  const answer = interaction.options.getString("answer", true);
  const amount = interaction.options.getNumber("amount", true);

  await db.insert(quizzes).values({ question, amount, answer, options });

  await interaction.reply({
    content: "> :white_check_mark: Ok!",
    flags: ["Ephemeral"],
  });
}
