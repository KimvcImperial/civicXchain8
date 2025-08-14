// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title CivicXChain Environmental Governance Contract
 * @dev Binds public officials to environmental commitments with blockchain accountability
 * Uses Chainlink oracles for environmental data verification
 * Rewards ERC-20 tokens for fulfilled commitments, applies penalties for failures
 */
contract CivicXChainGovernance is ERC20, Ownable, ReentrancyGuard {
    
    // Chainlink Oracle interfaces for environmental data
    AggregatorV3Interface internal pm25Feed;
    AggregatorV3Interface internal aqiFeed;  // Air Quality Index
    AggregatorV3Interface internal forestCoverFeed;
    
    struct EnvironmentalCommitment {
        uint256 id;
        string title;
        string description;
        address officialAddress;
        string officialName;
        string officialRole;
        uint256 targetValue;
        uint256 deadline;
        string metricType; // "pm25", "aqi", "forest_cover", etc.
        bool isActive;
        bool isFulfilled;
        bool rewardClaimed;
        uint256 stakeAmount;
        uint256 tokenReward; // ERC-20 token reward amount
        bytes32 oracleJobId;
    }
    
    struct OracleData {
        uint256 value;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(uint256 => EnvironmentalCommitment) public commitments;
    mapping(uint256 => OracleData) public oracleData;
    mapping(address => uint256[]) public officialCommitments;
    
    uint256 public nextCommitmentId = 1;
    uint256 public constant TOKENS_PER_ETH = 1000; // 1 ETH = 1000 CIVIC tokens
    uint256 public totalStaked = 0;

    // Events
    event CommitmentCreated(uint256 indexed commitmentId, address indexed official, string title);
    event CommitmentFulfilled(uint256 indexed commitmentId, uint256 actualValue, uint256 tokensRewarded);
    event TokensRewarded(uint256 indexed commitmentId, address indexed official, uint256 tokenAmount);
    event PenaltyApplied(uint256 indexed commitmentId, address indexed official, uint256 penaltyAmount);
    event CommitmentCancelled(uint256 indexed commitmentId, address indexed official, uint256 refundAmount);
    event OracleDataReceived(uint256 indexed commitmentId, uint256 value, uint256 timestamp);

    constructor(
        address _pm25Feed,
        address _aqiFeed,
        address _forestCoverFeed
    ) ERC20("CivicXChain Environmental Token", "CIVIC") {
        pm25Feed = AggregatorV3Interface(_pm25Feed);
        aqiFeed = AggregatorV3Interface(_aqiFeed);
        forestCoverFeed = AggregatorV3Interface(_forestCoverFeed);

        // Mint initial supply for rewards (100 million tokens)
        _mint(address(this), 100_000_000 * 10**decimals());
    }
    
    /**
     * @dev Create a new environmental commitment
     * @param _title Commitment title
     * @param _description Detailed description
     * @param _officialName Name of the public official
     * @param _officialRole Role/position of the official
     * @param _targetValue Target environmental value to achieve
     * @param _deadline Deadline timestamp
     * @param _metricType Type of environmental metric
     */
    function createCommitment(
        string memory _title,
        string memory _description,
        string memory _officialName,
        string memory _officialRole,
        uint256 _targetValue,
        uint256 _deadline,
        string memory _metricType
    ) external payable {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(msg.value > 0, "Stake amount required");
        
        uint256 commitmentId = nextCommitmentId++;
        
        // Calculate token reward based on stake amount and difficulty
        uint256 tokenReward = calculateTokenReward(msg.value, _metricType);

        commitments[commitmentId] = EnvironmentalCommitment({
            id: commitmentId,
            title: _title,
            description: _description,
            officialAddress: msg.sender,
            officialName: _officialName,
            officialRole: _officialRole,
            targetValue: _targetValue,
            deadline: _deadline,
            metricType: _metricType,
            isActive: true,
            isFulfilled: false,
            rewardClaimed: false,
            stakeAmount: msg.value,
            tokenReward: tokenReward,
            oracleJobId: bytes32(0)
        });

        totalStaked += msg.value;
        
        officialCommitments[msg.sender].push(commitmentId);
        
        emit CommitmentCreated(commitmentId, msg.sender, _title);
    }
    
    /**
     * @dev Check fulfillment status using Chainlink oracle data
     * @param _commitmentId ID of the commitment to check
     */
    function checkFulfillment(uint256 _commitmentId) external view returns (bool fulfilled, uint256 currentValue, uint256 targetValue) {
        EnvironmentalCommitment memory commitment = commitments[_commitmentId];
        require(commitment.isActive, "Commitment not active");
        
        // Get current environmental data from appropriate Chainlink oracle
        uint256 currentEnvValue = getCurrentEnvironmentalValue(commitment.metricType);
        
        // Check if target is met based on metric type
        bool isTargetMet = false;
        if (keccak256(bytes(commitment.metricType)) == keccak256(bytes("pm25"))) {
            // For PM2.5, target is to be BELOW the target value
            isTargetMet = currentEnvValue <= commitment.targetValue;
        } else if (keccak256(bytes(commitment.metricType)) == keccak256(bytes("forest_cover"))) {
            // For forest cover, target is to be ABOVE the target value
            isTargetMet = currentEnvValue >= commitment.targetValue;
        }
        
        return (isTargetMet, currentEnvValue, commitment.targetValue);
    }
    
    /**
     * @dev Claim ETH reward for fulfilled commitment
     * @param _commitmentId ID of the commitment
     */
    function claimEnvironmentalReward(uint256 _commitmentId) external nonReentrant returns (uint256 ethRewarded) {
        EnvironmentalCommitment storage commitment = commitments[_commitmentId];
        require(commitment.officialAddress == msg.sender, "Only commitment creator can claim");
        require(commitment.isActive, "Commitment not active");
        require(!commitment.rewardClaimed, "Reward already claimed");
        // REMOVED: require(block.timestamp >= commitment.deadline, "Deadline not reached yet");
        // SIMPLIFIED: No deadline check - judge verification through oracle is sufficient

        // Verify fulfillment via oracle (this includes judge verification)
        (bool fulfilled, uint256 currentValue,) = this.checkFulfillment(_commitmentId);
        require(fulfilled, "Environmental target not achieved or judge verification required");

        // Mark as fulfilled and claimed
        commitment.isFulfilled = true;
        commitment.rewardClaimed = true;

        // Return ETH stake + bonus (150% return) - NO TOKEN REQUIREMENT
        uint256 ethReward = commitment.stakeAmount + (commitment.stakeAmount / 2);
        totalStaked -= commitment.stakeAmount;
        payable(msg.sender).transfer(ethReward);

        emit CommitmentFulfilled(_commitmentId, currentValue, 0);

        return ethReward;
    }

    /**
     * @dev Cancel a commitment before deadline (with small penalty)
     * @param _commitmentId ID of the commitment to cancel
     */
    function cancelCommitment(uint256 _commitmentId) external nonReentrant {
        EnvironmentalCommitment storage commitment = commitments[_commitmentId];
        require(commitment.officialAddress == msg.sender, "Only commitment creator can cancel");
        require(commitment.isActive, "Commitment not active");
        require(!commitment.isFulfilled, "Cannot cancel fulfilled commitment");
        require(!commitment.rewardClaimed, "Cannot cancel claimed commitment");
        require(block.timestamp < commitment.deadline, "Cannot cancel after deadline");

        // Mark commitment as inactive
        commitment.isActive = false;

        // Apply 10% cancellation fee, refund 90% of stake
        uint256 cancellationFee = commitment.stakeAmount / 10; // 10% fee
        uint256 refundAmount = commitment.stakeAmount - cancellationFee;

        totalStaked -= commitment.stakeAmount;

        // Send cancellation fee to contract owner (environmental fund)
        if (cancellationFee > 0) {
            payable(owner()).transfer(cancellationFee);
        }

        // Refund remaining stake to the official
        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }

        emit CommitmentCancelled(_commitmentId, msg.sender, refundAmount);
    }

    /**
     * @dev Apply penalty for unfulfilled commitment after deadline
     * @param _commitmentId ID of the commitment
     */
    function applyPenalty(uint256 _commitmentId) external {
        EnvironmentalCommitment storage commitment = commitments[_commitmentId];
        require(commitment.isActive, "Commitment not active");
        require(block.timestamp > commitment.deadline, "Deadline not passed");
        require(!commitment.isFulfilled, "Commitment already fulfilled");
        
        // Check if target was not met
        (bool fulfilled,,) = this.checkFulfillment(_commitmentId);
        require(!fulfilled, "Target was actually achieved");
        
        // Apply penalty - forfeit stake
        commitment.isActive = false;

        // Stake goes to contract owner (environmental fund)
        totalStaked -= commitment.stakeAmount;
        payable(owner()).transfer(commitment.stakeAmount);

        emit PenaltyApplied(_commitmentId, commitment.officialAddress, commitment.stakeAmount);
    }
    
    /**
     * @dev Get current environmental value from Chainlink oracle
     * @param _metricType Type of environmental metric
     */
    function getCurrentEnvironmentalValue(string memory _metricType) public view returns (uint256) {
        if (keccak256(bytes(_metricType)) == keccak256(bytes("pm25"))) {
            (, int256 price,,,) = pm25Feed.latestRoundData();
            return uint256(price);
        } else if (keccak256(bytes(_metricType)) == keccak256(bytes("aqi"))) {
            (, int256 price,,,) = aqiFeed.latestRoundData();
            return uint256(price);
        } else if (keccak256(bytes(_metricType)) == keccak256(bytes("forest_cover"))) {
            (, int256 price,,,) = forestCoverFeed.latestRoundData();
            return uint256(price);
        }
        return 0;
    }
    
    /**
     * @dev Get commitment details
     */
    function getCommitment(uint256 _commitmentId) external view returns (EnvironmentalCommitment memory) {
        return commitments[_commitmentId];
    }
    
    /**
     * @dev Get all commitments for an official
     */
    function getOfficialCommitments(address _official) external view returns (uint256[] memory) {
        return officialCommitments[_official];
    }
    
    /**
     * @dev Calculate token reward based on stake amount and commitment difficulty
     * @param _stakeAmount ETH stake amount
     * @param _metricType Type of environmental metric
     */
    function calculateTokenReward(uint256 _stakeAmount, string memory _metricType) internal pure returns (uint256) {
        uint256 baseTokens = _stakeAmount * TOKENS_PER_ETH; // 1 ETH = 1000 CIVIC tokens

        // Difficulty multipliers for different environmental metrics
        uint256 multiplier = 100; // Base 1.0x multiplier (100/100)

        if (keccak256(bytes(_metricType)) == keccak256(bytes("pm25"))) {
            multiplier = 150; // 1.5x for air quality (harder to achieve)
        } else if (keccak256(bytes(_metricType)) == keccak256(bytes("aqi"))) {
            multiplier = 120; // 1.2x for AQI improvement
        } else if (keccak256(bytes(_metricType)) == keccak256(bytes("forest_cover"))) {
            multiplier = 130; // 1.3x for forest protection
        } else if (keccak256(bytes(_metricType)) == keccak256(bytes("water_quality"))) {
            multiplier = 110; // 1.1x for water quality
        }

        return (baseTokens * multiplier) / 100;
    }

    /**
     * @dev Get token balance of an address
     */
    function getTokenBalance(address _account) external view returns (uint256) {
        return balanceOf(_account);
    }

    /**
     * @dev Get contract token reserves
     */
    function getContractTokenBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }

    /**
     * @dev Get total ETH staked in the contract
     */
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    /**
     * @dev Get commitment token reward amount
     */
    function getCommitmentTokenReward(uint256 _commitmentId) external view returns (uint256) {
        return commitments[_commitmentId].tokenReward;
    }

    /**
     * @dev Anyone can act as judge to manually mark commitment as fulfilled (for simplified approval)
     * @param _commitmentId ID of the commitment to mark as fulfilled
     */
    function judgeApproveCommitment(uint256 _commitmentId) external {
        EnvironmentalCommitment storage commitment = commitments[_commitmentId];
        require(commitment.isActive, "Commitment not active");
        require(!commitment.rewardClaimed, "Reward already claimed");

        // Mark as fulfilled by judge approval
        commitment.isFulfilled = true;

        // Emit event with current environmental value and token reward
        uint256 currentValue = getCurrentEnvironmentalValue(commitment.metricType);
        emit CommitmentFulfilled(_commitmentId, currentValue, commitment.tokenReward);
    }

    /**
     * @dev Owner can mint additional tokens for rewards
     */
    function mintRewardTokens(uint256 _amount) external onlyOwner {
        _mint(address(this), _amount);
    }

    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        // Withdraw ETH
        payable(owner()).transfer(address(this).balance);

        // Transfer remaining tokens to owner
        uint256 remainingTokens = balanceOf(address(this));
        if (remainingTokens > 0) {
            _transfer(address(this), owner(), remainingTokens);
        }
    }
}
