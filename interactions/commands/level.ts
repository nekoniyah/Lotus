import { AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";
import registerMember from "../../utils/registerMember";
import { renderComponentToPng } from "../../utils/renderer";

const level = async (interaction: ChatInputCommandInteraction) => {
  const u = interaction.options.getUser("user");

  let user = u || interaction.user;
  await interaction.deferReply();

  const member = await interaction.guild!.members.fetch(user.id);

  let profile = await registerMember(member);

  let level = profile.level!;
  let experience = profile.experience!;

  const experienceNeededToLevelUp = 150 + level * 150;

  const imgRes = await renderComponentToPng("Level", {
    username: user.displayName,
    experience,
    level,
    experienceMax: experienceNeededToLevelUp,
    avatar: user.displayAvatarURL(),
  });

  const attachment = new AttachmentBuilder(imgRes);
  await interaction.editReply({ files: [attachment] });
};

export default level;
