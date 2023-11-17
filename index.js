const { default: axios } = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
path = require("path")
const app = express()
require('dotenv').config();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "/views"))


app.get('/', async (req, res) => {
  res.render('pages/main', { days: undefined, error: undefined });
})

app.post('/process-form', async (req, res) => {
  try {
    if (req.body.city && req.body.days) {
      const data = await getData(req.body.city, req.body.days)
      res.render('pages/main', { days: data.forecast.forecastday });
    } else {
      res.render("pages/main", { days: undefined, error: "Fill all Fields!" })
    }

  } catch (err) {
    console.log(err.message)
    res.render("pages/main", { days: undefined, error: "Something went wrong... Try Again" })
  }
})

const getData = async (city, days) => {
  const res = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`).then(res => res.data)
  return res
}

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})