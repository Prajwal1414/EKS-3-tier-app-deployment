import prometheus from 'prom-client'
import * as httpMetrics from './http.js'
import * as dbMetrics from './database.js'
import * as businessMetrics from './business.js'

prometheus.collectDefaultMetrics({ prefix: 'nodejs_' })

export default {
  httpRequestDuration: httpMetrics.httpRequestDuration,
  httpRequestSize: httpMetrics.httpRequestSize,
  httpResponseSize: httpMetrics.httpResponseSize,
  httpRequestsTotal: httpMetrics.httpRequestsTotal,
  httpErrorsTotal: httpMetrics.httpErrorsTotal,
  requestsInProgress: httpMetrics.requestsInProgress,

  dbQueryDuration: dbMetrics.dbQueryDuration,
  dbConnectionsActive: dbMetrics.dbConnectionsActive,
  dbConnectionsWaiting: dbMetrics.dbConnectionsWaiting,

  cacheHitRate: businessMetrics.cacheHitRate,
  cacheMissRate: businessMetrics.cacheMissRate,
  ordersCreated: businessMetrics.ordersCreated,
  paymentsProcessed: businessMetrics.paymentsProcessed,

  register: prometheus.register
}
