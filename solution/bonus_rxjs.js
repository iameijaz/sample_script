const http = require('http');
const https = require('https');
const url = require('url');
const { from } = require('rxjs');
const { mergeMap, catchError } = require('rxjs/operators');
const {getAddressesFromUrl,getTitle} =require('./myFunctions');

function fetchHTML(address) {
    const client = address.startsWith('https') ? https : http;
    return from(new Promise((resolve, reject) => {
        client.get(address, (response) => {
            response.setEncoding('utf8');
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => resolve({ address, html: data }));
        }).on('error', (err) => {
            if (address.startsWith('https')) {
                const httpAddress = address.replace('https://', 'http://');
                fetchHTML(httpAddress).subscribe(resolve, reject);
            } else {
                reject(err);
            }
        });
    }));
}



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

        from(addresses).pipe(
            mergeMap(fetchHTML),
            catchError(() => 'NO RESPONSE')
        ).subscribe(({ address, html }) => {
            const { address: addr, title } = getTitle({ address, html });
            res.write(`<li>${addr} - ${title}</li>`);
        }, (err) => {
            res.write(`<li>${err.message}</li>`);
        }, () => {
            res.end(`
                </ul>
                </body>
                </html>
            `);
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => console.log("Server is Listening on Port 3000\n http://localhost:3000"));
