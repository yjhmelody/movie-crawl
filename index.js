const {
    insertInthreaters,
    insertTop250,
    insertMovieInfos,
    sleep,
    selectUrls
} = require('./src')

let config = require('./config')
const mysql = require('mysql')

exports.insertInthreaters =  insertInthreaters
exports.insertTop250 = insertTop250

// const connection = mysql.createPool(config.mysqlConfig)

exports.main = async function main(urls, timeout, depth) {
    for(let url of urls){
        try {
            const connection = mysql.createConnection(config.mysqlConfig)
            
            connection.on('release', function (connection) {
                console.log('Connection %d released', connection.threadId);
              })
            await insertMovieInfos(connection, url, timeout, depth)
        } catch (err) {
            console.error(err)
            connection.end(function(err){
                console.log(err)
            })
        }
    }  
}

exports.getUrls = async function(n=10){
    const connection = mysql.createConnection(config.mysqlConfig)
    return selectUrls(connection, n)
        .then(function(data){
            connection.end()
            return data.map(function(v){
                return 'https://movie.douban.com/subject/' + v.movieID
            })
        })
}

exports.getUrls(60)
    .then(function(urls){
        exports.main(urls, 3000, 2)
    })
    .catch(function(err){
        if(err){
            console.log(err.message)
        }
    })

