const http = require('http');
const https = require('https');
const url = require('url');
const {getAddressesFromUrl,getTitle,fetchHTML_promise} =require('./myFunctions');




const server = http.createServer((req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
        const addresses = getAddressesFromString(req.url);
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

        Promise.all(addresses.map(fetchHTML_promise)).then(htmls => {
            htmls.forEach((html, index) => {
                const title = getTitle(html);
                htmlResponse += `<li>${addresses[index]} - ${title}</li>`;
            });
            htmlResponse += `
                </ul>
                </body>
                </html>
            `;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlResponse);
        }).catch(error => {
            console.error("Error fetching HTML:", error);
            res.writeHead(500);
            res.end("<h1>Internal Server Error</h1>");
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => console.log("Server is Listening on Port 3000\n http://localhost:3000"));

