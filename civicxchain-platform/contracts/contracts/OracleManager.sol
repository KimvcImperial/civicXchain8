// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./ChainlinkEnvironmentalOracle.sol";
import "./RealEnvironmentalOracle.sol";

/**
 * @title OracleManager
 * @dev Manages dual oracle system: Chainlink primary + RealEnvironmental fallback
 * Demonstrates production-grade oracle reliability with true Chainlink integration
 * 
 * Architecture:
 * 1. Primary: ChainlinkEnvironmentalOracle (fetches from NASA/OpenAQ via Chainlink network)
 * 2. Fallback: RealEnvironmentalOracle (backup data source)
 * 3. Smart switching based on data freshness and availability
 */
contract OracleManager is AggregatorV3Interface {
    // Oracle contracts
    ChainlinkEnvironmentalOracle public chainlinkOracle;
    RealEnvironmentalOracle public fallbackOracle;
    
    // Configuration
    uint256 public constant CHAINLINK_TIMEOUT = 2 hours; // Consider data stale after 2 hours
    uint256 public constant FALLBACK_TIMEOUT = 6 hours;  // Fallback data timeout
    
    // Admin
    address public owner;
    
    // Oracle status tracking
    enum OracleStatus { CHAINLINK_ACTIVE, FALLBACK_ACTIVE, BOTH_FAILED }
    OracleStatus public currentStatus;
    
    // Events
    event OracleStatusChanged(OracleStatus oldStatus, OracleStatus newStatus);
    event ChainlinkDataRequested(string metric, uint256 timestamp);
    event FallbackActivated(string reason, uint256 timestamp);
    
    // Chainlink interface compatibility
    uint8 public constant override decimals = 2;
    string public override description = "Dual Oracle Manager - Chainlink Primary + Fallback";
    uint256 public override version = 1;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor(address _chainlinkOracle, address _fallbackOracle) {
        require(_chainlinkOracle != address(0), "Chainlink oracle cannot be zero address");
        require(_fallbackOracle != address(0), "Fallback oracle cannot be zero address");
        
        chainlinkOracle = ChainlinkEnvironmentalOracle(_chainlinkOracle);
        fallbackOracle = RealEnvironmentalOracle(_fallbackOracle);
        owner = msg.sender;
        currentStatus = OracleStatus.CHAINLINK_ACTIVE;
    }
    
    /**
     * @dev Get environmental data with intelligent oracle selection
     * @param metric Environmental metric type ("pm25", "co2", "forest_cover", "aqi")
     * @return Latest environmental value with automatic fallback
     */
    function getEnvironmentalData(string memory metric) external view returns (int256) {
        // Try Chainlink oracle first (primary)
        int256 chainlinkValue = _getChainlinkData(metric);
        if (chainlinkValue > 0) {
            // Check if Chainlink data is fresh by getting latest round data
            try chainlinkOracle.latestRoundData() returns (
                uint80, int256, uint256, uint256 updatedAt, uint80
            ) {
                if (block.timestamp - updatedAt < CHAINLINK_TIMEOUT) {
                    return chainlinkValue; // Use fresh Chainlink data
                }
            } catch {
                // Chainlink failed, will use fallback
            }
        }

        // Fallback to RealEnvironmentalOracle
        try fallbackOracle.getLatestEnvironmentalData(metric) returns (
            uint80, int256 answer, uint256, uint256 updatedAt, uint80
        ) {
            // Check if fallback data is acceptable
            if (block.timestamp - updatedAt < FALLBACK_TIMEOUT && answer > 0) {
                return answer; // Use fallback data
            }
        } catch {
            // Both oracles failed
        }

        // Return default value if both oracles fail
        return _getDefaultValue(metric);
    }

    /**
     * @dev Get data from Chainlink oracle based on metric type
     */
    function _getChainlinkData(string memory metric) private view returns (int256) {
        if (keccak256(bytes(metric)) == keccak256(bytes("pm25"))) {
            try chainlinkOracle.getLatestPM25Data() returns (int256 value) {
                return value;
            } catch {
                return 0;
            }
        } else if (keccak256(bytes(metric)) == keccak256(bytes("co2"))) {
            try chainlinkOracle.getLatestCO2Data() returns (int256 value) {
                return value;
            } catch {
                return 0;
            }
        } else if (keccak256(bytes(metric)) == keccak256(bytes("forest_cover"))) {
            try chainlinkOracle.getLatestForestCoverData() returns (int256 value) {
                return value;
            } catch {
                return 0;
            }
        }
        return 0;
    }
    
    /**
     * @dev Request fresh data from Chainlink oracle (costs LINK tokens)
     * @param metric Environmental metric to request
     * @param location Location for PM2.5 or latitude for CO2/forest
     * @param longitude Longitude for CO2/forest (ignored for PM2.5)
     */
    function requestChainlinkData(string memory metric, string memory location, string memory longitude) external onlyOwner {
        require(bytes(metric).length > 0, "Metric cannot be empty");
        require(bytes(location).length > 0, "Location cannot be empty");

        // Request data through Chainlink oracle
        if (keccak256(bytes(metric)) == keccak256(bytes("pm25"))) {
            chainlinkOracle.requestPM25Data(location);
        } else if (keccak256(bytes(metric)) == keccak256(bytes("co2"))) {
            require(bytes(longitude).length > 0, "Longitude required for CO2");
            chainlinkOracle.requestCO2Data(location, longitude);
        } else if (keccak256(bytes(metric)) == keccak256(bytes("forest_cover"))) {
            require(bytes(longitude).length > 0, "Longitude required for forest cover");
            chainlinkOracle.requestForestCoverData(location, longitude);
        }

        emit ChainlinkDataRequested(metric, block.timestamp);
    }

    /**
     * @dev Request all environmental data with default NYC coordinates
     */
    function requestAllEnvironmentalData() external onlyOwner {
        chainlinkOracle.requestPM25Data("New York");
        chainlinkOracle.requestCO2Data("40.7128", "-74.0060"); // NYC coordinates
        chainlinkOracle.requestForestCoverData("40.7128", "-74.0060");

        emit ChainlinkDataRequested("all", block.timestamp);
    }
    
    /**
     * @dev Get oracle health status
     */
    function getOracleStatus() external view returns (
        OracleStatus status,
        bool chainlinkHealthy,
        bool fallbackHealthy,
        uint256 chainlinkLastUpdate,
        uint256 fallbackLastUpdate
    ) {
        // Check Chainlink health
        chainlinkHealthy = false;
        chainlinkLastUpdate = 0;
        try chainlinkOracle.latestRoundData() returns (
            uint80, int256, uint256, uint256 updatedAt, uint80
        ) {
            chainlinkLastUpdate = updatedAt;
            chainlinkHealthy = (block.timestamp - updatedAt) < CHAINLINK_TIMEOUT;
        } catch {}
        
        // Check fallback health
        fallbackHealthy = false;
        fallbackLastUpdate = 0;
        try fallbackOracle.latestRoundData() returns (
            uint80, int256, uint256, uint256 updatedAt, uint80
        ) {
            fallbackLastUpdate = updatedAt;
            fallbackHealthy = (block.timestamp - updatedAt) < FALLBACK_TIMEOUT;
        } catch {}
        
        // Determine overall status
        if (chainlinkHealthy) {
            status = OracleStatus.CHAINLINK_ACTIVE;
        } else if (fallbackHealthy) {
            status = OracleStatus.FALLBACK_ACTIVE;
        } else {
            status = OracleStatus.BOTH_FAILED;
        }
        
        return (status, chainlinkHealthy, fallbackHealthy, chainlinkLastUpdate, fallbackLastUpdate);
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
        // Try Chainlink first, then fallback
        try chainlinkOracle.latestRoundData() returns (
            uint80 _roundId, int256 _answer, uint256 _startedAt, uint256 _updatedAt, uint80 _answeredInRound
        ) {
            if (block.timestamp - _updatedAt < CHAINLINK_TIMEOUT) {
                return (_roundId, _answer, _startedAt, _updatedAt, _answeredInRound);
            }
        } catch {}
        
        // Use fallback
        return fallbackOracle.latestRoundData();
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
        // For simplicity, return latest data
        return this.latestRoundData();
    }
    
    /**
     * @dev Get default values for metrics when both oracles fail
     */
    function _getDefaultValue(string memory metric) private pure returns (int256) {
        if (keccak256(bytes(metric)) == keccak256(bytes("pm25"))) {
            return 1500; // 15.00 μg/m³ (WHO guideline)
        } else if (keccak256(bytes(metric)) == keccak256(bytes("co2"))) {
            return 42000; // 420.00 ppm (current global average)
        } else if (keccak256(bytes(metric)) == keccak256(bytes("forest_cover"))) {
            return 6800; // 68.00% (global forest cover)
        } else if (keccak256(bytes(metric)) == keccak256(bytes("aqi"))) {
            return 8500; // 85 AQI (moderate)
        }
        return 0;
    }
    
    // Admin functions
    function updateChainlinkOracle(address _newChainlinkOracle) external onlyOwner {
        require(_newChainlinkOracle != address(0), "Invalid address");
        chainlinkOracle = ChainlinkEnvironmentalOracle(_newChainlinkOracle);
    }
    
    function updateFallbackOracle(address _newFallbackOracle) external onlyOwner {
        require(_newFallbackOracle != address(0), "Invalid address");
        fallbackOracle = RealEnvironmentalOracle(_newFallbackOracle);
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}
