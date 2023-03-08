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
    const embeds = [];
    const playerRef = db.collection("rats-cartel");
    const snapshot = await playerRef
      .where("userID", "==", interaction.user.id)
      .get();
    if (snapshot.empty) {
      interaction.reply({
        content: "You are not registered! Please register first!",
        ephemeral: true,
      });
      return;
    }
    const player = snapshot.docs[0].data().player;
    const eventURL = `https://murderledger.com/api/players/${player}/events`;
    fetch(eventURL)
      .then((response) => response.json())
      .then(async (data) => {
        const killEvents = data.events.filter(
          (event) => event.victim.name.toLowerCase() === player.toLowerCase()
        );
        //generate response options for discord
        const responseOptions = killEvents.map((event) => {
          return {
            label: event.killer.name,
            description: event.id.toString(),
            value: event.id.toString(),
          };
        });

        if (responseOptions.length === 0) {
          interaction.reply({
            content: "You have no kills to regear from!",
            ephemeral: true,
          });
          return;
        }
        const actionRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("regear")
            .setPlaceholder("Select a kill")
            .addOptions(responseOptions)
        );
        interaction.reply({
          content: "Select a kill",
          components: [actionRow],
          ephemeral: true,
        });
      })
      .catch((err) => console.log(err));
  },
};
