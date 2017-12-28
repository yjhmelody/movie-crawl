const {
    insertInthreaters,
    insertTop250,
    insertMovieInfos
} = require('./src')



// insertInthreaters()
// insertTop250()
insertMovieInfos('https://movie.douban.com/subject/26282448/', 5000, 10)