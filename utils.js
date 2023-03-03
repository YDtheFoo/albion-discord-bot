function getGearImage(gear, quality = 1) {
  if (gear === "None") {
    return "https://i.imgur.com/6gJZKx8.png";
  } else {
    return `https://render.albiononline.com/v1/item/${gear}?quality=${quality}`;
  }
}

async function getGearPrice(gear, quality) {
  const URL = `https://www.albion-online-data.com/api/v2/stats/prices/${gear}?locations=Lymhurst,Fort Sterling,Thetford,Martlock,Bridgewatch,Caerleon&qualities=${quality}`;
  const response = await fetch(URL);
  const data = await response.json();
  const prices = [];
  data.forEach((location) => {
    prices.push(location.sell_price_min);
  });
  const minPrice = prices.filter((price) => price !== 0);
  if (minPrice.length === 0) return 0;
  return minPrice.sort((a, b) => a > b)[0];
}

module.exports = { getGearImage, getGearPrice };
