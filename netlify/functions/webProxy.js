const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE'; // Replace with your actual webhook URL
    const requestBody = JSON.parse(event.body);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Request forwarded successfully' }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to forward request' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred', error: error.message }),
        };
    }
};