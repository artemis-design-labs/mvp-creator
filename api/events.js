// SSE is not supported on Vercel serverless functions.
// This stub keeps the browser EventSource connected but silent — no events fire,
// no reconnection loops, and the app works normally without live sync.
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(': no-sse-on-serverless\n\n');
}
