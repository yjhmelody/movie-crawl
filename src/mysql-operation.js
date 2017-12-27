const fs = require('fs')
const mysql = require('mysql')
const {getInThreaters, getTop250, getMovieUrl} = require('./douban-crawl.js')
let config = require('../config')

const connection = mysql.createConnection(config.mysqlConfig)

connection.connect(function(err){
    if (err){
        console.log('error connection:', err.stack)
        return
    }
    console.log('connected as id ' + connection.threadId);
})

getTop250()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
        if (typeof data !== 'object'){
            return
        }
        data.forEach(function(el){
            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.log(err.sqlMessage)
                }
            })
        })

    })
    .catch(function(err){
        if(err){
            console.log(err.message)
        }
    })

getInThreaters()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
        if (typeof data !== 'object'){
            return
        }
        data.forEach(function(el){
            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.log(err.sqlMessage)
                }
            })
        }) 
           
    })    
    .catch(function(err){
        if(err){
            console.log(err.message)
        }
    })