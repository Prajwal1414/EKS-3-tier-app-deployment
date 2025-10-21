import metrics from '../metrics/index.js'

export default function metricsMiddleware(req, res, next) {
  const startTime = Date.now()
  const route = req.route?.path || req.path

  metrics.requestsInProgress.labels(req.method, route).inc()

  const requestSize = parseInt(req.get('content-length')) || 0
  metrics.httpRequestSize.labels(req.method, route).observe(requestSize)

  const originalEnd = res.end
  res.end = function (...args) {
    const duration = (Date.now() - startTime) / 1000
    const responseSize = parseInt(res.get('content-length')) || 0

    metrics.httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration)

    metrics.httpResponseSize
      .labels(req.method, route, res.statusCode)
      .observe(responseSize)

    metrics.httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc()

    if (res.statusCode >= 500) {
      metrics.httpErrorsTotal
        .labels(req.method, route, res.statusCode)
        .inc()
    }

    metrics.requestsInProgress.labels(req.method, route).dec()

    if (duration > 1) {
      console.warn(`[SLOW] ${req.method} ${route} - ${duration.toFixed(2)}s`)
    }

    originalEnd.apply(res, args)
  }

  next()
}
