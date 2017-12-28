const fs = require('fs')
const request = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('lodash')


const urls = {
    inThreaters:'http://api.douban.com/v2/movie/in_theaters?count=50',
    top250:'http://api.douban.com/v2/movie/top250?count=250&start=100'
}

const options = {
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/x',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    }
}

// 获取热映中电影
// movieID | movieName | genres
function getInThreaters(){
    return request.get({
        url: urls.inThreaters,
        // headers: options.headers
    })
        .promise()
        .then(function (data) {
            data = JSON.parse(data)
            let data2 = []
            data.subjects.forEach(function(el){
                let genres = el.genres.join('|')
                data2.push([el.id, el.title, genres])
            })
            return data2
        })
        .catch(function (err) {
            if (err) {
                console.log(err.statusCode)
            }
        })
}

// 获取热门电影
// movieID | movieName | genres
function getTop250(){
    return request.get({
        url:urls.top250,
        // headers: options.headers
    })
        .promise()
        .then(function (data) {
            data = JSON.parse(data)
            let data2 = []
            data.subjects.forEach(function(el){
                let genres = el.genres.join('|')
                data2.push([el.id, el.title, genres])
            })
            return data2
        })
        .catch(function (err) {
            if (err) {
                console.log(err.statusCode)
            }
        })
}


/**
 * 根据html爬取豆瓣电影
 * @param {String} html
 * @return {Promise} promise with url array
 */
function getUrls(html){
    // https://movie.douban.com/subject/1291557/?from=subject-page    
    let pattern = /https:\/\/movie.douban.com\/subject\/([0-9]{6,9})/g
    return html.match(pattern)
}

// movieID | movieName | genres | rank
function getMovieInfo(url) {
    let rankPattern = /<strong class="ll rating_num" property="v:average">([0-9.]+)<\/strong>/
    let NamePattern = /<span property="v:itemreviewed">(.+?)<\/span>/
    let summaryPattern = /<span property="v:summary" .*?>(.+?)<\/span>/

    return request.get({
        url:url,
        // headers: options.headers        
    })
        .promise()
        .then(function(html){
            let $ = cheerio.load(html)
            let $genres = $('#info > span[property="v:genre"]')
            let genres = ''
            $genres.each(function(i, el){
                genres += $(this).text() + ' '
            })
            genres = genres.trimRight()
            genres = genres.replace(/ /g, '|')
            let rank = html.match(rankPattern) ? html.match(rankPattern)[1] : null
            let movieName =  html.match(NamePattern) ? html.match(NamePattern)[1] : null

            // console.log(html)
            console.log({
                newUrls: getUrls(html),
                rank,
                movieName,
                genres
            })
            return {
                newUrls: getUrls(html),
                rank,
                movieName,
                genres
            }
        })
}

/**
 * @param {String} startUrl
 * @param {Number} timeout 
 * @param {Number} depth
 */
async function getMovieInfos(startUrl, timeout=2000, depth=1000){ 
    let urlMap = new Map()
    let crawlCount = 0
    try {
        let {newUrls, rank, movieName, genres} = await getMovieInfo(startUrl)

        urlMap.set(newUrls[0])
        
        for(let url of urlMap.keys()){
            console.log('size', urlMap.size)
            if(urlMap.get(url) != null){
                continue
            }
            let {newUrls, rank, movieName, genres} = await getMovieInfo(url)
            // 添加新的信息
            urlMap.set(url, {movieName, rank, genres})
            console.log(`抓取到第${++crawlCount}个`, url, urlMap.get(url))

            sleep(timeout)

            for(let newUrl of newUrls){
                if(urlMap.has(newUrl)){
                    continue
                }
                urlMap.set(newUrl)
            } 

            if (depth-- < 0) {
                break
            }
        }
    } catch (error) {
        console.error(__filename, error)
    }
    
    return urlMap
}

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
}


// getMovieInfos('https://movie.douban.com/subject/4268598/', 80000, 10)
exports.getInThreaters = getInThreaters  
exports.getTop250 = getTop250
exports.getMovieInfos = getMovieInfos