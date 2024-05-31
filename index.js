const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const apicache = require("apicache");

const app = express();

let cache = apicache.middleware;
const port = 3000;

app.use(cache("5 minutes"));

app.get("/", (req, res) => {
  res.send("API running. <br> Call /americas to so get finance data.");
});

app.get("/americas", async (req, res) => {
  // res.send("API called!");

  async function getFinanceData() {
    try {
      const result = await axios.get(
        `https://www.google.com/finance/markets/indexes/americas`,
        { adapter: "http" }
      );
      //console.log(result.data);
      return result.data;
    } catch (error) {
      console.error(error);
    }
  }

  const myData = await getFinanceData();

  const $ = cheerio.load(myData);

  //const $name = $("div.ZvmM7").text();
  //console.log($name);

  //parse names of class to array
  let namesArr = [];
  $("div.ZvmM7").each(function () {
    namesArr.push($(this).text());
  });

  let scoreArr = [];
  $("div.YMlKec").each(function () {
    scoreArr.push($(this).text());
  });

  /* myObj = scoreArr.map((element) => ({ score: element }));
console.log(myObj); */

  //const $score = $("div.YMlKec").text();
  //console.log($score);

  let gainArr = [];
  $("span.P2Luy.Ez2Ioe").each(function () {
    gainArr.push($(this).text());
  });
  //console.log(gainArr);

  //const $gainToday = $("span.P2Luy.Ez2Ioe").text();
  //console.log($gainToday);

  //const $gainPercentage = $("div.zWwE1").text();
  //console.log($gainPercentage);

  let gainPercentageArr = [];
  $("div.zWwE1").each(function () {
    gainPercentageArr.push($(this).text());
  });
  //console.log(gainPercentageArr);
  let myObj = [];

  for (let index = 0; index < namesArr.length; index++) {
    myObj.push({
      name: namesArr[index],
      score: scoreArr[index],
      gain: gainArr[index],
      gainPercentage: gainPercentageArr[index],
    });
  }

  //console.log(myObj);
  res.json(myObj);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
