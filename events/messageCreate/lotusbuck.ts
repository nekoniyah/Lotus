import "dotenv/config";
import { TemplateEvent } from "../../utils/typers";
import db from "../../utils/db";
import { wallets } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import registerMember from "../../utils/registerMember";

export default TemplateEvent<"messageCreate">(async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const member = await message.guild.members.fetch(message.author.id);

  const profile = await registerMember(member);

  const newPurse = profile.amount! + 1;

  await db
    .update(wallets)
    .set({ amount: newPurse })
    .where(eq(wallets.userId, message.author.id));
});
