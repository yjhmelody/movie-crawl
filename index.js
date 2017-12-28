const fs = require('fs')
const mysql = require('mysql')
const {getInThreaters, getTop250, getMovieInfos} = require('./src/douban-crawl')
let config = require('./config')

const connection = mysql.createConnection(config.mysqlConfig)

connection.connect(function(err){
    if (err){
        console.log('error connection:', err.stack)
        return
    }
    console.log('connected as id ' + connection.threadId);
})


// [el.id, el.title, genres]
// getTop250()
//     .then(function(data){
//         let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
//         if (typeof data !== 'object'){
//             return
//         }
//         data.forEach(function(el){
//             connection.query(insertSQL, el, function (err, results, fields) {
//                 if (err) {
//                     console.log('getTop250', err.sqlMessage)
//                 }
//             })
//         })

//     })
//     .catch(function(err){
//         if(err){
//             console.log(err.message)
//         }
//     })

// // [el.id, el.title, genres]    
// getInThreaters()
//     .then(function(data){
//         let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
//         if (typeof data !== 'object'){
//             return
//         }
//         data.forEach(function(el){
//             connection.query(insertSQL, el, function (err, results, fields) {
//                 if (err) {
//                     console.log('getInThreaters', err.sqlMessage)
//                 }
//             })
//         }) 
           
//     })    
//     .catch(function(err){
//         if(err){
//             console.log(err.message)
//         }
//     })

// url name rank genres
getMovieInfos('https://movie.douban.com/subject/6085356/', 1000, 100)
    // .then(function(urlMap){
    //     let insertSQL = 'INSERT INTO movies VALUES(?, ?, ?)'
    //     let idPattern = /[0-9]{6,9}/

    //     if (typeof urlMap !== 'object'){
    //         return
    //     }
    //     for (let [url, v] of urlMap){
    //         if (v.movieName == null || v.genres == null){
    //             continue
    //         }

    //         let id = url.match(idPattern)[0]
    //         let el = [id, v.movieName, v.genres]

    //         connection.query(insertSQL, el, function (err, results, fields) {
    //             if (err) {
    //                 console.log('getMovieInfos', err.sqlMessage)
    //                 return
    //             }

    //             console.log('insert成功', el)
    //         })
    //     }
    // })
    // .catch(function(err){
    //     if(err){
    //         console.log(err.message)
    //     }
    // })
    // .then(function(){
    //     console.log('connection end')
    //     connection.end(function(err){
    //         console.log(err)
    //     })
    // })