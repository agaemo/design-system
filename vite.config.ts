import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('.', import.meta.url))

const input = Object.fromEntries(
  readdirSync(resolve(dir, 'docs'))
    .filter(f => f.endsWith('.html'))
    .map(f => [f.slice(0, -5), resolve(dir, 'docs', f)]),
)

export default defineConfig({
  root: resolve(dir, 'docs'),
  build: {
    outDir: resolve(dir, 'dist'),
    emptyOutDir: true,
    rollupOptions: { input },
  },
  plugins: [
    {
      name: 'utf8-text',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.txt')) {
            res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
          }
          next()
        })
      },
    },
  ],
})
