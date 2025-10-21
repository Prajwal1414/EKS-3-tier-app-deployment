import prometheus from 'prom-client'

export const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
})

export const httpRequestSize = new prometheus.Histogram({
  name: 'http_request_size_bytes',
  help: 'HTTP request payload size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000]
})

export const httpResponseSize = new prometheus.Histogram({
  name: 'http_response_size_bytes',
  help: 'HTTP response payload size in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000]
})

export const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

export const httpErrorsTotal = new prometheus.Counter({
  name: 'http_errors_total',
  help: 'Total HTTP errors (5xx)',
  labelNames: ['method', 'route', 'status_code']
})

export const requestsInProgress = new prometheus.Gauge({
  name: 'http_requests_in_progress',
  help: 'Current requests being processed',
  labelNames: ['method', 'route']
})
