const fetch = require('isomorphic-fetch');
const express = require('express');
const app = express();

app.get('/stocks', async (req, res) => {
  const quandl = `https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?qopts.columns=ticker,date,close&date.gte=20180201&date.lte=20180301&ticker=GOOG,AAPL,FB&api_key=ygy-wxzv-o5a3t6BqjTN`

    try {
      const response = await fetch(quandl);
      const json = await response.json();

      const stockData = json.datatable.data;

      const result = stockData.reduce((acc, item) => {
        const [ symbol, date, price ] = item;

        const idx = acc.findIndex(obj => {
          return obj.date === date;
        });

        if (idx === -1) {
          acc.push({
            date,
            [symbol]: price
          });
        } else {
          acc[idx][symbol] = price;
        }
        return acc;
      }, []);

      res.send(stockData);
    }
    catch (e) {
      res.send({ success: false, err: e })
    }
});

const port = 3030;
app.listen(port, () => {
  console.log('express server running on port', port);
});
