export interface HealthIndicator {
  status: 'up' | 'down';
  [key: string]: any;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error' | 'shutting_down' | 'unknown';
  info?: Record<string, HealthIndicator>;
  error?: Record<string, HealthIndicator>;
  details: Record<string, HealthIndicator>;
}
