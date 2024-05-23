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

function getTitle(html) {
    const match = html.match(/<title>([^<]*)<\/title>/); //regex
    return match ? match[1] : 'No Title Found';
}

function fetchHTML(address, callback) {
    const client = address.startsWith('https') ? require('https') : require('http');
    client.get(address, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => callback(null, data));
    }).on('error', (err) => {
        if (address.startsWith('https')) {
            const httpAddress = address.replace('https://', 'http://');
            fetchHTML(httpAddress, callback); // Retry with HTTP
        } else {
            callback(err);
        }
    });
}

function fetchHTML_promise(address) {
    return new Promise((resolve, reject) => {
        const client = address.startsWith('https') ? https : http;
        const protocol = address.startsWith('https') ? 'https' : 'http';

        client.get(address, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => resolve(data));
        }).on('error', (err) => {
            if (protocol === 'https') {
                const httpAddress = address.replace('https://', 'http://');
                fetchHTML(httpAddress).then(resolve).catch(reject);
            } else {
                reject(err);
            }
        });
    });
}
module.exports={
    getTitle,getAddressesFromUrl,fetchHTML, fetchHTML_promise
};