const fs = require('fs')
const mysql = require('mysql')
const request = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('lodash')


const urls = {
    inThreaters:'http://api.douban.com/v2/movie/in_theaters?count=50',
    top250:'http://api.douban.com/v2/movie/top250?count=250&start=100'
}

const options = {
    url: 'https://api.github.com/repos/request/request',
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
    return request.get(urls.inThreaters)
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
    return request.get(urls.top250)
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
function getUrls(html, pattern=/https:\/\/movie.douban.com\/subject\/([0-9]{6,9})/g){
    // https://movie.douban.com/subject/1291557/?from=subject-page    
    return html.match(pattern)
}

/**
 * 递归搜索豆瓣每个电影页面获取 movieID
 * @param {String} url 
 * @param {Array} arr urls' array
 * @param {Number} timeout 
 * @param {Number} depth
 */
function getMovieInfo(url, infos, timeout=20000, depth=4){ 
    console.log(arr.length)
    request.get({
        url,
        headers:{}
    })
        .promise()
        .then(function(html){
            return getUrls(html)
        })
        .then(function(urls){
            // urls = _.uniqBy(urls, 0)
            for(let url of urls){
                if(infos[url]){
                    continue
                }

                // store the info
                console.log(url)                        
                infos[url] = []
                if (depth > 0){
                    setTimeout(function(){
                        getMovieInfo(url, infos, timeout, depth-1)
                    }, timeout + timeout * Math.random())
                }
            }
        })
        .catch(function(err){
            if(err){
                console.log(err.message)
            }
        })
}
let infos = []
getMovieInfo('https://movie.douban.com/subject/1291557/?from=subject-page', infos)

exports.getInThreaters = getInThreaters  
exports.getTop250 = getTop250
exports.getMovieInfo = getMovieInfo