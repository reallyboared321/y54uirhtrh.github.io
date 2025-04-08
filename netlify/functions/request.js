export async function handler(event, context) {
  // Check if the method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Parse the body of the request
  const body = JSON.parse(event.body || '{}');
  const link = body.content;

  // Check if the link is valid
  if (!link || !link.includes('roblox.com/games')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Roblox link.' })
    };
  }

  // Try sending the webhook request
  try {
    const response = await fetch('https://discord.com/api/webhooks/1328590195377049600/_CfHETyK7F5JeMSMqJz8E3_q7BTJrRkJzJUQCoq9cJvkzgr_501CMwqMVuLbOSCOSKsh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: link })
    });

    // Handle errors from the Discord API
    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: `Discord Error: ${text}` })
      };
    }

    // Return success if everything went well
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Sent successfully!' })
    };
  } catch (err) {
    // Catch any errors and send a server error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server Error: ' + err.message })
    };
  }
}
