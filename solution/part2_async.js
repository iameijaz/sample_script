const http = require('http');
const async = require('async');
const url = require('url');
const {getAddressesFromUrl,getTitle,fetchHTML} =require('./myFunctions');



const server = http.createServer((req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
        const addresses = getAddressesFromUrl(req.url);
        if (addresses.length === 0) {
            res.writeHead(400);
            res.end("<h1>NO Parameters Provided</h1>");
            return;
        }
        
        let htmlResponse = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Webpage Titles</title>
            </head>
            <body>
                <h1>Following are the titles of given websites:</h1>
                <ul>
        `;

        let completedRequests = 0;
        async.each(addresses, (address, callback) => {
            fetchHTML(address, (err, html) => {
                const title = err ? 'NO RESPONSE' : getTitle(html);
                htmlResponse += `<li>${address} - ${title}</li>`;
                completedRequests++;
                callback();
            });
        }, () => {
            htmlResponse += `
                        </ul>
                    </body>
                </html>
            `;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlResponse);
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => console.log("Server is Listening on Port 3000\n http://localhost:3000"));
