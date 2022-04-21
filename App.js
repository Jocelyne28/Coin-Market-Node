const express = require('express');
const app = express();
const port = 8080;
const {Sequelize} = require('sequelize');
const transaction = require('./models').transaction;
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.get('/total', async(req, res) => {
  const total = await transaction.findAll({
    attributes:[
      'currency',
      [sequelize.fn('sum', sequelize.col("value")), 'total'],
    ],
    where: {
      userID: 1
    },
    group: ['currency'],
  });
  res.send(total)
});
app.post('/transaction', async(req, res) => {
  console.log(req.body);
  const trans = await transaction.create(
    {
      userID:1,
      value: req.body.value,
      currency: req.body.originalCurrency,
      operation: "deposit"
    }
  );
  res.send(trans)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});