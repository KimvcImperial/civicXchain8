import { EnvironmentalDataService } from './environmentalDataService';

export interface AchievementDetection {
  commitmentId: string;
  targetValue: number;
  currentValue: number;
  isAchieved: boolean;
  firstAchievedAt?: Date;
  lastAchievedAt?: Date;
  achievementCount: number;
}

export class AchievementMonitorService {
  private static instance: AchievementMonitorService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private achievements: Map<string, AchievementDetection> = new Map();
  private callbacks: ((achievements: AchievementDetection[]) => void)[] = [];

  static getInstance(): AchievementMonitorService {
    if (!AchievementMonitorService.instance) {
      AchievementMonitorService.instance = new AchievementMonitorService();
    }
    return AchievementMonitorService.instance;
  }

  startMonitoring(commitments: any[]) {
    console.log('🔍 AchievementMonitor: Starting monitoring for', commitments.length, 'commitments');

    // Initialize achievements map
    commitments.forEach(commitment => {
      // Handle both backend format (target_value) and blockchain format (targetValue)
      const targetValue = commitment.targetValue || commitment.target_value || 0;
      const commitmentIdStr = commitment.id.toString();

      console.log(`📊 AchievementMonitor: Setting up commitment ${commitmentIdStr} with target ${targetValue}`);

      this.achievements.set(commitmentIdStr, {
        commitmentId: commitmentIdStr,
        targetValue: targetValue,
        currentValue: 0,
        isAchieved: false,
        firstAchievedAt: commitment.firstAchievementTime ? new Date(commitment.firstAchievementTime * 1000) : undefined,
        lastAchievedAt: commitment.recentAchievementTime ? new Date(commitment.recentAchievementTime * 1000) : undefined,
        achievementCount: 0
      });
    });

    // Stop existing monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Start new monitoring - check every 10 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkAchievements();
    }, 10000);

    // Initial check
    this.checkAchievements();
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async checkAchievements() {
    try {
      // Get current environmental data
      const envData = await EnvironmentalDataService.getCurrentData();
      const currentPM25 = envData.pm25;

      if (currentPM25 === null) {
        console.log('⚠️ AchievementMonitor: No PM2.5 data available, skipping check');
        return;
      }

      console.log('🌍 AchievementMonitor: Current PM2.5:', currentPM25, 'μg/m³');
      console.log('📊 AchievementMonitor: Checking', this.achievements.size, 'commitments');

      let hasNewAchievements = false;

      // Check each commitment
      this.achievements.forEach((achievement, commitmentId) => {
        const previousValue = achievement.currentValue;
        achievement.currentValue = currentPM25;

        // Convert targetValue from blockchain format (scaled by 100) to actual value
        const actualTargetValue = achievement.targetValue / 100;

        // Check if target is achieved (PM2.5 below target)
        const isCurrentlyAchieved = currentPM25 <= actualTargetValue;
        const wasAchieved = achievement.isAchieved;

        console.log(`🎯 AchievementMonitor: Commitment ${commitmentId}: PM2.5 ${currentPM25} vs target ${actualTargetValue} = ${isCurrentlyAchieved ? 'ACHIEVED' : 'NOT ACHIEVED'}`);

        if (isCurrentlyAchieved && !wasAchieved) {
          // First time achieving this target
          achievement.isAchieved = true;
          achievement.firstAchievedAt = new Date();
          achievement.lastAchievedAt = new Date();
          achievement.achievementCount = 1;
          hasNewAchievements = true;

          console.log('🎉 AchievementMonitor: NEW ACHIEVEMENT!', {
            commitmentId,
            target: actualTargetValue,
            current: currentPM25,
            firstAchieved: achievement.firstAchievedAt
          });

          // Update backend (optional - may not exist)
          this.updateBackendAchievement(commitmentId, achievement);
          
        } else if (isCurrentlyAchieved && wasAchieved) {
          // Still achieving - update last achieved time
          achievement.lastAchievedAt = new Date();
          achievement.achievementCount += 1;

          console.log('✅ AchievementMonitor: Continued achievement', {
            commitmentId,
            target: actualTargetValue,
            current: currentPM25,
            count: achievement.achievementCount
          });

        } else if (!isCurrentlyAchieved && wasAchieved) {
          // No longer achieving
          achievement.isAchieved = false;

          console.log('❌ AchievementMonitor: No longer achieving', {
            commitmentId,
            target: actualTargetValue,
            current: currentPM25
          });
        }
      });

      // Notify callbacks
      if (hasNewAchievements || true) { // Always notify for UI updates
        this.notifyCallbacks();
      }

    } catch (error) {
      console.error('❌ AchievementMonitor: Error checking achievements:', error);
    }
  }

  private async updateBackendAchievement(commitmentId: string, achievement: AchievementDetection) {
    try {
      const response = await fetch(`/api/commitments/${commitmentId}/achievement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_achieved_at: achievement.firstAchievedAt?.toISOString(),
          last_achieved_at: achievement.lastAchievedAt?.toISOString(),
          achievement_count: achievement.achievementCount,
          current_value: achievement.currentValue,
          is_achieved: achievement.isAchieved
        }),
      });

      if (response.ok) {
        console.log('✅ AchievementMonitor: Updated backend for commitment', commitmentId);
      } else {
        console.error('❌ AchievementMonitor: Failed to update backend for commitment', commitmentId);
      }
    } catch (error) {
      console.error('❌ AchievementMonitor: Error updating backend:', error);
    }
  }

  onAchievementUpdate(callback: (achievements: AchievementDetection[]) => void) {
    this.callbacks.push(callback);
  }

  private notifyCallbacks() {
    const achievementsList = Array.from(this.achievements.values());
    this.callbacks.forEach(callback => callback(achievementsList));
  }

  getAchievements(): AchievementDetection[] {
    return Array.from(this.achievements.values());
  }

  getStats() {
    const achievements = Array.from(this.achievements.values());
    const total = achievements.length;
    const successful = achievements.filter(a => a.isAchieved).length;
    const failed = achievements.filter(a => !a.isAchieved && a.achievementCount === 0).length;
    
    return {
      total,
      successful,
      failed,
      uptime: this.monitoringInterval ? 'Active' : 'Stopped'
    };
  }
}
