const request = require('request-promise-native')
const cheerio = require('cheerio')

let movies = []
const url1 = 'http://www.imdb.com/movies-in-theaters/?ref_=cs_inth'
const url2 = 'http://www.imdb.com/movies-coming-soon/?ref_=inth_cs'
const url3 = 'https://api.douban.com/v2/movie/in_theaters'
const url4 = 'https://movie.douban.com/'


function crawlInTheaters($, ctx){
    const $a = $('', ctx)
    const IDPattern = /[0-9]+/
    let movies = []
    console.log($a.html())
    $a.each(function(i, e){
        // console.log($(this).html())
        // console.log($(this).attr('href'))
        // movies.push({
        //     name:$(this).text()
        //     ID:
        // })
    })
    return $a
}

function crawlOverview($, ctx) {
    // 抓取每个电影的主栏
    const $names = $('h4 a', ctx)
    $names.each(function (i, e) {
        movies.push({
            name: $(this).text()
        })
    })
    return $names
}

function crawlGenres($, ctx) {
    // 电影的信息栏
    const $p = $('p', ctx)
    $p.each(function (i, e) {
        let $genres = $('span[itemprop="genre"]', this)
        let genres = []
        // 电影的类型栏
        $genres.each(function (i, e) {
            genres.push($(this).text())
        })
        movies[i].genres = genres
    })
    return $p
}

function crawlRanks($, ctx) {
    const $ranks = $('span.rating-rating > span.value', ctx)
    $ranks.each(function (i, e) {
        console.log($(this).text())
    })
    return $ranks
}

request.get(url4)
    .promise()
    .then((data) => {
        const $ = cheerio.load(data)

        crawlInTheaters($, null)

        return movies
    })
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        if (err) {
            console.log(err)
        }
    })