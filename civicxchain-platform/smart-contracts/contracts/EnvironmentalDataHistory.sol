// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnvironmentalDataHistory
 * @dev Stores historical environmental data and provides averaging functions
 * for hourly, weekly, and monthly periods to support trend-based commitment evaluation
 */
contract EnvironmentalDataHistory is Ownable {
    
    struct DataPoint {
        int256 value;
        uint256 timestamp;
        string source;
    }
    
    struct AverageData {
        int256 average;
        uint256 dataPoints;
        uint256 periodStart;
        uint256 periodEnd;
    }
    
    // Historical data storage: metric => timestamp => DataPoint
    mapping(string => DataPoint[]) public historicalData;
    
    // Cached averages: metric => period => timestamp => AverageData
    mapping(string => mapping(string => mapping(uint256 => AverageData))) public cachedAverages;
    
    // Events
    event DataPointAdded(string indexed metric, int256 value, uint256 timestamp, string source);
    event AverageCalculated(string indexed metric, string indexed period, uint256 timestamp, int256 average);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Add a new data point for a specific metric
     * @param metric The environmental metric (e.g., "pm25", "aqi", "forest_cover")
     * @param value The measured value (scaled by 100 for 2 decimal places)
     * @param source The data source identifier
     */
    function addDataPoint(
        string memory metric,
        int256 value,
        string memory source
    ) external onlyOwner {
        require(bytes(metric).length > 0, "Metric cannot be empty");
        require(value >= 0, "Value must be non-negative");
        
        DataPoint memory newPoint = DataPoint({
            value: value,
            timestamp: block.timestamp,
            source: source
        });
        
        historicalData[metric].push(newPoint);
        
        emit DataPointAdded(metric, value, block.timestamp, source);
    }
    
    /**
     * @dev Get the number of data points for a metric
     */
    function getDataPointCount(string memory metric) external view returns (uint256) {
        return historicalData[metric].length;
    }
    
    /**
     * @dev Get a specific data point
     */
    function getDataPoint(string memory metric, uint256 index) 
        external 
        view 
        returns (int256 value, uint256 timestamp, string memory source) 
    {
        require(index < historicalData[metric].length, "Index out of bounds");
        DataPoint memory point = historicalData[metric][index];
        return (point.value, point.timestamp, point.source);
    }
    
    /**
     * @dev Get recent data points within a time range
     */
    function getDataPointsInRange(
        string memory metric,
        uint256 startTime,
        uint256 endTime
    ) external view returns (DataPoint[] memory) {
        DataPoint[] memory allPoints = historicalData[metric];
        
        // Count points in range
        uint256 count = 0;
        for (uint256 i = 0; i < allPoints.length; i++) {
            if (allPoints[i].timestamp >= startTime && allPoints[i].timestamp <= endTime) {
                count++;
            }
        }
        
        // Create result array
        DataPoint[] memory result = new DataPoint[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < allPoints.length; i++) {
            if (allPoints[i].timestamp >= startTime && allPoints[i].timestamp <= endTime) {
                result[resultIndex] = allPoints[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Calculate hourly average for a specific hour
     * @param metric The environmental metric
     * @param hourTimestamp The timestamp of the hour (should be rounded to hour boundary)
     */
    function calculateHourlyAverage(string memory metric, uint256 hourTimestamp) 
        external 
        returns (int256 average, uint256 dataPointCount) 
    {
        // Round to hour boundary
        uint256 hourStart = (hourTimestamp / 3600) * 3600;
        uint256 hourEnd = hourStart + 3600;
        
        // Check if already cached
        if (cachedAverages[metric]["hourly"][hourStart].dataPoints > 0) {
            AverageData memory cached = cachedAverages[metric]["hourly"][hourStart];
            return (cached.average, cached.dataPoints);
        }
        
        // Calculate average
        (int256 sum, uint256 count) = _calculateSumInRange(metric, hourStart, hourEnd);
        
        if (count == 0) {
            return (0, 0);
        }
        
        int256 avgValue = sum / int256(count);
        
        // Cache the result
        cachedAverages[metric]["hourly"][hourStart] = AverageData({
            average: avgValue,
            dataPoints: count,
            periodStart: hourStart,
            periodEnd: hourEnd
        });
        
        emit AverageCalculated(metric, "hourly", hourStart, avgValue);
        
        return (avgValue, count);
    }
    
    /**
     * @dev Calculate daily average for a specific day
     */
    function calculateDailyAverage(string memory metric, uint256 dayTimestamp) 
        external 
        returns (int256 average, uint256 dataPointCount) 
    {
        // Round to day boundary
        uint256 dayStart = (dayTimestamp / 86400) * 86400;
        uint256 dayEnd = dayStart + 86400;
        
        // Check if already cached
        if (cachedAverages[metric]["daily"][dayStart].dataPoints > 0) {
            AverageData memory cached = cachedAverages[metric]["daily"][dayStart];
            return (cached.average, cached.dataPoints);
        }
        
        // Calculate average
        (int256 sum, uint256 count) = _calculateSumInRange(metric, dayStart, dayEnd);
        
        if (count == 0) {
            return (0, 0);
        }
        
        int256 avgValue = sum / int256(count);
        
        // Cache the result
        cachedAverages[metric]["daily"][dayStart] = AverageData({
            average: avgValue,
            dataPoints: count,
            periodStart: dayStart,
            periodEnd: dayEnd
        });
        
        emit AverageCalculated(metric, "daily", dayStart, avgValue);
        
        return (avgValue, count);
    }
    
    /**
     * @dev Calculate weekly average for a specific week
     */
    function calculateWeeklyAverage(string memory metric, uint256 weekTimestamp) 
        external 
        returns (int256 average, uint256 dataPointCount) 
    {
        // Round to week boundary (assuming week starts on Monday)
        uint256 weekStart = ((weekTimestamp / 604800) * 604800);
        uint256 weekEnd = weekStart + 604800;
        
        // Check if already cached
        if (cachedAverages[metric]["weekly"][weekStart].dataPoints > 0) {
            AverageData memory cached = cachedAverages[metric]["weekly"][weekStart];
            return (cached.average, cached.dataPoints);
        }
        
        // Calculate average
        (int256 sum, uint256 count) = _calculateSumInRange(metric, weekStart, weekEnd);
        
        if (count == 0) {
            return (0, 0);
        }
        
        int256 avgValue = sum / int256(count);
        
        // Cache the result
        cachedAverages[metric]["weekly"][weekStart] = AverageData({
            average: avgValue,
            dataPoints: count,
            periodStart: weekStart,
            periodEnd: weekEnd
        });
        
        emit AverageCalculated(metric, "weekly", weekStart, avgValue);
        
        return (avgValue, count);
    }
    
    /**
     * @dev Calculate monthly average for a specific month
     */
    function calculateMonthlyAverage(string memory metric, uint256 monthTimestamp) 
        external 
        returns (int256 average, uint256 dataPointCount) 
    {
        // Approximate month boundary (30 days)
        uint256 monthStart = (monthTimestamp / 2592000) * 2592000;
        uint256 monthEnd = monthStart + 2592000;
        
        // Check if already cached
        if (cachedAverages[metric]["monthly"][monthStart].dataPoints > 0) {
            AverageData memory cached = cachedAverages[metric]["monthly"][monthStart];
            return (cached.average, cached.dataPoints);
        }
        
        // Calculate average
        (int256 sum, uint256 count) = _calculateSumInRange(metric, monthStart, monthEnd);
        
        if (count == 0) {
            return (0, 0);
        }
        
        int256 avgValue = sum / int256(count);
        
        // Cache the result
        cachedAverages[metric]["monthly"][monthStart] = AverageData({
            average: avgValue,
            dataPoints: count,
            periodStart: monthStart,
            periodEnd: monthEnd
        });
        
        emit AverageCalculated(metric, "monthly", monthStart, avgValue);
        
        return (avgValue, count);
    }
    
    /**
     * @dev Internal function to calculate sum of values in a time range
     */
    function _calculateSumInRange(
        string memory metric,
        uint256 startTime,
        uint256 endTime
    ) internal view returns (int256 sum, uint256 count) {
        DataPoint[] memory allPoints = historicalData[metric];

        sum = 0;
        count = 0;

        for (uint256 i = 0; i < allPoints.length; i++) {
            if (allPoints[i].timestamp >= startTime && allPoints[i].timestamp < endTime) {
                sum += allPoints[i].value;
                count++;
            }
        }

        return (sum, count);
    }

    /**
     * @dev Get cached average data
     */
    function getCachedAverage(
        string memory metric,
        string memory period,
        uint256 timestamp
    ) external view returns (AverageData memory) {
        return cachedAverages[metric][period][timestamp];
    }

    /**
     * @dev Get current trend (comparing recent average to previous period)
     * Returns positive for improving trend, negative for worsening trend
     */
    function getCurrentTrend(
        string memory metric,
        string memory period
    ) external view returns (int256 trendValue, bool hasData) {
        uint256 currentTime = block.timestamp;
        uint256 periodDuration;

        if (keccak256(bytes(period)) == keccak256(bytes("hourly"))) {
            periodDuration = 3600;
        } else if (keccak256(bytes(period)) == keccak256(bytes("daily"))) {
            periodDuration = 86400;
        } else if (keccak256(bytes(period)) == keccak256(bytes("weekly"))) {
            periodDuration = 604800;
        } else if (keccak256(bytes(period)) == keccak256(bytes("monthly"))) {
            periodDuration = 2592000;
        } else {
            return (0, false);
        }

        uint256 currentPeriodStart = (currentTime / periodDuration) * periodDuration;
        uint256 previousPeriodStart = currentPeriodStart - periodDuration;

        AverageData memory currentAvg = cachedAverages[metric][period][currentPeriodStart];
        AverageData memory previousAvg = cachedAverages[metric][period][previousPeriodStart];

        if (currentAvg.dataPoints == 0 || previousAvg.dataPoints == 0) {
            return (0, false);
        }

        // For environmental metrics, lower values are generally better
        // So negative trend (decreasing values) is positive improvement
        int256 trend = previousAvg.average - currentAvg.average;

        return (trend, true);
    }

    /**
     * @dev Get multiple historical averages for charting
     * @param metric The environmental metric
     * @param period The time period ("hourly", "daily", "weekly", "monthly")
     * @param count Number of periods to return
     */
    function getHistoricalAverages(
        string memory metric,
        string memory period,
        uint256 count
    ) external view returns (AverageData[] memory) {
        uint256 periodDuration;

        if (keccak256(bytes(period)) == keccak256(bytes("hourly"))) {
            periodDuration = 3600;
        } else if (keccak256(bytes(period)) == keccak256(bytes("daily"))) {
            periodDuration = 86400;
        } else if (keccak256(bytes(period)) == keccak256(bytes("weekly"))) {
            periodDuration = 604800;
        } else if (keccak256(bytes(period)) == keccak256(bytes("monthly"))) {
            periodDuration = 2592000;
        } else {
            revert("Invalid period");
        }

        AverageData[] memory results = new AverageData[](count);
        uint256 currentTime = block.timestamp;
        uint256 currentPeriodStart = (currentTime / periodDuration) * periodDuration;

        for (uint256 i = 0; i < count; i++) {
            uint256 periodStart = currentPeriodStart - (i * periodDuration);
            results[count - 1 - i] = cachedAverages[metric][period][periodStart];
        }

        return results;
    }

    /**
     * @dev Check if commitment target is met based on time-averaged data
     * @param metric The environmental metric
     * @param targetValue The commitment target value
     * @param period The averaging period
     * @param duration How many periods to check
     */
    function isCommitmentMet(
        string memory metric,
        int256 targetValue,
        string memory period,
        uint256 duration
    ) external view returns (bool isMet, int256 averageValue, uint256 periodsChecked) {
        uint256 periodDuration;

        if (keccak256(bytes(period)) == keccak256(bytes("hourly"))) {
            periodDuration = 3600;
        } else if (keccak256(bytes(period)) == keccak256(bytes("daily"))) {
            periodDuration = 86400;
        } else if (keccak256(bytes(period)) == keccak256(bytes("weekly"))) {
            periodDuration = 604800;
        } else if (keccak256(bytes(period)) == keccak256(bytes("monthly"))) {
            periodDuration = 2592000;
        } else {
            return (false, 0, 0);
        }

        uint256 currentTime = block.timestamp;
        uint256 currentPeriodStart = (currentTime / periodDuration) * periodDuration;

        int256 totalSum = 0;
        uint256 validPeriods = 0;

        for (uint256 i = 0; i < duration; i++) {
            uint256 periodStart = currentPeriodStart - (i * periodDuration);
            AverageData memory avgData = cachedAverages[metric][period][periodStart];

            if (avgData.dataPoints > 0) {
                totalSum += avgData.average;
                validPeriods++;
            }
        }

        if (validPeriods == 0) {
            return (false, 0, 0);
        }

        int256 overallAverage = totalSum / int256(validPeriods);

        // For environmental metrics like PM2.5, lower values are better
        bool targetMet = overallAverage <= targetValue;

        return (targetMet, overallAverage, validPeriods);
    }
}
