let recentRequests = {};

export async function handler(event, context) {
  const body = JSON.parse(event.body || '{}');
  const link = body.content;
  const message = body.message || ''; // Retrieve the custom message from the request body
  const userIP = event.headers['X-Forwarded-For'] || ''; // Get user IP or use another identifier if you prefer.

  // Rate Limiting Setup
  const cooldownTime = 10 * 1000; // 10 seconds cooldown time
  const maxRequests = 3; // Allow only 3 requests within the cooldown period

  // Check if the user has exceeded the rate limit
  if (recentRequests[userIP]) {
    const { lastRequestTime, requestCount } = recentRequests[userIP];

    // If the last request was within the cooldown period
    if (Date.now() - lastRequestTime < cooldownTime) {
      // If the request count exceeds the limit, reject the request
      if (requestCount >= maxRequests) {
        return {
          statusCode: 429,
          body: JSON.stringify({ message: 'Too many requests. Please wait a moment and try again.' })
        };
      }
      
      // If not exceeded, increment the request count
      recentRequests[userIP].requestCount++;
    } else {
      // Reset the request count if the cooldown period has passed
      recentRequests[userIP] = { lastRequestTime: Date.now(), requestCount: 1 };
    }
  } else {
    // If this is the user's first request, initialize their record
    recentRequests[userIP] = { lastRequestTime: Date.now(), requestCount: 1 };
  }

  // Check if the link is valid
  if (!link || !link.includes('roblox.com/games')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Roblox link.' })
    };
  }

  // Prepare the message to send to Discord
  const discordMessage = message ? `${message}\nGame Link: ${link}` : link;

  // Proceed with sending the request to Discord's webhook
  try {
    const response = await fetch('https://discord.com/api/webhooks/1328590195377049600/_CfHETyK7F5JeMSMqJz8E3_q7BTJrRkJzJUQCoq9cJvkzgr_501CMwqMVuLbOSCOSKsh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: discordMessage })
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: `Discord Error: ${text}` })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Sent successfully!' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server Error: ' + err.message })
    };
  }
}
