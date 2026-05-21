import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import http from 'node:http'
import https from 'node:https'

function extractLatestUserPrompt(messages) {
  if (!Array.isArray(messages)) {
    return ''
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === 'user' && messages[index]?.content) {
      return messages[index].content
    }
  }

  return ''
}

function postJson(requestUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(requestUrl)
    const transport = url.protocol === 'https:' ? https : http
    const body = JSON.stringify(payload)

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
        },
      },
      response => {
        let text = ''

        response.on('data', chunk => {
          text += chunk
        })

        response.on('end', () => {
          resolve({
            status: response.statusCode || 500,
            text,
          })
        })
      },
    )

    request.on('error', reject)
    request.write(body)
    request.end()
  })
}

function devChatProxyPlugin(proxyTarget) {
  return {
    name: 'dev-chat-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next()
        }

        try {
          let rawBody = ''

          await new Promise((resolve, reject) => {
            req.on('data', chunk => {
              rawBody += chunk
            })
            req.on('end', resolve)
            req.on('error', reject)
          })

          const payload = rawBody ? JSON.parse(rawBody) : {}
          const prompt = extractLatestUserPrompt(payload.messages)

          if (!prompt) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'messages 不能为空。' }))
            return
          }

          const response = await postJson(`${proxyTarget.replace(/\/$/, '')}/api/chat`, {
              message: prompt,
              sessionId: payload.sessionId || '',
              messages: payload.messages || [],
          })

          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(response.text)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : '开发代理请求失败',
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_CHAT_PROXY_TARGET

  return {
    plugins: [react(), ...(proxyTarget ? [devChatProxyPlugin(proxyTarget)] : [])],
  }
})
