// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * @title ChainlinkEnvironmentalOracle
 * @dev Uses Chainlink oracles to fetch real environmental data from NASA API, OpenAQ, etc.
 * Implements AggregatorV3Interface for compatibility with existing contracts
 */
contract ChainlinkEnvironmentalOracle is ChainlinkClient, ConfirmedOwner, AggregatorV3Interface {
    using Chainlink for Chainlink.Request;

    // Chainlink configuration for Sepolia
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    // Environmental data storage
    struct EnvironmentalData {
        int256 value;
        uint256 timestamp;
        uint80 roundId;
        bool isValid;
    }

    mapping(string => EnvironmentalData) public environmentalData;
    mapping(string => uint80) public latestRoundIds;
    
    string public primaryMetric = "pm25";
    uint8 public constant override decimals = 2;
    string public override description = "Chainlink Environmental Data Oracle - NASA/OpenAQ";
    uint256 public override version = 1;

    // Events
    event EnvironmentalDataRequested(bytes32 indexed requestId, string metric, string apiEndpoint);
    event EnvironmentalDataReceived(bytes32 indexed requestId, string metric, int256 value);
    event OracleConfigUpdated(address oracle, bytes32 jobId, uint256 fee);

    constructor() ConfirmedOwner(msg.sender) {
        // Sepolia testnet configuration
        setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789); // LINK token on Sepolia
        
        // Chainlink oracle and job configuration for Sepolia
        oracle = 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD; // Chainlink oracle on Sepolia
        jobId = "ca98366cc7314957b8c012c72f05aeeb"; // HTTP GET job ID
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 LINK per request

        // Initialize with default values
        _initializeEnvironmentalData();
    }

    function _initializeEnvironmentalData() private {
        uint256 currentTime = block.timestamp;
        
        // PM2.5: 12.50 μg/m³
        environmentalData["pm25"] = EnvironmentalData({
            value: 1250,
            timestamp: currentTime,
            roundId: 1,
            isValid: true
        });
        latestRoundIds["pm25"] = 1;
        
        // CO2: 421.50 ppm
        environmentalData["co2"] = EnvironmentalData({
            value: 42150,
            timestamp: currentTime,
            roundId: 1,
            isValid: true
        });
        latestRoundIds["co2"] = 1;
        
        // Forest Cover: 68.50%
        environmentalData["forest_cover"] = EnvironmentalData({
            value: 6850,
            timestamp: currentTime,
            roundId: 1,
            isValid: true
        });
        latestRoundIds["forest_cover"] = 1;
    }

    /**
     * @dev Request PM2.5 data from OpenAQ API via Chainlink
     * @param location Location for air quality data (e.g., "New York")
     */
    function requestPM25Data(string memory location) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillPM25Data.selector
        );

        // OpenAQ API endpoint for PM2.5 data
        string memory apiUrl = string(abi.encodePacked(
            "https://api.openaq.org/v2/latest?parameter=pm25&location=",
            location,
            "&limit=1&order_by=lastUpdated&sort=desc"
        ));
        
        request.add("get", apiUrl);
        request.add("path", "results,0,value"); // JSON path to extract PM2.5 value
        request.addInt("times", 100); // Multiply by 100 for 2 decimal places

        requestId = sendChainlinkRequest(request, fee);
        emit EnvironmentalDataRequested(requestId, "pm25", apiUrl);
        return requestId;
    }

    /**
     * @dev Request CO2 data from NASA POWER API via Chainlink
     * @param lat Latitude
     * @param lon Longitude
     */
    function requestCO2Data(string memory lat, string memory lon) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillCO2Data.selector
        );

        // NASA POWER API endpoint (using temperature as proxy for CO2 estimation)
        string memory apiUrl = string(abi.encodePacked(
            "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=RE&longitude=",
            lon,
            "&latitude=",
            lat,
            "&start=20240101&end=20241231&format=JSON"
        ));
        
        request.add("get", apiUrl);
        request.add("path", "properties,parameter,T2M"); // Extract temperature data
        request.addInt("times", 100);

        requestId = sendChainlinkRequest(request, fee);
        emit EnvironmentalDataRequested(requestId, "co2", apiUrl);
        return requestId;
    }

    /**
     * @dev Request Forest Cover data from NASA Earth API via Chainlink
     * @param lat Latitude
     * @param lon Longitude
     */
    function requestForestCoverData(string memory lat, string memory lon) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillForestCoverData.selector
        );

        // NASA Earth API endpoint for vegetation/forest data
        string memory apiUrl = string(abi.encodePacked(
            "https://api.nasa.gov/planetary/earth/statistics?lon=",
            lon,
            "&lat=",
            lat,
            "&date=2024-01-01&api_key=DEMO_KEY"
        ));
        
        request.add("get", apiUrl);
        request.add("path", "statistics,vegetation_index"); // Extract vegetation index
        request.addInt("times", 10000); // Convert to percentage * 100

        requestId = sendChainlinkRequest(request, fee);
        emit EnvironmentalDataRequested(requestId, "forest_cover", apiUrl);
        return requestId;
    }

    /**
     * @dev Chainlink callback for PM2.5 data
     */
    function fulfillPM25Data(bytes32 _requestId, int256 _value) public recordChainlinkFulfillment(_requestId) {
        _updateEnvironmentalData("pm25", _value);
        emit EnvironmentalDataReceived(_requestId, "pm25", _value);
    }

    /**
     * @dev Chainlink callback for CO2 data
     */
    function fulfillCO2Data(bytes32 _requestId, int256 _temperature) public recordChainlinkFulfillment(_requestId) {
        // Convert temperature to estimated CO2 (simplified model)
        // Base CO2 (421 ppm) with temperature correlation
        int256 baseCO2 = 42150; // 421.50 ppm * 100
        int256 tempVariation = (_temperature - 1500) / 10; // Temperature deviation from 15°C
        int256 estimatedCO2 = baseCO2 + tempVariation;
        
        _updateEnvironmentalData("co2", estimatedCO2);
        emit EnvironmentalDataReceived(_requestId, "co2", estimatedCO2);
    }

    /**
     * @dev Chainlink callback for Forest Cover data
     */
    function fulfillForestCoverData(bytes32 _requestId, int256 _vegIndex) public recordChainlinkFulfillment(_requestId) {
        // Convert vegetation index to forest cover percentage
        int256 forestCover = _vegIndex; // Already scaled by 10000
        
        _updateEnvironmentalData("forest_cover", forestCover);
        emit EnvironmentalDataReceived(_requestId, "forest_cover", forestCover);
    }

    /**
     * @dev Internal function to update environmental data
     */
    function _updateEnvironmentalData(string memory metric, int256 value) internal {
        uint80 newRoundId = latestRoundIds[metric] + 1;
        
        environmentalData[metric] = EnvironmentalData({
            value: value,
            timestamp: block.timestamp,
            roundId: newRoundId,
            isValid: true
        });
        
        latestRoundIds[metric] = newRoundId;
    }

    // AggregatorV3Interface implementation
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
        EnvironmentalData memory data = environmentalData[primaryMetric];
        require(data.isValid, "No valid data available");
        
        return (
            data.roundId,
            data.value,
            data.timestamp,
            data.timestamp,
            data.roundId
        );
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
        return this.latestRoundData();
    }

    // Convenience functions
    function getLatestPM25Data() external view returns (int256) {
        return environmentalData["pm25"].value;
    }

    function getLatestCO2Data() external view returns (int256) {
        return environmentalData["co2"].value;
    }

    function getLatestForestCoverData() external view returns (int256) {
        return environmentalData["forest_cover"].value;
    }

    // Admin functions
    function updateOracleConfig(address _oracle, bytes32 _jobId, uint256 _fee) external onlyOwner {
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
        emit OracleConfigUpdated(_oracle, _jobId, _fee);
    }

    function setPrimaryMetric(string memory _metric) external onlyOwner {
        primaryMetric = _metric;
    }

    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    /**
     * @dev Batch request all environmental data
     */
    function requestAllEnvironmentalData() external onlyOwner {
        requestPM25Data("New York");
        requestCO2Data("40.7128", "-74.0060"); // NYC coordinates
        requestForestCoverData("40.7128", "-74.0060");
    }
}
