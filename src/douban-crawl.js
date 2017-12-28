const fs = require('fs')
const mysql = require('mysql')
const request = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('lodash')
// const async = require('async')

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
function getUrls(html){
    // https://movie.douban.com/subject/1291557/?from=subject-page    
    let pattern = /https:\/\/movie.douban.com\/subject\/([0-9]{6,9})/g
    return html.match(pattern)
}


/**
 * @param {Array} startUrls
 * @param {Map} urlMap
 * @param {Number} timeout 
 * @param {Number} depth
 */
async function getMovieInfo(startUrl, urlMap, timeout=1000){ 
    let rankPattern = /<strong class="ll rating_num" property="v:average">([0-9.]+)<\/strong>/
    let NamePattern = /<span property="v:itemreviewed">(.+)<\/span>/
    try {
        let {newUrl, rank, movieName} = await request.get(startUrl)
        .promise()
        .then(function(html){
            return {
                newUrl: getUrls(html),
                rank: html.match(rankPattern)[1],
                movieName: html.match(NamePattern)[1]
            }
        })
        urlMap.set(newUrl[0], {movieName, rank})

        for(let url of urlMap.keys()){
            console.log('现在访问', url)

            let {newUrls, rank, movieName} = await request.get(url)
                .promise()
                .then(function(html){
                    return {
                        newUrls: getUrls(html),
                        rank: html.match(rankPattern)[1],
                        movieName: html.match(NamePattern)[1]
                    }
                })

            // 添加新的信息
            urlMap.set(url, {movieName, rank})
            console.log('添加', url, movieName, rank)
                
            sleep(timeout)

            for(let newUrl of newUrls){
                if(urlMap.has(newUrl)){
                    continue
                }
                urlMap.set(newUrl)
            } 
        }
    } catch (error) {
        console.log(error)
    }
  
}

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

let urlMap = new Map()
getMovieInfo('https://movie.douban.com/subject/1291557/?from=subject-page', urlMap)

exports.getInThreaters = getInThreaters  
exports.getTop250 = getTop250
exports.getMovieInfo = getMovieInfo