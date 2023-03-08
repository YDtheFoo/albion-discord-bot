function getGearImage(gear, quality = 1) {
  if (gear === "None") {
    return "https://i.imgur.com/6gJZKx8.png";
  } else {
    return `https://render.albiononline.com/v1/item/${gear}?quality=${quality}`;
  }
}

async function getGearPrice(gear, quality, maxPrice = 1000000) {
  const URL = `https://www.albion-online-data.com/api/v2/stats/prices/${gear}?locations=Lymhurst,Fort Sterling,Thetford,Martlock,Bridgewatch,Caerleon&qualities=${quality}`;
  const response = await fetch(URL);
  const data = await response.json();
  const prices = [];
  data.forEach((location) => {
    prices.push(location.sell_price_min);
    prices.push(location.buy_price_min);
  });
  const minPrice = prices.filter((price) => price !== 0 && price <= maxPrice);
  if (minPrice.length === 0) return "Did not find on market for under 1M";
  return Math.round(minPrice.reduce((a, b) => a + b) / minPrice.length);
}

module.exports = { getGearImage, getGearPrice };
