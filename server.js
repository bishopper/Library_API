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
    } else if (req.method === 'DELETE' && req.url.startsWith("/api/books")) {
        const parsedUrl = url.parse(req.url, true)
        const bookId = parsedUrl.query.id
        const newBooks = db.books.filter(book => book.id != bookId)

        if (newBooks.length === db.books.length) {
            res.writeHead(401, {'content-type': 'application/json'})
            res.write(JSON.stringify({message: "Book Not Found"}))
            res.end()
        } else {
            fs.writeFile('db.json', JSON.stringify({...db, books: newBooks}), (err) => {
                if (err) throw err
                res.writeHead(200, {'content-type': 'application/json'})
                res.write(JSON.stringify({message: "Book Removed Successfully"}))
                res.end()
            })
        }

    }
})


server.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})