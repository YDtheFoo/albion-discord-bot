const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your character!")
    .addStringOption((option) =>
      option.setName("player").setDescription("player name").setRequired(true)
    ),
  async execute(interaction) {
    const player = interaction.options.getString("player");
    const playerRef = db.collection("rats-cartel");
    const snapshot = await playerRef
      .where("userID", "==", interaction.user.id)
      .get();

    if (snapshot.empty) {
      const res = await db.collection("rats-cartel").add({
        player,
        userID: interaction.user.id,
      });
      interaction.reply("Player registered!");
      return;
    } else {
      interaction.reply(
        `You are already registered as ${snapshot.docs[0].data().player}!`
      );
      return;
    }
  },
};
