import { eq } from "drizzle-orm";
import { currencies, wallets } from "../../src/db/schema";
import db from "../../utils/db";
import { TemplateEvent } from "../../utils/typers";
import registerMember from "../../utils/registerMember";
import embeds from "../../utils/embeds";

export default TemplateEvent<"messageCreate">(async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  let rand = Math.floor(Math.random() * 100);

  const currency = db
    .select()
    .from(currencies)
    .where(eq(currencies.guildId, message.guild.id))
    .get();

  if (!currency) return;

  const member = await message.guild.members.fetch(message.author.id);
  const profile = await registerMember(member);

  if (rand <= 1) {
    const type = Math.random();

    if (type > 0.49) {
      // Mine

      if (profile.amount === 0) return;

      let rdamount = 40;

      if ((profile.amount ?? 0) - rdamount < 0) {
        rdamount = profile.amount ?? 0;
      }

      let embed = embeds
        .base({ icon: message.author.displayAvatarURL(), user: message.author })
        .setColor("Red")
        .setDescription(
          `During your travel to the mine, you lost ${rdamount} ${currency.emoji} ${currency.name}...`,
        );

      await db.update(wallets).set({ amount: profile.amount! - rdamount });

      await message.channel.send({
        content: `${message.author}`,
        embeds: [embed],
      });
    } else {
      // Equals 0
      // Treasure

      const rdamount = 30;

      let embed = embeds
        .success(
          `You found a treasure and earned ${rdamount} ${currency.emoji} ${currency.name}!`,
          { icon: message.author.displayAvatarURL(), user: message.author },
        )
        .setColor("Green");

      await db.update(wallets).set({ amount: profile.amount! + rdamount });

      await message.channel.send({
        content: `${message.author}`,
        embeds: [embed],
      });
    }
  }
});
