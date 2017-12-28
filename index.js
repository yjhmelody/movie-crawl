const {
    insertInthreaters,
    insertTop250,
    insertMovieInfos,
    sleep
} = require('./src')

let config = require('./config')
const mysql = require('mysql')


urls = [
    'https://movie.douban.com/subject/26862259/',
    'https://movie.douban.com/subject/3541415/',
    'https://movie.douban.com/subject/1292720/',
    'https://movie.douban.com/subject/4739952/',
    'https://movie.douban.com/subject/3742360/',
    'https://movie.douban.com/subject/1652587/',
    'https://movie.douban.com/subject/1292223/',
    'https://movie.douban.com/subject/4268598/',
    'https://movie.douban.com/subject/4920528/',
    'https://movie.douban.com/subject/1291561/',
    'https://movie.douban.com/subject/1292402/',
    'https://movie.douban.com/subject/1292220/',
    'https://movie.douban.com/subject/1291832/',
    'https://movie.douban.com/subject/1305487/',
    'https://movie.douban.com/subject/1307762/',
    'https://movie.douban.com/subject/23761370/',
    'https://movie.douban.com/subject/1301753/',
    'https://movie.douban.com/subject/2353023/'
];

// insertInthreaters()
// insertTop250()

(async function () {
    for(let url of urls){
        try {
            const connection = mysql.createConnection(config.mysqlConfig)
            await insertMovieInfos(connection, url, 10000, 500)
        } catch (err) {
            console.error(err)
            connection.end(function(err){
                console.log(err)
            })
        }
    }
   
})()
