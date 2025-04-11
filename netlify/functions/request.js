let recentRequests = {};

export async function handler(event, context) {
  const body = JSON.parse(event.body || '{}');
  const link = body.content;
  const message = body.message || '';
  const userIP = event.headers['x-forwarded-for'] || 'Unknown IP';
  const userAgent = event.headers['user-agent'] || 'Unknown User Agent';

  // Rate Limiting Setup
  const cooldownTime = 10 * 1000;
  const maxRequests = 3;

  if (recentRequests[userIP]) {
    const { lastRequestTime, requestCount } = recentRequests[userIP];
    if (Date.now() - lastRequestTime < cooldownTime) {
      if (requestCount >= maxRequests) {
        return {
          statusCode: 429,
          body: JSON.stringify({ message: 'Too many requests. Please wait a moment and try again.' })
        };
      }
      recentRequests[userIP].requestCount++;
    } else {
      recentRequests[userIP] = { lastRequestTime: Date.now(), requestCount: 1 };
    }
  } else {
    recentRequests[userIP] = { lastRequestTime: Date.now(), requestCount: 1 };
  }

  // Validate link
  if (!link || !link.includes('roblox.com')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Roblox link.' })
    };
  }

  // Prepare message for Discord
  const discordMessage = `🚨 New Follower Request
🔗 Roblox Profile: ${link}
💬 Message: ${message || "No message provided"}
🌐 IP: ${userIP}
🖥️ User Agent: ${userAgent}`;

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
