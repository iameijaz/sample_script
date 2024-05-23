const http = require('http');
const https = require('https');
const url = require('url');

function fetchHTML(address, callback) {
    https.get(address, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                fetchHTML(response.headers.location, callback);
            } else {
                callback(null, data);
            }
        });
    }).on('error', (err) => {
        // Retry with HTTP
        const httpAddress = address.replace('https://', 'http://');
        http.get(httpAddress, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => callback(null, data));
        }).on('error', (err) => callback(err));
    });
}

function getTitle(html) {
    const match = html.match(/<title>([^<]*)<\/title>/); //regex
    return match ? match[1] : 'No Title Found';
}

function getAddressesFromUrl(urlString) {
    const parsedUrl = url.parse(urlString, true);
    let addresses = parsedUrl.query.address;
    if (!Array.isArray(addresses)) {
        addresses = [addresses];
    }
    return addresses.map(address => {
        if (!address.startsWith('http://') && !address.startsWith('https://')) {
            return `https://${address}`; // Ensure protocol is specified
        }
        return address;
    });
}

function buildHTMLResponse(addresses, titles) {
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

    addresses.forEach((address, index) => {
        htmlResponse += `<li>${address} - ${titles[index]}</li>`;
    });

    htmlResponse += `
            </ul>
            </body>
            </html>
        `;
    
    return htmlResponse;
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/I/want/title/")) {
        const addresses = getAddressesFromUrl(req.url);
        if (addresses.length === 0) {
            res.writeHead(400);
            res.end("<h1>NO Parameters Provided</h1>");
            return;
        }
        
        let completedRequests = 0;
        const titles = [];

        addresses.forEach((address, index) => {
            fetchHTML(address, (err, html) => {
                const title = err ? 'NO RESPONSE' : getTitle(html);
                titles[index] = title;
                completedRequests++;
                if (completedRequests === addresses.length) {
                    const htmlResponse = buildHTMLResponse(addresses, titles);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(htmlResponse);
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => console.log("Server is Listening on Port 3000"));
