const fs = require('fs')
const {
    getInThreaters, 
    getTop250, 
    getMovieInfos,
    sleep
} = require('./douban-crawl')


exports.insertInthreaters = insertInthreaters
exports.insertMovieInfos = insertMovieInfos
exports.insertTop250 = insertTop250
exports.sleep = sleep
exports.selectUrls = selectUrls

// [el.id, el.title, genres]
function insertTop250(connection){
    getTop250()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies2 VALUES(?, ?, ?, ?)'
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
function insertInthreaters(connection){
    getInThreaters()
    .then(function(data){
        let insertSQL = 'INSERT INTO movies2 VALUES(?, ?, ?, ?)'
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
function insertMovieInfos(connection, url, timeout=2000, depth=50){
    return getMovieInfos(url, timeout, depth)
    .then(function(urlMap){
        let insertSQL = 'INSERT INTO movies2 VALUES(?, ?, ?, ?)'
        let idPattern = /[0-9]{6,9}/
        let count = 0

        if (typeof urlMap !== 'object'){
            return
        }

        // connection.connect(function(err){
        //     if (err){
        //         console.log('error connection:', err.stack)
        //         return
        //     }
        //     console.log('connected as id ' + connection.threadId);
        // })
        
        for (let [url, v] of urlMap){
            if (v == null || v.movieName == null || v.genres == null || v.rank == null){
                continue
            }

            let id = url.match(idPattern)[0]
            let el = [id, v.movieName, v.genres, v.rank]
            count++
            connection.query(insertSQL, el, function (err, results, fields) {
                if (err) {
                    console.error('insertMovieInfos', err.message)
                }else {
                    console.log(`第${count}条插入成功`, el)
                }
            })
        }
    })
    .then(function(){
        connection.end(function(err){
            console.error('connection end', err)
        })
    })
    .catch(function(err){
        if(err){
            console.error(err.message)
            if(err.stutusCode == 403){
                throw err
            }
        }
    })
}

function selectUrls(connection, n=10) {
    return new Promise(function(res, rej){
        // connection.connect(function(err){
        //     if (err){
        //         console.log('error connection:', err.stack)
        //         return
        //     }
        //     console.log('connected as id ' + connection.threadId);
        // })
        
        let insertSQL = `select * from movies order by RAND() limit 0, ?;`
        
        connection.query(insertSQL, [n], function (err, results, fields) {
            if (err) {
                console.error('selectUrls error', err.message)
                rej()
            }else {
                // console.log(results)
                res(results)
            }
        })
    })
}
    