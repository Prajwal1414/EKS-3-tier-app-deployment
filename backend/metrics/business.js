import prometheus from 'prom-client'

export const cacheHitRate = new prometheus.Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_name']
})

export const cacheMissRate = new prometheus.Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_name']
})

export const ordersCreated = new prometheus.Counter({
  name: 'orders_created_total',
  help: 'Total orders created',
  labelNames: ['status']
})

export const paymentsProcessed = new prometheus.Counter({
  name: 'payments_processed_total',
  help: 'Total payments processed',
  labelNames: ['method', 'status']
})
