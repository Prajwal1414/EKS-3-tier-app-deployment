import prometheus from 'prom-client'

export const dbQueryDuration = new prometheus.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'collection', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
})

export const dbConnectionsActive = new prometheus.Gauge({
  name: 'db_connections_active',
  help: 'Active database connections',
  labelNames: ['pool']
})

export const dbConnectionsWaiting = new prometheus.Gauge({
  name: 'db_connections_waiting',
  help: 'Waiting database connection requests',
  labelNames: ['pool']
})
