const {
    insertInthreaters,
    insertTop250,
    insertMovieInfos
} = require('./src')



// insertInthreaters()
// insertTop250()
insertMovieInfos('https://movie.douban.com/subject/26607693/?tag=%E7%83%AD%E9%97%A8&from=gaia_video', 2000, 10)