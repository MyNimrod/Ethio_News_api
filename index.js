const PORT = process.env.PORT || 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
  {
    name: 'VOA',
    address: 'https://amharic.voanews.com/',
    base: 'https://amharic.voanews.com/'
  },
  {
    name: 'The Reporter',
    address: 'https://www.ethiopianreporter.com/',
    base: ''
  },
  {
    name: 'Addis Standard',
    address: 'https://amharic.addisstandard.com/',
    base: ''
  }
]
const articles = []

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)

    $('a:contains("Ethiopia"), a:contains("ኢትዮጵያ"), a:contains("Addis Ababa"), a:contains("አዲስ አበባ")', html).each(function () {
      const title = $(this).text()
      const url = $(this).attr('href')

      articles.push({
      title,
      url: newspaper.base + url,
      source: newspaper.name
    })
  })
})
})

app.get('/', (req, res) => {
  res.json('Welcome to My Ethiopian News API');
});

app.get('/news', (req, res) => {

  res.json(articles)

});

app.get('/news/:newspaperId', async (req,res) => {
  const newspaperId = req.params.newspaperId

  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
  axios.get(newspaperAddress)
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)
    const specificArticles =[]

    $('a:contains("Ethiopia"), a:contains("ኢትዮጵያ"), a:contains("Addis Ababa"), a:contains("አዲስ አበባ")', html).each(function () {
      const title = $(this).text()
      const url = $(this).attr('href')

      specificArticles.push({
      title,
      url: newspaperBase + url,
      source: newspaperId
    })
  })
  res.json(specificArticles)
}).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));