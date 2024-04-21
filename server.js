const http = require("http");
const fs = require("fs");

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
    }
})


server.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})