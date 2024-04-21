const http = require("http");
const fs = require("fs");
const url = require("url")
const db = require('./db.json')


const port = 4000;

const server = http.createServer((req, res) => {
    // GET - users
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
    }
    // GET - books
    else if (req.method === 'GET' && req.url === '/api/books') {
        fs.readFile('db.json', (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db)
            res.writeHead(200, {'content-type': 'application/json'})
            res.write(JSON.stringify(data.books))
            res.end()
        })
    }
    // DELETE - books
    else if (req.method === 'DELETE' && req.url.startsWith("/api/books")) {
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
    // POST - books
    else if (req.method === 'POST' && req.url === '/api/books') {
        let book = ""
        req.on('data', (data) => {
            book = book + data.toString()
        })
        req.on('end', (data) => {
            const newBook = {
                id: crypto.randomUUID(),
                ...JSON.parse(book),
                free: 1
            }
            db.books.push(newBook)
            fs.writeFile('db.json', JSON.stringify(db), err => {
                if (err) throw err
                res.writeHead(201, {'content-type': 'application/json'})
                res.write(JSON.stringify({message: "Book Added Successfully"}))
                res.end()
            })
        })
    }
    // PUT - books
})


server.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})