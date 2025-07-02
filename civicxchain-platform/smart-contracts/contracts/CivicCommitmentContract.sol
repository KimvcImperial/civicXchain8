// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CivicCommitmentContract is ReentrancyGuard, Ownable {
    
    // Replace Counters with a simple uint256
    uint256 private _commitmentIdCounter;
    
    struct Commitment {
        uint256 id;
        address official;
        string description;
        uint256 deadline;
        uint256 targetValue;
        uint256 actualValue;
        string metricType;
        string dataSource;
        bool isCompleted;
        bool rewardClaimed;
        uint256 createdAt;
    }
    
    mapping(uint256 => Commitment) public commitments;
    mapping(address => uint256[]) public officialCommitments;
    
    event CommitmentCreated(
        uint256 indexed commitmentId,
        address indexed official,
        string description,
        uint256 deadline,
        uint256 targetValue,
        string metricType
    );
    
    event CommitmentUpdated(
        uint256 indexed commitmentId,
        uint256 actualValue,
        bool isCompleted
    );
    
    event RewardClaimed(
        uint256 indexed commitmentId,
        address indexed official
    );
    
    constructor() Ownable(msg.sender) {
        _commitmentIdCounter = 0;
    }
    
    function createCommitment(
        string memory _description,
        uint256 _deadline,
        uint256 _targetValue,
        string memory _metricType,
        string memory _dataSource
    ) external returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_targetValue > 0, "Target value must be positive");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        // Increment counter manually
        _commitmentIdCounter++;
        uint256 newCommitmentId = _commitmentIdCounter;
        
        commitments[newCommitmentId] = Commitment({
            id: newCommitmentId,
            official: msg.sender,
            description: _description,
            deadline: _deadline,
            targetValue: _targetValue,
            actualValue: 0,
            metricType: _metricType,
            dataSource: _dataSource,
            isCompleted: false,
            rewardClaimed: false,
            createdAt: block.timestamp
        });
        
        officialCommitments[msg.sender].push(newCommitmentId);
        
        emit CommitmentCreated(
            newCommitmentId,
            msg.sender,
            _description,
            _deadline,
            _targetValue,
            _metricType
        );
        
        return newCommitmentId;
    }
    
    function updateProgress(
        uint256 _commitmentId,
        uint256 _actualValue
    ) external onlyOwner {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");
        
        Commitment storage commitment = commitments[_commitmentId];
        require(!commitment.isCompleted, "Commitment already completed");
        
        commitment.actualValue = _actualValue;
        
        if (_actualValue >= commitment.targetValue) {
            commitment.isCompleted = true;
        }
        
        emit CommitmentUpdated(_commitmentId, _actualValue, commitment.isCompleted);
    }
    
    function claimReward(uint256 _commitmentId) external nonReentrant {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");
        
        Commitment storage commitment = commitments[_commitmentId];
        require(commitment.official == msg.sender, "Only commitment creator can claim reward");
        require(commitment.isCompleted, "Commitment not completed");
        require(!commitment.rewardClaimed, "Reward already claimed");
        
        commitment.rewardClaimed = true;
        
        emit RewardClaimed(_commitmentId, msg.sender);
    }
    
    function getCommitment(uint256 _commitmentId) external view returns (Commitment memory) {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");
        return commitments[_commitmentId];
    }
    
    function getOfficialCommitments(address _official) external view returns (uint256[] memory) {
        return officialCommitments[_official];
    }
    
    function getCurrentCommitmentId() external view returns (uint256) {
        return _commitmentIdCounter;
    }
}