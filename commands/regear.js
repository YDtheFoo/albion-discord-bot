const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");
const { getGearImage, getGearPrice } = require("../utils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("regear")
    .setDescription("Regear your character!")
    .addStringOption((option) =>
      option.setName("killid").setDescription("kill id").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("mount").setDescription("regear mount").setRequired(false)
    ),
  async execute(interaction) {
    let totalGearValue = 0;
    const embeds = [];
    const killId = interaction.options.getString("killid");
    const eventURL = `https://gameinfo.albiononline.com/api/gameinfo/events/${killId}`;
    fetch(eventURL)
      .then((response) => response.json())
      .then(async (data) => {
        const victim = data.Victim.Name;
        const victimKillFame = data.Victim.DeathFame;
        const victimGearScore = data.Victim.AverageItemPower;
        const victimKillboardURL = `https://albiononline.com/en/killboard/kill/${killId}`;

        const victimEmbed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`Victim: ${victim}`)
          .setURL(victimKillboardURL)
          .setDescription(victimKillboardURL)
          .addFields(
            {
              name: "KillFame",
              value: victimKillFame.toString(),
              inline: true,
            },
            {
              name: "GearScore",
              value: Math.round(victimGearScore).toString(),
              inline: true,
            }
          );
        embeds.push(victimEmbed);

        // Get victim gear and price
        const victimGear = {
          head: data.Victim.Equipment.Head,
          armor: data.Victim.Equipment.Armor,
          Shoes: data.Victim.Equipment.Shoes,
          MainHand: data.Victim.Equipment.MainHand,
          OffHand: data.Victim.Equipment.OffHand,
          //Mount: data.Victim.Equipment.Mount,
        };
        for (gear in victimGear) {
          if (victimGear[gear] !== null) {
            const gearName = victimGear[gear].Type;
            const quality = victimGear[gear].Quality;
            victimGear[gear].gearImage = getGearImage(gearName, quality);
            victimGear[gear].gearPrice = await getGearPrice(gearName, quality);

            totalGearValue += victimGear[gear].gearPrice;

            const embed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle(`${gear}: ${gearName}`)
              .setThumbnail(victimGear[gear].gearImage)
              .addFields({
                name: "Price",
                value: victimGear[gear].gearPrice.toString(),
                inline: true,
              });
            embeds.push(embed);
          }
        }

        const finalGearPrice = new EmbedBuilder().setTitle(
          `Total gear value: ${totalGearValue}`
        );

        embeds.push(finalGearPrice);

        interaction.reply({ embeds });
      })
      .catch((err) => console.log(err));
  },
};
