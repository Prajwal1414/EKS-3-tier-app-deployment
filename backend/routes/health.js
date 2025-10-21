import express from 'express'
import metrics from '../metrics/index.js'

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType)
  res.end(await metrics.register.metrics())
})

router.get('/ready', (req, res) => {
  res.json({ ready: true })
})

export default router
