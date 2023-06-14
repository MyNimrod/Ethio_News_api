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
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.com/news',
    base: 'https://www.bbc.com/'
  },
  {
    name: 'nytimes',
    address: 'https://www.nytimes.com/',
    base: ''
  },
  {
    name: 'cnn',
    address: 'https://edition.cnn.com/',
    base: ''
  },
  {
    name: 'reuters',
    address: 'https://www.reuters.com/',
    base: ''
  },
  {
    name: 'google',
    address: 'https://news.google.com/home?hl=en-ET&gl=ET&ceid=ET:en',
    base: ''
  }

]
const articles = []

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
  .then(response => {
    const html = response.data
    const $ = cheerio.load(html)

    $('a:contains("Ethiopia"), a:contains("ኢትዮጵያ"), a:contains("Addis Ababa"), a:contains("አዲስ አበባ"), a:contains("Amhara"), a:contains("አማራ"), a:contains("Oromia"), a:contains("ኦሮሚያ")፣ a:contains("Tigray"), a:contains("ትግራይ"), a:contains("ህወሓት"), a:contains("TPLF"), a:contains("ብልፅግና"), a:contains("ደቡብ"), a:contains("ጋምቤላ"), a:contains("Gambella"), a:contains("ባህርዳር"), a:contains("ሀዋሳ"), a:contains("ጅማ"), a:contains("ጎንደር"), a:contains("Gondar"), a:contains("Wollega"), a:contains("Mekelle"), a:contains("ወለጋ"), a:contains("መቀሌ"), a:contains("አፋር"), a:contains("ቤኒሻንጉል"), a:contains("Afar")', html).each(function () {
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