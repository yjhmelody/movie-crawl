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


exports.main = async function main(urls, timeout, depth) {
    for(let url of urls){
        try {
            const connection = mysql.createConnection(config.mysqlConfig)
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