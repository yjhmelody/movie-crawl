const fs = require('fs')
const mysql = require('mysql')
const {getInThreaters, getTop250, getMovieInfos} = require('./douban-crawl')
let config = require('../config')

const connection = mysql.createConnection(config.mysqlConfig)

connection.connect(function(err){
    if (err){
        console.log('error connection:', err.stack)
        return
    }
    console.log('connected as id ' + connection.threadId);
})

exports.insertInthreaters = insertInthreaters
exports.insertMovieInfos = insertMovieInfos
exports.insertTop250 = insertTop250


// [el.id, el.title, genres]
function insertTop250(){
    getTop250()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
        if (typeof data !== 'object'){
            return
        }
        data.forEach(function(el){
            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.error('getTop250', err.sqlMessage)
                }
            })
        })

    })
    .catch(function(err){
        if(err){
            console.error(err.message)
        }
    })
}


// [el.id, el.title, genres] 
function insertInthreaters(){
    getInThreaters()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
        if (typeof data !== 'object'){
            return
        }
        data.forEach(function(el){
            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.error('getInThreaters', err.sqlMessage)
                }
            })
        }) 
           
    })    
    .catch(function(err){
        if(err){
            console.error(err.message)
        }
    })
}   


// url name rank genres
function insertMovieInfos(url, timeout=2000, depth=100){
    getMovieInfos(url, timeout, depth)
    .then(function(urlMap){
        let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
        let idPattern = /[0-9]{6,9}/

        if (typeof urlMap !== 'object'){
            return
        }
        for (let [url, v] of urlMap){
            if (v == null || v.movieName == null || v.genres == null){
                continue
            }

            let id = url.match(idPattern)[0]
            let el = [id, v.movieName, v.genres]

            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.error('getMovieInfos', err.message)
                    return
                }else{
                    console.log('insert成功', el)
                }
            })
        }
    })
    .catch(function(err){
        if(err){
            console.error(err)
        }
    })
    .then(function(){
        // console.log('connection end')
        connection.end(function(err){
            console.error('connection end', err)
        })
    })
}

    