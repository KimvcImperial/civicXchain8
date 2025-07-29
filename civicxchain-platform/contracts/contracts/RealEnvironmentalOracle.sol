// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title RealEnvironmentalOracle
 * @dev Environmental data oracle that fetches real data from NASA, OpenAQ, and other APIs
 * Implements Chainlink AggregatorV3Interface for compatibility with existing contracts
 * Data is updated by authorized external adapters connected to real environmental APIs
 */
contract RealEnvironmentalOracle is AggregatorV3Interface {
    address public owner;
    address public dataUpdater; // Authorized external adapter address
    
    // Environmental data storage with Chainlink-compatible structure
    struct RoundData {
        int256 answer;
        uint256 timestamp;
        uint256 startedAt;
        uint80 roundId;
        uint80 answeredInRound;
    }
    
    // Data for different environmental metrics
    mapping(string => RoundData) private environmentalData;
    mapping(string => uint80) private latestRoundIds;
    
    // Supported environmental metrics
    string[] public supportedMetrics = ["pm25", "co2", "forest_cover", "aqi", "temperature"];
    
    // Default metric for AggregatorV3Interface compatibility
    string public primaryMetric = "pm25";
    
    uint8 public constant override decimals = 2; // 2 decimal places (e.g., 12.50 = 1250)
    string public override description = "Real Environmental Data Oracle - PM2.5, CO2, Forest Cover";
    uint256 public override version = 1;
    
    // Events
    event EnvironmentalDataUpdated(
        string indexed metric,
        int256 value,
        uint256 timestamp,
        uint80 roundId,
        string dataSource
    );
    event DataUpdaterChanged(address indexed oldUpdater, address indexed newUpdater);
    event PrimaryMetricChanged(string oldMetric, string newMetric);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(msg.sender == owner || msg.sender == dataUpdater, "Not authorized to update data");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        dataUpdater = msg.sender;
        
        // Initialize with realistic environmental data
        _initializeEnvironmentalData();
    }
    
    /**
     * @dev Initialize with realistic environmental baseline data
     */
    function _initializeEnvironmentalData() private {
        uint256 currentTime = block.timestamp;
        
        // PM2.5: 12.50 μg/m³ (WHO guideline is 15 μg/m³)
        environmentalData["pm25"] = RoundData({
            answer: 1250,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: 1,
            answeredInRound: 1
        });
        latestRoundIds["pm25"] = 1;
        
        // CO2: 421.50 ppm (current global average)
        environmentalData["co2"] = RoundData({
            answer: 42150,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: 1,
            answeredInRound: 1
        });
        latestRoundIds["co2"] = 1;
        
        // Forest Cover: 68.50% (global forest cover percentage)
        environmentalData["forest_cover"] = RoundData({
            answer: 6850,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: 1,
            answeredInRound: 1
        });
        latestRoundIds["forest_cover"] = 1;
        
        // AQI: 85 (moderate air quality)
        environmentalData["aqi"] = RoundData({
            answer: 8500,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: 1,
            answeredInRound: 1
        });
        latestRoundIds["aqi"] = 1;
        
        // Temperature: 15.25°C (global average)
        environmentalData["temperature"] = RoundData({
            answer: 1525,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: 1,
            answeredInRound: 1
        });
        latestRoundIds["temperature"] = 1;
    }
    
    /**
     * @dev Update environmental data from external APIs (NASA, OpenAQ, etc.)
     * @param metric Environmental metric type ("pm25", "co2", "forest_cover", etc.)
     * @param value New value (scaled by 100 for 2 decimal places)
     * @param dataSource Source of the data (e.g., "OpenAQ", "NASA_MODIS")
     */
    function updateEnvironmentalData(
        string memory metric,
        int256 value,
        string memory dataSource
    ) external onlyAuthorized {
        _updateEnvironmentalData(metric, value, dataSource);
    }
    
    /**
     * @dev Batch update multiple environmental metrics
     * @param metrics Array of metric names
     * @param values Array of corresponding values
     * @param dataSource Source of the data
     */
    function batchUpdateEnvironmentalData(
        string[] memory metrics,
        int256[] memory values,
        string memory dataSource
    ) external onlyAuthorized {
        require(metrics.length == values.length, "Arrays length mismatch");
        require(metrics.length > 0, "No data to update");

        for (uint i = 0; i < metrics.length; i++) {
            _updateEnvironmentalData(metrics[i], values[i], dataSource);
        }
    }

    /**
     * @dev Internal function to update environmental data
     */
    function _updateEnvironmentalData(
        string memory metric,
        int256 value,
        string memory dataSource
    ) internal {
        require(bytes(metric).length > 0, "Metric cannot be empty");
        require(value >= 0, "Environmental values must be non-negative");

        uint80 newRoundId = latestRoundIds[metric] + 1;
        uint256 currentTime = block.timestamp;

        environmentalData[metric] = RoundData({
            answer: value,
            timestamp: currentTime,
            startedAt: currentTime,
            roundId: newRoundId,
            answeredInRound: newRoundId
        });

        latestRoundIds[metric] = newRoundId;

        emit EnvironmentalDataUpdated(metric, value, currentTime, newRoundId, dataSource);
    }
    
    /**
     * @dev Get latest environmental data for a specific metric
     * @param metric Environmental metric type
     */
    function getLatestEnvironmentalData(string memory metric) 
        external 
        view 
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) 
    {
        RoundData memory data = environmentalData[metric];
        require(data.timestamp > 0, "No data available for this metric");
        
        return (
            data.roundId,
            data.answer,
            data.startedAt,
            data.timestamp,
            data.answeredInRound
        );
    }
    
    // Chainlink AggregatorV3Interface implementation (uses primary metric)
    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return this.getLatestEnvironmentalData(primaryMetric);
    }
    
    function getRoundData(uint80 _roundId)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        // For simplicity, return latest data regardless of round ID
        return this.latestRoundData();
    }
    
    // Convenience functions for specific environmental metrics
    function getLatestPM25Data() external view returns (int256) {
        return environmentalData["pm25"].answer;
    }
    
    function getLatestCO2Data() external view returns (int256) {
        return environmentalData["co2"].answer;
    }
    
    function getLatestForestCoverData() external view returns (int256) {
        return environmentalData["forest_cover"].answer;
    }
    
    function getLatestAQIData() external view returns (int256) {
        return environmentalData["aqi"].answer;
    }
    
    // Admin functions
    function setDataUpdater(address _newUpdater) external onlyOwner {
        address oldUpdater = dataUpdater;
        dataUpdater = _newUpdater;
        emit DataUpdaterChanged(oldUpdater, _newUpdater);
    }
    
    function setPrimaryMetric(string memory _newMetric) external onlyOwner {
        string memory oldMetric = primaryMetric;
        primaryMetric = _newMetric;
        emit PrimaryMetricChanged(oldMetric, _newMetric);
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
    
    // Get comprehensive environmental report
    function getEnvironmentalReport() 
        external 
        view 
        returns (
            int256 pm25Value,
            int256 co2Value,
            int256 forestValue,
            int256 aqiValue,
            uint256 lastUpdated
        ) 
    {
        uint256 latestTimestamp = environmentalData["pm25"].timestamp;
        if (environmentalData["co2"].timestamp > latestTimestamp) {
            latestTimestamp = environmentalData["co2"].timestamp;
        }
        if (environmentalData["forest_cover"].timestamp > latestTimestamp) {
            latestTimestamp = environmentalData["forest_cover"].timestamp;
        }
        if (environmentalData["aqi"].timestamp > latestTimestamp) {
            latestTimestamp = environmentalData["aqi"].timestamp;
        }
        
        return (
            environmentalData["pm25"].answer,
            environmentalData["co2"].answer,
            environmentalData["forest_cover"].answer,
            environmentalData["aqi"].answer,
            latestTimestamp
        );
    }
}
