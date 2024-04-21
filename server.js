const http = require("http");
const fs = require("fs");
const url = require("url")
const db = require('./db.json')


const port = 4000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/users') {
        fs.readFile('db.json', (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db)
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(JSON.stringify(data.users))
            res.end()
        })
    } else if (req.method === 'GET' && req.url === '/api/books') {
        fs.readFile('db.json', (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db)
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(JSON.stringify(data.books))
            res.end()
        })
    } else if (req.method === 'DELETE') {
        const parsedUrl = url.parse(req.url, true)
        const bookId = parsedUrl.query.id
        const newBooks = db.books.filter(book => book.id != bookId)
        fs.writeFile('db.json', JSON.stringify({...db, books: newBooks}), (err) => {
            if (err) {
                throw err
            }
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(JSON.stringify({message: "Book Removed Successfully"}))
            res.end()
        })
        res.end()
    }
})


server.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})