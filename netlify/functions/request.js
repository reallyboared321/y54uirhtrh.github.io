export async function handler(event, context) {
  const body = JSON.parse(event.body || '{}');
  const link = body.content;

  if (!link || !link.includes('roblox.com/games')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Roblox link.' })
    };
  }

  try {
    const response = await fetch('https://discord.com/api/webhooks/1328590195377049600/_CfHETyK7F5JeMSMqJz8E3_q7BTJrRkJzJUQCoq9cJvkzgr_501CMwqMVuLbOSCOSKsh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: link })
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
