// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EnvironmentalDataOracle
 * @dev Real environmental data oracle that can be updated with live data from external sources
 * Supports PM2.5, CO2, and Forest Cover data with Chainlink-compatible interface
 */
contract EnvironmentalDataOracle {
    address public owner;

    // Environmental data storage
    struct EnvironmentalData {
        int256 value;
        uint256 timestamp;
        uint256 round;
    }

    EnvironmentalData public pm25Data;
    EnvironmentalData public co2Data;
    EnvironmentalData public forestCoverData;

    uint8 public constant decimals = 8; // 2 decimal places scaled by 100

    event DataUpdated(string dataType, int256 value, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update data");
        _;
    }

    constructor() {
        owner = msg.sender;

        // Initialize with realistic values
        pm25Data = EnvironmentalData({
            value: 988, // 9.88 μg/m³
            timestamp: block.timestamp,
            round: 1
        });

        co2Data = EnvironmentalData({
            value: 42150, // 421.50 ppm
            timestamp: block.timestamp,
            round: 1
        });

        forestCoverData = EnvironmentalData({
            value: 6850, // 68.50%
            timestamp: block.timestamp,
            round: 1
        });
    }

    // Update functions for real environmental data
    function updatePM25Data(int256 _value) external onlyOwner {
        pm25Data.value = _value;
        pm25Data.timestamp = block.timestamp;
        pm25Data.round++;
        emit DataUpdated("PM25", _value, block.timestamp);
    }

    function updateCO2Data(int256 _value) external onlyOwner {
        co2Data.value = _value;
        co2Data.timestamp = block.timestamp;
        co2Data.round++;
        emit DataUpdated("CO2", _value, block.timestamp);
    }

    function updateForestCoverData(int256 _value) external onlyOwner {
        forestCoverData.value = _value;
        forestCoverData.timestamp = block.timestamp;
        forestCoverData.round++;
        emit DataUpdated("ForestCover", _value, block.timestamp);
    }

    // Getter functions for environmental data
    function getLatestPM25Data() external view returns (int256) {
        return pm25Data.value;
    }

    function getLatestCO2Data() external view returns (int256) {
        return co2Data.value;
    }

    function getLatestForestCoverData() external view returns (int256) {
        return forestCoverData.value;
    }

    // Chainlink-compatible interface for PM2.5 data
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (
            uint80(pm25Data.round),
            pm25Data.value,
            pm25Data.timestamp,
            pm25Data.timestamp,
            uint80(pm25Data.round)
        );
    }

    // Get comprehensive environmental report
    function getEnvironmentalReport() external view returns (
        int256 pm25Value,
        int256 co2Value,
        int256 forestValue,
        uint256 lastUpdated
    ) {
        uint256 latestTimestamp = pm25Data.timestamp;
        if (co2Data.timestamp > latestTimestamp) latestTimestamp = co2Data.timestamp;
        if (forestCoverData.timestamp > latestTimestamp) latestTimestamp = forestCoverData.timestamp;

        return (
            pm25Data.value,
            co2Data.value,
            forestCoverData.value,
            latestTimestamp
        );
    }
}
