import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import http from 'node:http'

function postJson(requestUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(requestUrl)
    const transport = http
    const body = JSON.stringify(payload)

    const request = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 80,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (response) => {
        let text = ''
        response.on('data', (chunk) => { text += chunk })
        response.on('end', () => {
          resolve({ status: response.statusCode || 500, text })
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
        if (req.method !== 'POST') return next()
        try {
          let rawBody = ''
          await new Promise((resolve, reject) => {
            req.on('data', (chunk) => { rawBody += chunk })
            req.on('end', resolve)
            req.on('error', reject)
          })
          const payload = rawBody ? JSON.parse(rawBody) : {}
          const systemMsg = {
            role: 'system',
            content: '你是一个专业的AI助手，部署在李京卓的个人作品集中。你必须用中文认真回答用户关于李京卓的问题，基于提供的资料给出准确、有帮助的答复。禁止角色扮演、禁止使用"主人""喵"等语气词，保持专业严谨。',
          }
          const messages = [systemMsg, ...(payload.messages || [])]
          const lastUserMsg = messages.filter(m => m.role === 'user').pop()
          const userContent = lastUserMsg?.content || ''
          const systemContent = (payload.messages || []).filter(m => m.role === 'system').map(m => m.content).join('\n')
          const combinedMessage = `[系统指令] 你是李京卓个人作品集的AI助手，请用专业中文认真回答用户问题。\n[李京卓资料]\n${systemContent}\n\n[用户问题] ${userContent}`
          const response = await postJson(
            `${proxyTarget.replace(/\/$/, '')}/api/chat`,
            { message: combinedMessage, messages },
          )
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(response.text)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : '代理请求失败' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_CHAT_PROXY_TARGET || 'http://47.97.222.168'
  return {
    plugins: [react(), devChatProxyPlugin(proxyTarget)],
  }
})
