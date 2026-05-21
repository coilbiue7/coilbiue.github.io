import http from 'node:http';
import https from 'node:https';

const defaultChatbotProxyUrl = 'http://47.97.222.168/api/chat';

function extractLatestUserPrompt(messages) {
  if (!Array.isArray(messages)) {
    return '';
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === 'user' && messages[index]?.content) {
      return messages[index].content;
    }
  }

  return '';
}

function postJson(requestUrl, payload, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(requestUrl);
    const transport = url.protocol === 'https:' ? https : http;
    const body = JSON.stringify(payload);

    const request = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...extraHeaders,
        },
      },
      (response) => {
        let text = '';

        response.on('data', (chunk) => {
          text += chunk;
        });

        response.on('end', () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode || 500,
            text,
          });
        });
      },
    );

    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const sessionId =
      typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
    const prompt = extractLatestUserPrompt(messages);

    if (!messages.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'messages 不能为空。' }),
      };
    }

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少最新用户输入。' }),
      };
    }

    const response = await postJson(defaultChatbotProxyUrl, {
      message: prompt,
      sessionId,
      messages,
    });

    let data = null;

    try {
      data = JSON.parse(response.text);
    } catch {
      data = null;
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data?.error || response.text || '远程 chatbot 请求失败。',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data?.reply || '',
        mode: 'catbot',
        sessionId: data?.sessionId || sessionId || '',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Netlify Function 异常',
      }),
    };
  }
}
