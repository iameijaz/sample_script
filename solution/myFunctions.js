const http=require('http');
const url=require('url');
const https = require('https');



function getAddressesFromUrl(urlString) {
    const parsedUrl = url.parse(urlString, true); // true -> object with query
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

function getTitle(html) {
    const match = html.match(/<title>([^<]*)<\/title>/); //regex
    return match ? match[1] : 'No Title Found';
}

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

function fetchHTML_promise(address) {
    return new Promise((resolve, reject) => {
        const client = address.startsWith('https') ? https : http;

        client.get(address, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                
                    fetchHTML_promise(response.headers.location).then(resolve).catch(reject);
                } else {
                    resolve(data);
                }
            });
        }).on('error', (err) => {
            const httpAddress = address.replace('https://', 'http://');
            http.get(httpAddress, (response) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => resolve(data));
            }).on('error', (err) => reject(err));
        });
    });
}

module.exports={
    getTitle,getAddressesFromUrl,fetchHTML, fetchHTML_promise
};