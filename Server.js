// server.js
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/validate-merchant', (req, res) => {
    const validationURL = req.body.validationURL;

    const options = {
        hostname: new URL(validationURL).hostname,
        path: new URL(validationURL).pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        key: fs.readFileSync('path/to/your/private.key'), // Your Apple Pay merchant private key
        cert: fs.readFileSync('path/to/your/certificate.pem'), // Your Apple Pay merchant certificate
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => res.send(JSON.parse(data)));
    });

    request.on('error', (e) => {
        console.error(e);
        res.status(500).send('Merchant validation failed');
    });

    request.end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
