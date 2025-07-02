// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EnvironmentalDataContract is Ownable {
    
    struct EnvironmentalData {
        uint256 pm25Level;
        uint256 forestCoverPercentage;
        uint256 airQualityIndex;
        uint256 waterQualityScore;
        uint256 lastUpdated;
    }
    
    mapping(string => EnvironmentalData) public regionalData;
    string[] public regions;
    
    event DataUpdated(
        string indexed region,
        uint256 pm25Level,
        uint256 forestCoverPercentage,
        uint256 airQualityIndex,
        uint256 waterQualityScore
    );
    
    // FIXED: Added Ownable(msg.sender) and updated pragma version
    constructor() Ownable(msg.sender) {}
    
    function updateEnvironmentalData(
        string memory _region,
        uint256 _pm25Level,
        uint256 _forestCoverPercentage,
        uint256 _airQualityIndex,
        uint256 _waterQualityScore
    ) external onlyOwner {
        
        // Add region if it's new
        if (regionalData[_region].lastUpdated == 0) {
            regions.push(_region);
        }
        
        regionalData[_region] = EnvironmentalData({
            pm25Level: _pm25Level,
            forestCoverPercentage: _forestCoverPercentage,
            airQualityIndex: _airQualityIndex,
            waterQualityScore: _waterQualityScore,
            lastUpdated: block.timestamp
        });
        
        emit DataUpdated(
            _region,
            _pm25Level,
            _forestCoverPercentage,
            _airQualityIndex,
            _waterQualityScore
        );
    }
    
    function getEnvironmentalData(string memory _region) 
        external 
        view 
        returns (EnvironmentalData memory) {
        return regionalData[_region];
    }
    
    function getAllRegions() external view returns (string[] memory) {
        return regions;
    }
}