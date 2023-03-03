const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const { db } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("regear")
    .setDescription("Regear your character!"),
  async execute(interaction) {
    let totalGearValue = 0;
    const embeds = [];
    const playerRef = db.collection("rats-cartel");
    const snapshot = await playerRef
      .where("userID", "==", interaction.user.id)
      .get();
    if (snapshot.empty) {
      interaction.reply("You are not registered! Please register first!");
      return;
    }
    const player = snapshot.docs[0].data().player;
    const eventURL = `https://murderledger.com/api/players/${player}/events`;
    fetch(eventURL)
      .then((response) => response.json())
      .then(async (data) => {
        const killEvents = data.events.filter(
          (event) => event.victim.name === player
        );
        //generate response options for discord
        const responseOptions = killEvents.map((event) => {
          return {
            label: event.killer.name,
            description: event.id.toString(),
            value: event.id.toString(),
          };
        });

        const actionRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("regear")
            .setPlaceholder("Select a kill")
            .addOptions(responseOptions)
        );
        interaction.reply({
          content: "Select a kill",
          components: [actionRow],
        });
      })
      .catch((err) => console.log(err));
  },
};
