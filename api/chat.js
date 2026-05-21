import http from 'node:http';
import https from 'node:https';

const defaultSystemPrompt = [
  '你是 Forky 个人网站上的 AI 助手。',
  'Forky 是大三学生 / 准 AI 训练师，关注 AI 调教、工作流优化、人机交互调优、需求澄清和记忆沉淀。',
  '回答风格要简洁、专业、友好，尽量贴合个人品牌表达。',
  '如果用户询问合作方式、能力范围或研究方向，要优先从 AI 工作流设计、人机交互调优、深度提示词工程、AI 调教笔记几个维度来回答。',
].join(' ');

const defaultChatbotProxyUrl = 'http://47.97.222.168/api/chat';

function extractLatestUserPrompt(messages) {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;
  const model = process.env.DASHSCOPE_MODEL || 'qwen-plus';
  const baseUrl =
    (process.env.DASHSCOPE_BASE_URL ||
      'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
  const chatbotProxyUrl = process.env.CHATBOT_PROXY_URL || defaultChatbotProxyUrl;
  const chatbotProxyToken = process.env.CHATBOT_PROXY_TOKEN || '';
  const appId = process.env.DASHSCOPE_APP_ID || '';
  const workspace = process.env.DASHSCOPE_WORKSPACE || '';
  const systemPrompt =
    process.env.DASHSCOPE_SYSTEM_PROMPT || defaultSystemPrompt;

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const sessionId =
    typeof req.body?.sessionId === 'string' ? req.body.sessionId.trim() : '';

  if (!messages.length) {
    return res.status(400).json({ error: 'messages 不能为空。' });
  }

  try {
    if (chatbotProxyUrl) {
      const prompt = extractLatestUserPrompt(messages);

      if (!prompt) {
        return res.status(400).json({ error: '远程 chatbot 模式下缺少最新用户输入。' });
      }

      const proxyResponse = await postJson(
        chatbotProxyUrl,
        {
          message: prompt,
          sessionId,
          messages,
        },
        chatbotProxyToken
          ? { Authorization: `Bearer ${chatbotProxyToken}` }
          : {},
      );

      const proxyText = proxyResponse.text;
      let proxyData = null;

      try {
        proxyData = JSON.parse(proxyText);
      } catch {
        proxyData = null;
      }

      if (!proxyResponse.ok) {
        return res.status(proxyResponse.status).json({
          error:
            proxyData?.error ||
            proxyData?.message ||
            proxyText ||
            '远程 chatbot 请求失败。',
        });
      }

      const reply =
        proxyData?.reply?.trim?.() ||
        proxyData?.message?.trim?.() ||
        proxyText.trim();

      if (!reply) {
        return res.status(502).json({ error: '远程 chatbot 返回内容为空。' });
      }

      return res.status(200).json({
        reply,
        mode: 'catbot',
        sessionId: proxyData?.sessionId || sessionId || '',
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error:
          '服务端未配置 `DASHSCOPE_API_KEY`，且远程 chatbot 不可用。请检查配置后重试。',
      });
    }

    if (appId) {
      const prompt = extractLatestUserPrompt(messages);

      if (!prompt) {
        return res.status(400).json({ error: '百炼应用模式下缺少最新用户输入。' });
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      };

      if (workspace) {
        headers['X-DashScope-WorkSpace'] = workspace;
      }

      const appResponse = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            input: {
              prompt,
              ...(sessionId ? { session_id: sessionId } : {}),
            },
            parameters: {
              incremental_output: false,
            },
          }),
        },
      );

      const appData = await appResponse.json();

      if (!appResponse.ok) {
        return res.status(appResponse.status).json({
          error: appData?.message || appData?.code || '阿里云百炼应用请求失败。',
        });
      }

      const reply = appData?.output?.text?.trim();

      if (!reply) {
        return res.status(502).json({ error: '阿里云百炼应用返回内容为空。' });
      }

      return res.status(200).json({
        reply,
        mode: 'app',
        sessionId: appData?.output?.session_id || '',
      });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          data?.message ||
          '阿里云聊天请求失败。',
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: '阿里云返回内容为空。' });
    }

    return res.status(200).json({
      reply,
      mode: 'model',
      sessionId: '',
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : '服务端聊天代理异常。',
    });
  }
}
