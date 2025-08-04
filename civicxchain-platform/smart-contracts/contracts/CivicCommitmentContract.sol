// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for the Environmental Data History contract
interface IEnvironmentalDataHistory {
    function isCommitmentMet(
        string memory metric,
        int256 targetValue,
        string memory period,
        uint256 duration
    ) external view returns (bool isMet, int256 averageValue, uint256 periodsChecked);

    function getCurrentTrend(
        string memory metric,
        string memory period
    ) external view returns (int256 trendValue, bool hasData);
}

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
        // New fields for trend-based evaluation
        string evaluationPeriod; // "hourly", "daily", "weekly", "monthly"
        uint256 evaluationDuration; // Number of periods to evaluate
        bool useTrendEvaluation; // Whether to use trend-based evaluation
        int256 lastTrendValue; // Last calculated trend value
        uint256 lastEvaluationTime; // Last time trend evaluation was performed
    }
    
    mapping(uint256 => Commitment) public commitments;
    mapping(address => uint256[]) public officialCommitments;

    // Environmental Data History contract for trend-based evaluation
    IEnvironmentalDataHistory public environmentalDataHistory;
    
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
        return createCommitmentWithTrend(
            _description,
            _deadline,
            _targetValue,
            _metricType,
            _dataSource,
            false, // Default: don't use trend evaluation
            "daily",
            7 // Default: 7 days
        );
    }

    function createCommitmentWithTrend(
        string memory _description,
        uint256 _deadline,
        uint256 _targetValue,
        string memory _metricType,
        string memory _dataSource,
        bool _useTrendEvaluation,
        string memory _evaluationPeriod,
        uint256 _evaluationDuration
    ) public returns (uint256) {
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
            createdAt: block.timestamp,
            evaluationPeriod: _evaluationPeriod,
            evaluationDuration: _evaluationDuration,
            useTrendEvaluation: _useTrendEvaluation,
            lastTrendValue: 0,
            lastEvaluationTime: 0
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

    function cancelCommitment(uint256 _commitmentId) external nonReentrant {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");

        Commitment storage commitment = commitments[_commitmentId];
        require(commitment.official == msg.sender, "Only commitment creator can cancel");
        require(!commitment.isCompleted, "Cannot cancel completed commitment");
        require(!commitment.rewardClaimed, "Cannot cancel commitment with claimed reward");
        require(block.timestamp < commitment.deadline, "Cannot cancel expired commitment");

        // Mark as completed (cancelled)
        commitment.isCompleted = true;

        emit CommitmentUpdated(_commitmentId, 0, true);
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

    /**
     * @dev Set the Environmental Data History contract address
     */
    function setEnvironmentalDataHistory(address _environmentalDataHistory) external onlyOwner {
        environmentalDataHistory = IEnvironmentalDataHistory(_environmentalDataHistory);
    }

    /**
     * @dev Evaluate commitment using trend-based data
     */
    function evaluateCommitmentWithTrend(uint256 _commitmentId) external returns (bool isAchieved, int256 averageValue) {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");
        require(address(environmentalDataHistory) != address(0), "Environmental data history not set");

        Commitment storage commitment = commitments[_commitmentId];
        require(!commitment.isCompleted, "Commitment already completed");
        require(commitment.useTrendEvaluation, "Commitment does not use trend evaluation");

        // Get trend-based evaluation from Environmental Data History contract
        (bool isMet, int256 avgValue, uint256 periodsChecked) = environmentalDataHistory.isCommitmentMet(
            commitment.metricType,
            int256(commitment.targetValue),
            commitment.evaluationPeriod,
            commitment.evaluationDuration
        );

        // Update commitment with trend evaluation results
        commitment.actualValue = uint256(avgValue > 0 ? avgValue : 0);
        commitment.lastEvaluationTime = block.timestamp;

        if (isMet && periodsChecked >= commitment.evaluationDuration) {
            commitment.isCompleted = true;
        }

        emit CommitmentUpdated(_commitmentId, commitment.actualValue, commitment.isCompleted);

        return (isMet, avgValue);
    }

    /**
     * @dev Get commitment trend information
     */
    function getCommitmentTrend(uint256 _commitmentId) external view returns (
        int256 trendValue,
        bool hasData,
        string memory direction
    ) {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");
        require(address(environmentalDataHistory) != address(0), "Environmental data history not set");

        Commitment memory commitment = commitments[_commitmentId];

        if (!commitment.useTrendEvaluation) {
            return (0, false, "not_applicable");
        }

        (int256 trend, bool hasDataAvailable) = environmentalDataHistory.getCurrentTrend(
            commitment.metricType,
            commitment.evaluationPeriod
        );

        string memory trendDirection;
        if (!hasDataAvailable) {
            trendDirection = "no_data";
        } else if (trend > 0) {
            trendDirection = "improving"; // For environmental metrics, decreasing values are improving
        } else if (trend < 0) {
            trendDirection = "worsening";
        } else {
            trendDirection = "stable";
        }

        return (trend, hasDataAvailable, trendDirection);
    }

    /**
     * @dev Check if commitment can be evaluated with current trend data
     */
    function canEvaluateWithTrend(uint256 _commitmentId) external view returns (bool canEvaluate, string memory reason) {
        require(_commitmentId <= _commitmentIdCounter, "Invalid commitment ID");
        require(_commitmentId > 0, "Invalid commitment ID");

        Commitment memory commitment = commitments[_commitmentId];

        if (commitment.isCompleted) {
            return (false, "already_completed");
        }

        if (!commitment.useTrendEvaluation) {
            return (false, "trend_evaluation_disabled");
        }

        if (address(environmentalDataHistory) == address(0)) {
            return (false, "history_contract_not_set");
        }

        if (block.timestamp >= commitment.deadline) {
            return (false, "deadline_passed");
        }

        return (true, "ready_for_evaluation");
    }
}