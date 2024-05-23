const http = require('http');
const https = require('https');
const url = require('url');

const {getAddressesFromUrl,getTitle,fetchHTML_promise} =require('./myFunctions');

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
        const addresses = getAddressesFromUrl(req.url);
        if (addresses.length === 0) {
            res.writeHead(400);
            res.end("<h1>NO Parameters Provided</h1>");
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Webpage Titles</title>
            </head>
            <body>
                <h1>Following are the titles of given websites:</h1>
                <ul>
        `);

        let completedRequests = 0;
        addresses.forEach((address) => {
            fetchHTML_promise(address)
                .then(html => {
                    const title = getTitle(html);
                    res.write(`<li>${address} - ${title}</li>`);
                    if (++completedRequests === addresses.length) {
                        res.end(`
                            </ul>
                            </body>
                            </html>
                        `);
                    }
                })
                .catch(() => {
                    res.write(`<li>${address} - NO RESPONSE</li>`);
                    if (++completedRequests === addresses.length) {
                        res.end(`
                            </ul>
                            </body>
                            </html>
                        `);
                    }
                });
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => console.log("Server is Listening on Port 3000\n http://localhost:3000"));

