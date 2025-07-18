// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CivicToken.sol";
import "./EnvironmentalDataOracle.sol";

/**
 * @title CivicXChainComplete
 * @dev Complete governance contract for environmental commitments with:
 * - Real Chainlink oracle integration
 * - Automatic verification system  
 * - Token rewards and penalties
 * - Commitment lifecycle management
 */
contract CivicXChainComplete is Ownable, ReentrancyGuard {
    
    struct Commitment {
        uint256 id;
        string title;
        string description;
        address official;
        string officialName;
        string role;
        uint256 targetValue; // Scaled by 100 (e.g., 1000 = 10.00)
        uint256 deadline;
        uint256 stakeAmount; // In CIVIC tokens
        bool isActive;
        bool isFulfilled;
        bool isVerified;
        uint256 createdAt;
        uint256 verifiedAt;
        string metricType; // "PM25", "CO2", "FOREST"
        uint256 actualValue; // Final measured value
        uint256 baselineValue; // Starting value when commitment created
    }
    
    EnvironmentalDataOracle public environmentalOracle;
    CivicToken public civicToken;
    
    mapping(uint256 => Commitment) public commitments;
    mapping(address => uint256[]) public officialCommitments;
    mapping(string => uint256) public metricThresholds; // Minimum improvement thresholds
    
    uint256 public nextCommitmentId = 1;
    uint256 public totalCommitments;
    uint256 public fulfilledCommitments;
    uint256 public failedCommitments;
    
    // Verification settings
    uint256 public verificationWindow = 24 hours; // Time after deadline to verify
    uint256 public minimumStake = 100 * 10**18; // 100 CIVIC tokens minimum stake
    
    event CommitmentCreated(
        uint256 indexed id,
        address indexed official,
        string title,
        uint256 targetValue,
        uint256 deadline,
        string metricType
    );
    
    event CommitmentFulfilled(uint256 indexed id, address indexed official, uint256 actualValue, uint256 reward);
    event CommitmentFailed(uint256 indexed id, address indexed official, uint256 actualValue, uint256 penalty);
    event CommitmentVerified(uint256 indexed id, bool success, uint256 actualValue);
    
    constructor(address _environmentalOracle, address _civicToken) {
        environmentalOracle = EnvironmentalDataOracle(_environmentalOracle);
        civicToken = CivicToken(_civicToken);
        
        // Set default thresholds for meaningful environmental improvements
        metricThresholds["PM25"] = 100; // 1.00 μg/m³ improvement required
        metricThresholds["CO2"] = 100; // 1.00 ppm reduction required  
        metricThresholds["FOREST"] = 50; // 0.50% increase required
    }
    
    /**
     * @dev Create environmental commitment with token staking
     */
    function createCommitment(
        string memory _title,
        string memory _description,
        string memory _officialName,
        string memory _role,
        uint256 _targetValue,
        uint256 _deadline,
        uint256 _stakeAmount,
        string memory _metricType
    ) external nonReentrant {
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_stakeAmount >= minimumStake, "Stake amount too low");
        require(bytes(_metricType).length > 0, "Metric type required");
        
        // Transfer stake tokens to contract
        require(civicToken.transferFrom(msg.sender, address(this), _stakeAmount), "Stake transfer failed");
        
        // Get current baseline value from oracle
        uint256 baselineValue = getCurrentMetricValue(_metricType);
        
        Commitment memory newCommitment = Commitment({
            id: nextCommitmentId,
            title: _title,
            description: _description,
            official: msg.sender,
            officialName: _officialName,
            role: _role,
            targetValue: _targetValue,
            deadline: _deadline,
            stakeAmount: _stakeAmount,
            isActive: true,
            isFulfilled: false,
            isVerified: false,
            createdAt: block.timestamp,
            verifiedAt: 0,
            metricType: _metricType,
            actualValue: 0,
            baselineValue: baselineValue
        });
        
        commitments[nextCommitmentId] = newCommitment;
        officialCommitments[msg.sender].push(nextCommitmentId);
        
        totalCommitments++;
        
        emit CommitmentCreated(
            nextCommitmentId,
            msg.sender,
            _title,
            _targetValue,
            _deadline,
            _metricType
        );
        
        nextCommitmentId++;
    }
    
    /**
     * @dev Verify commitment after deadline using oracle data
     */
    function verifyCommitment(uint256 _commitmentId) external nonReentrant {
        Commitment storage commitment = commitments[_commitmentId];
        
        require(commitment.isActive, "Commitment not active");
        require(!commitment.isVerified, "Already verified");
        require(block.timestamp >= commitment.deadline, "Deadline not reached");
        require(block.timestamp <= commitment.deadline + verificationWindow, "Verification window expired");
        
        // Get current metric value from oracle
        uint256 currentValue = getCurrentMetricValue(commitment.metricType);
        commitment.actualValue = currentValue;
        commitment.verifiedAt = block.timestamp;
        commitment.isVerified = true;
        
        // Check if commitment was fulfilled
        bool success = checkCommitmentSuccess(commitment);
        
        if (success) {
            // Commitment fulfilled - reward tokens
            commitment.isFulfilled = true;
            fulfilledCommitments++;
            
            // Calculate reward based on commitment type
            uint256 rewardAmount = civicToken.getRewardAmount(commitment.metricType);
            
            // Return stake + reward
            civicToken.transfer(commitment.official, commitment.stakeAmount);
            civicToken.rewardTokens(commitment.official, rewardAmount, 
                string(abi.encodePacked("Fulfilled commitment: ", commitment.title)));
            
            emit CommitmentFulfilled(_commitmentId, commitment.official, currentValue, rewardAmount);
        } else {
            // Commitment failed - apply penalty
            failedCommitments++;
            
            // Calculate penalty
            uint256 penaltyAmount = civicToken.getPenaltyAmount(commitment.metricType);
            
            // Burn penalty from stake, return remainder
            if (commitment.stakeAmount > penaltyAmount) {
                civicToken.transfer(address(0), penaltyAmount); // Burn penalty
                civicToken.transfer(commitment.official, commitment.stakeAmount - penaltyAmount);
            } else {
                civicToken.transfer(address(0), commitment.stakeAmount); // Burn entire stake
            }
            
            emit CommitmentFailed(_commitmentId, commitment.official, currentValue, penaltyAmount);
        }
        
        commitment.isActive = false;
        emit CommitmentVerified(_commitmentId, success, currentValue);
    }
    
    /**
     * @dev Get current metric value from oracle
     */
    function getCurrentMetricValue(string memory metricType) public view returns (uint256) {
        bytes32 typeHash = keccak256(abi.encodePacked(metricType));
        
        if (typeHash == keccak256(abi.encodePacked("PM25"))) {
            return uint256(environmentalOracle.getLatestPM25Data());
        } else if (typeHash == keccak256(abi.encodePacked("CO2"))) {
            return uint256(environmentalOracle.getLatestCO2Data());
        } else if (typeHash == keccak256(abi.encodePacked("FOREST"))) {
            return uint256(environmentalOracle.getLatestForestCoverData());
        }
        
        revert("Unknown metric type");
    }
    
    /**
     * @dev Check if commitment was successfully fulfilled
     */
    function checkCommitmentSuccess(Commitment memory commitment) internal view returns (bool) {
        bytes32 typeHash = keccak256(abi.encodePacked(commitment.metricType));
        
        if (typeHash == keccak256(abi.encodePacked("PM25"))) {
            // PM2.5 should decrease (lower is better)
            return commitment.actualValue <= commitment.targetValue;
        } else if (typeHash == keccak256(abi.encodePacked("CO2"))) {
            // CO2 should decrease (lower is better)
            return commitment.actualValue <= commitment.targetValue;
        } else if (typeHash == keccak256(abi.encodePacked("FOREST"))) {
            // Forest cover should increase (higher is better)
            return commitment.actualValue >= commitment.targetValue;
        }
        
        return false;
    }
    
    /**
     * @dev Get commitment details
     */
    function getCommitment(uint256 _commitmentId) external view returns (Commitment memory) {
        return commitments[_commitmentId];
    }
    
    /**
     * @dev Get commitments by official
     */
    function getOfficialCommitments(address _official) external view returns (uint256[] memory) {
        return officialCommitments[_official];
    }
    
    /**
     * @dev Get platform statistics
     */
    function getStats() external view returns (
        uint256 total,
        uint256 fulfilled,
        uint256 failed,
        uint256 active
    ) {
        return (totalCommitments, fulfilledCommitments, failedCommitments, totalCommitments - fulfilledCommitments - failedCommitments);
    }
    
    /**
     * @dev Emergency function to update oracle address
     */
    function updateOracle(address _newOracle) external onlyOwner {
        environmentalOracle = EnvironmentalDataOracle(_newOracle);
    }
    
    /**
     * @dev Update verification window
     */
    function updateVerificationWindow(uint256 _newWindow) external onlyOwner {
        verificationWindow = _newWindow;
    }
}
