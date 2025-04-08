const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const webhookUrl = 'https://discord.com/api/webhooks/1328590195377049600/_CfHETyK7F5JeMSMqJz8E3_q7BTJrRkJzJUQCoq9cJvkzgr_501CMwqMVuLbOSCOSKsh'; // Replace with your actual webhook URL
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
