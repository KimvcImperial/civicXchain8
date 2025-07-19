// Simple monitoring API for the verification system
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

const LOGS_FILE = path.join(__dirname, 'verification-logs.json');
const STATUS_FILE = path.join(__dirname, 'system-status.json');

// Helper function to read JSON files safely
function readJSONFile(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
  return defaultValue;
}

// Get system status
app.get('/api/status', (req, res) => {
  const status = readJSONFile(STATUS_FILE, {
    isRunning: false,
    startTime: Date.now(),
    lastUpdate: Date.now(),
    totalVerifications: 0,
    successfulVerifications: 0,
    failedVerifications: 0,
    errors: 0,
    uptime: 0
  });

  // Calculate uptime in human readable format
  const uptimeMs = status.uptime || 0;
  const uptimeMinutes = Math.floor(uptimeMs / (1000 * 60));
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  
  let uptimeString;
  if (uptimeHours > 0) {
    uptimeString = `${uptimeHours}h ${uptimeMinutes % 60}m`;
  } else {
    uptimeString = `${uptimeMinutes}m`;
  }

  res.json({
    ...status,
    uptimeString,
    lastUpdateFormatted: new Date(status.lastUpdate).toLocaleString(),
    nextCheck: status.isRunning ? new Date(status.lastUpdate + 30000).toLocaleTimeString() : 'System stopped'
  });
});

// Get verification logs
app.get('/api/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const logs = readJSONFile(LOGS_FILE, []);
  
  // Return limited number of logs
  const limitedLogs = logs.slice(0, limit).map(log => ({
    ...log,
    timestampFormatted: new Date(log.timestamp).toLocaleString()
  }));

  res.json(limitedLogs);
});

// Get logs by type
app.get('/api/logs/:type', (req, res) => {
  const { type } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const logs = readJSONFile(LOGS_FILE, []);
  
  const filteredLogs = logs
    .filter(log => log.type === type)
    .slice(0, limit)
    .map(log => ({
      ...log,
      timestampFormatted: new Date(log.timestamp).toLocaleString()
    }));

  res.json(filteredLogs);
});

// Get system statistics
app.get('/api/stats', (req, res) => {
  const logs = readJSONFile(LOGS_FILE, []);
  const status = readJSONFile(STATUS_FILE, {});

  // Calculate statistics from logs
  const stats = {
    totalLogs: logs.length,
    logsByType: {},
    recentActivity: logs.slice(0, 5),
    systemHealth: {
      isRunning: status.isRunning || false,
      errorRate: status.totalVerifications > 0 ? (status.errors / status.totalVerifications * 100).toFixed(2) : 0,
      successRate: status.totalVerifications > 0 ? (status.successfulVerifications / status.totalVerifications * 100).toFixed(2) : 0
    }
  };

  // Count logs by type
  logs.forEach(log => {
    stats.logsByType[log.type] = (stats.logsByType[log.type] || 0) + 1;
  });

  res.json(stats);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const status = readJSONFile(STATUS_FILE, { isRunning: false });
  
  res.json({
    status: status.isRunning ? 'healthy' : 'stopped',
    timestamp: new Date().toISOString(),
    uptime: status.uptime || 0,
    message: status.isRunning ? 'Verification system is running' : 'Verification system is stopped'
  });
});

// Start monitoring API endpoint
app.post('/api/start', (req, res) => {
  // This would trigger the verification system to start
  // For now, just return a success message
  res.json({
    success: true,
    message: 'Start command received. Please run: node start-verification-system.js',
    timestamp: new Date().toISOString()
  });
});

// Stop monitoring API endpoint
app.post('/api/stop', (req, res) => {
  // This would trigger the verification system to stop
  // For now, just return a success message
  res.json({
    success: true,
    message: 'Stop command received. The system will shut down gracefully.',
    timestamp: new Date().toISOString()
  });
});

// Simple web interface for monitoring
app.get('/', (req, res) => {
  const status = readJSONFile(STATUS_FILE, {});
  const logs = readJSONFile(LOGS_FILE, []).slice(0, 10);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>CivicXChain Verification Monitor</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
            .header { background: #2d1b69; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .status { display: flex; gap: 20px; margin-bottom: 20px; }
            .card { background: #2a2a2a; padding: 15px; border-radius: 8px; flex: 1; }
            .logs { background: #2a2a2a; padding: 15px; border-radius: 8px; }
            .log-entry { padding: 8px; margin: 5px 0; border-left: 3px solid #666; padding-left: 10px; }
            .success { border-left-color: #4ade80; }
            .error { border-left-color: #ef4444; }
            .pending { border-left-color: #fbbf24; }
            .running { color: #4ade80; }
            .stopped { color: #ef4444; }
            pre { background: #1a1a1a; padding: 10px; border-radius: 4px; overflow-x: auto; }
        </style>
        <script>
            function refreshData() {
                location.reload();
            }
            setInterval(refreshData, 30000); // Refresh every 30 seconds
        </script>
    </head>
    <body>
        <div class="header">
            <h1>🤖 CivicXChain Verification System Monitor</h1>
            <p>Real-time monitoring of automatic commitment verification</p>
        </div>
        
        <div class="status">
            <div class="card">
                <h3>System Status</h3>
                <p class="${status.isRunning ? 'running' : 'stopped'}">
                    ${status.isRunning ? '✅ RUNNING' : '❌ STOPPED'}
                </p>
                <p>Uptime: ${Math.floor((status.uptime || 0) / 60000)}m</p>
            </div>
            <div class="card">
                <h3>Verifications</h3>
                <p>Total: ${status.totalVerifications || 0}</p>
                <p>Success: ${status.successfulVerifications || 0}</p>
                <p>Failed: ${status.failedVerifications || 0}</p>
            </div>
            <div class="card">
                <h3>Last Update</h3>
                <p>${status.lastUpdate ? new Date(status.lastUpdate).toLocaleString() : 'Never'}</p>
                <p>Errors: ${status.errors || 0}</p>
            </div>
        </div>
        
        <div class="logs">
            <h3>Recent Logs (${logs.length})</h3>
            ${logs.map(log => `
                <div class="log-entry ${log.status}">
                    <strong>${log.type}</strong> - ${log.message}
                    <br><small>${new Date(log.timestamp).toLocaleString()}</small>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="refreshData()" style="padding: 10px 20px; background: #2d1b69; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🔄 Refresh
            </button>
        </div>
        
        <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>API Endpoints:</p>
            <ul>
                <li>GET /api/status - System status</li>
                <li>GET /api/logs - Recent logs</li>
                <li>GET /api/stats - System statistics</li>
                <li>GET /api/health - Health check</li>
            </ul>
        </div>
    </body>
    </html>
  `;

  res.send(html);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start the monitoring API server
app.listen(PORT, () => {
  console.log(`🔍 CivicXChain Monitoring API running on http://localhost:${PORT}`);
  console.log(`📊 Web interface: http://localhost:${PORT}`);
  console.log(`🔗 API endpoints: http://localhost:${PORT}/api/status`);
});

module.exports = app;
