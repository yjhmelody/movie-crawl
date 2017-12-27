const fs = require('fs')
const mysql = require('mysql')
const request = require('request-promise-native')
const cheerio = require('cheerio')
const _ = require('lodash')


const urls = {
    inThreaters:'http://api.douban.com/v2/movie/in_theaters?count=50',
    top250:'http://api.douban.com/v2/movie/top250?count=250&start=100'
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
function getUrl(html, pattern=/https:\/\/movie.douban.com\/subject\/([0-9]{6,9})/g){
    // https://movie.douban.com/subject/1291557/?from=subject-page    
    return Promise.resolve()
        .then(function(){
            return html.match(pattern)
        })
}

/**
 * 递归搜索豆瓣每个电影页面获取 movieID
 * @param {String} url 
 * @param {Array} arr urls' array
 * @param {Number} timeout 
 * @param {Number} depth
 */
function getMovieUrl(url, arr, timeout=1000, depth=5){ 
    setTimeout(function(){
        request.get(url)
        .promise()
        .then(function(html){
            return getUrl(html)
        })
        .then(function(urls){
            urls = _.uniq(urls)
            // urls = _.uniqBy(urls, 0)
            for(let url of urls){
                arr.push(url)
                //递归
                if (depth > 0){
                    getMovieInfo(url, arr, timout, depth-1)
                }
            }
        })
        .catch(function(err){
            if(err){
                console.log(err)
            }
        })
    }, timeout)
}


exports.getInThreaters = getInThreaters  
exports.getTop250 = getTop250
exports.getMovieUrl = getMovieUrl