#!/usr/bin/env node

// Enhanced verification system startup script with monitoring
const { VerificationSystem } = require('./run-verification-system');
const fs = require('fs');
const path = require('path');

class VerificationSystemManager {
  constructor() {
    this.system = null;
    this.logFile = path.join(__dirname, 'verification-logs.json');
    this.statusFile = path.join(__dirname, 'system-status.json');
    this.startTime = Date.now();
  }

  async initialize() {
    console.log('🚀 Initializing CivicXChain Verification System Manager...');
    console.log('=' .repeat(60));
    
    this.system = new VerificationSystem();
    await this.system.initialize();
    
    // Initialize log files
    this.initializeLogFiles();
    
    console.log('✅ System Manager initialized successfully');
    console.log('📊 Monitoring dashboard available at: http://localhost:3010/monitor');
    console.log('📝 Logs will be saved to:', this.logFile);
    console.log('=' .repeat(60));
  }

  initializeLogFiles() {
    // Initialize logs file
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
    }

    // Initialize status file
    const initialStatus = {
      isRunning: true,
      startTime: this.startTime,
      lastUpdate: Date.now(),
      totalVerifications: 0,
      successfulVerifications: 0,
      failedVerifications: 0,
      errors: 0,
      uptime: 0
    };
    fs.writeFileSync(this.statusFile, JSON.stringify(initialStatus, null, 2));
  }

  logEvent(event) {
    try {
      const logs = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      logs.unshift({
        ...event,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(100);
      }
      
      fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('❌ Failed to write log:', error.message);
    }
  }

  updateStatus(updates) {
    try {
      const status = JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
      const updatedStatus = {
        ...status,
        ...updates,
        lastUpdate: Date.now(),
        uptime: Date.now() - this.startTime
      };
      fs.writeFileSync(this.statusFile, JSON.stringify(updatedStatus, null, 2));
    } catch (error) {
      console.error('❌ Failed to update status:', error.message);
    }
  }

  async runEnhancedSystem() {
    console.log('🔄 Starting Enhanced Verification System...');
    console.log('⏰ Update interval: 30 seconds');
    console.log('🔄 Features: Real data + Auto verification + Monitoring + Logging');
    console.log('📊 Status tracking: Enabled');
    console.log('=' .repeat(60));
    
    // Initial run
    await this.runSystemCycle();
    
    // Set up continuous monitoring with enhanced logging
    setInterval(async () => {
      await this.runSystemCycle();
    }, 30000); // Every 30 seconds

    // Update uptime every 10 seconds
    setInterval(() => {
      this.updateStatus({});
    }, 10000);
  }

  async runSystemCycle() {
    const cycleStart = Date.now();
    console.log(`\n⏰ ${new Date().toLocaleString()} - Running enhanced system cycle...`);
    
    try {
      // Update oracle data
      console.log('🔄 Updating oracle data...');
      const oracleSuccess = await this.system.updateOracleData();
      
      if (oracleSuccess) {
        this.logEvent({
          type: 'oracle_update',
          status: 'success',
          message: 'Oracle data updated successfully'
        });
      } else {
        this.logEvent({
          type: 'oracle_update',
          status: 'error',
          message: 'Failed to update oracle data'
        });
        this.updateStatus({ errors: this.getStatus().errors + 1 });
      }

      // Check and verify commitments
      console.log('🔍 Checking commitments for verification...');
      await this.checkAndVerifyWithLogging();

      const cycleDuration = Date.now() - cycleStart;
      console.log(`✅ Cycle completed in ${cycleDuration}ms`);
      
      this.logEvent({
        type: 'system_cycle',
        status: 'success',
        message: `System cycle completed in ${cycleDuration}ms`,
        duration: cycleDuration
      });

    } catch (error) {
      console.error('❌ System cycle error:', error.message);
      this.logEvent({
        type: 'system_cycle',
        status: 'error',
        message: `System cycle failed: ${error.message}`,
        error: error.stack
      });
      this.updateStatus({ errors: this.getStatus().errors + 1 });
    }
  }

  async checkAndVerifyWithLogging() {
    try {
      const nextId = await this.system.governance.nextCommitmentId();
      console.log(`📊 Checking commitments up to ID: ${nextId}`);

      let activeCount = 0;

      // Quick scan to count active commitments
      for (let i = 1; i < nextId; i++) {
        try {
          const commitment = await this.system.governance.getCommitment(i);
          if (commitment.isActive) activeCount++;
        } catch (error) {
          // Skip invalid commitments
        }
      }

      if (activeCount == 0) {
        console.log("📝 No active commitments to verify");
        this.logEvent({
          type: 'verification_check',
          status: 'pending',
          message: 'No active commitments to verify',
          stats: {
            total: Number(nextId) - 1,
            active: 0,
            scanned: Number(nextId) - 1
          }
        });
        return;
      }

      // Check each commitment
      for (let i = 1; i < nextId; i++) {
        try {
          const commitment = await this.system.governance.getCommitment(i);
          
          if (commitment.isActive && !commitment.isVerified) {
            const now = Math.floor(Date.now() / 1000);
            const deadline = Number(commitment.deadline);
            
            if (now >= deadline) {
              console.log(`⏰ Commitment ${i} ready for verification`);
              console.log(`   Title: ${commitment.title}`);
              console.log(`   Official: ${commitment.officialName}`);
              console.log(`   Metric: ${commitment.metricType}`);
              console.log(`   Target: ${(Number(commitment.targetValue) / 100).toFixed(2)}`);
              
              // Verify the commitment
              const tx = await this.system.governance.verifyCommitment(i);
              const receipt = await tx.wait();
              
              console.log(`✅ Commitment ${i} verified! Transaction: ${receipt.transactionHash}`);
              
              // Check if it was fulfilled
              const updatedCommitment = await this.system.governance.getCommitment(i);
              const fulfilled = updatedCommitment.isFulfilled;
              
              if (fulfilled) {
                console.log(`🎉 Commitment ${i} FULFILLED! Tokens rewarded.`);
                this.updateStatus({ 
                  totalVerifications: this.getStatus().totalVerifications + 1,
                  successfulVerifications: this.getStatus().successfulVerifications + 1
                });
              } else {
                console.log(`❌ Commitment ${i} FAILED. Penalty applied.`);
                this.updateStatus({ 
                  totalVerifications: this.getStatus().totalVerifications + 1,
                  failedVerifications: this.getStatus().failedVerifications + 1
                });
              }

              this.logEvent({
                type: 'commitment_verification',
                status: fulfilled ? 'success' : 'failed',
                message: `Commitment ${i} ${fulfilled ? 'fulfilled' : 'failed'} - ${fulfilled ? 'tokens rewarded' : 'penalty applied'}`,
                commitmentId: i,
                title: commitment.title,
                official: commitment.officialName,
                target: Number(commitment.targetValue) / 100,
                actual: Number(updatedCommitment.actualValue) / 100,
                metricType: commitment.metricType,
                transactionHash: receipt.transactionHash,
                gasUsed: receipt.gasUsed.toString()
              });
            }
          }
        } catch (error) {
          console.log(`⚠️ Error checking commitment ${i}:`, error.message);
          this.logEvent({
            type: 'commitment_check',
            status: 'error',
            message: `Error checking commitment ${i}: ${error.message}`,
            commitmentId: i,
            error: error.message
          });
        }
      }
    } catch (error) {
      console.error("❌ Verification check failed:", error.message);
      this.logEvent({
        type: 'verification_check',
        status: 'error',
        message: `Verification check failed: ${error.message}`,
        error: error.message
      });
    }
  }

  getStatus() {
    try {
      return JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
    } catch {
      return {
        totalVerifications: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        errors: 0
      };
    }
  }

  // Graceful shutdown
  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🛑 Shutting down verification system...');
      this.updateStatus({ isRunning: false });
      this.logEvent({
        type: 'system_shutdown',
        status: 'info',
        message: 'Verification system shutting down gracefully'
      });
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

async function main() {
  const manager = new VerificationSystemManager();
  
  try {
    await manager.initialize();
    manager.setupGracefulShutdown();
    await manager.runEnhancedSystem();
  } catch (error) {
    console.error('❌ Failed to start verification system:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VerificationSystemManager };
