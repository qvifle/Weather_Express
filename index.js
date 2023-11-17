// Импортируем axios, express, bodyparser (for ejs), path, dotenv
const { default: axios } = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
path = require("path")
const app = express()
require('dotenv').config();


// Используем middleware bodyParser для считывания данных запросов для отрисовки (нужен для ejs)
app.use(bodyParser.urlencoded({ extended: true }));

// Показываем экспрессу папку со стилями
app.use(express.static(path.join(__dirname, 'public')));

// Используем ejs шаблонизатор
app.set('view engine', 'ejs');

// Используем папку views с страницой и компонентом 
app.set("views", path.join(__dirname, "/views"))


// Отрисовываем страницу пользователю без данных о погоде
// req - request что нам дает клиент
// res - response что сервер дает клиенту
app.get('/', async (req, res) => {
  res.render('pages/main', { days: undefined, error: undefined });
})

// Запрос данных с апи по данным, введенных пользователем
app.post('/process-form', async (req, res) => {
  try {
    // Проверяем заполнены ли все поля
    if (req.body.city && req.body.days) {
      const data = await getData(req.body.city, req.body.days)
      res.render('pages/main', { days: data.forecast.forecastday });
    } else {
      // Выдаем ошибку если не все поля заполнены
      res.render("pages/main", { days: undefined, error: "Fill all Fields!" })
    }

  } catch (err) {
    // Выдаем ошибку апи либо пользователь ввел несуществующий город
    console.log(err.message)
    res.render("pages/main", { days: undefined, error: "Something went wrong... Try Again" })
  }
})

// Функция сбора данных с апи
const getData = async (city, days) => {
  const res = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`).then(res => res.data)
  return res
}


// Запуск сервера
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})