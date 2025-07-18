// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CivicToken
 * @dev ERC20 token for rewarding environmental commitment fulfillment
 * Features:
 * - Mintable by governance contract for rewards
 * - Burnable for penalties
 * - Capped supply to prevent inflation
 */
contract CivicToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant REWARD_AMOUNT = 1000 * 10**18; // 1000 tokens per fulfilled commitment
    uint256 public constant PENALTY_AMOUNT = 500 * 10**18; // 500 tokens penalty for failed commitment
    
    mapping(address => bool) public authorizedMinters;
    mapping(address => uint256) public stakedTokens;
    
    event TokensRewarded(address indexed recipient, uint256 amount, string reason);
    event TokensPenalized(address indexed account, uint256 amount, string reason);
    event TokensStaked(address indexed account, uint256 amount);
    event TokensUnstaked(address indexed account, uint256 amount);
    
    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }
    
    constructor() ERC20("CivicXChain Token", "CIVIC") {
        // Mint initial supply to deployer
        _mint(msg.sender, 10000000 * 10**18); // 10 million initial tokens
        authorizedMinters[msg.sender] = true;
    }
    
    /**
     * @dev Add authorized minter (governance contract)
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    /**
     * @dev Remove authorized minter
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }
    
    /**
     * @dev Mint tokens as reward for fulfilled commitments
     */
    function rewardTokens(address recipient, uint256 amount, string memory reason) external onlyAuthorizedMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(recipient, amount);
        emit TokensRewarded(recipient, amount, reason);
    }
    
    /**
     * @dev Burn tokens as penalty for failed commitments
     */
    function penalizeTokens(address account, uint256 amount, string memory reason) external onlyAuthorizedMinter {
        require(balanceOf(account) >= amount, "Insufficient balance for penalty");
        _burn(account, amount);
        emit TokensPenalized(account, amount, reason);
    }
    
    /**
     * @dev Stake tokens for commitment
     */
    function stakeTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance to stake");
        _transfer(msg.sender, address(this), amount);
        stakedTokens[msg.sender] += amount;
        emit TokensStaked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens after commitment completion
     */
    function unstakeTokens(address account, uint256 amount) external onlyAuthorizedMinter {
        require(stakedTokens[account] >= amount, "Insufficient staked tokens");
        stakedTokens[account] -= amount;
        _transfer(address(this), account, amount);
        emit TokensUnstaked(account, amount);
    }
    
    /**
     * @dev Get staked token balance
     */
    function getStakedBalance(address account) external view returns (uint256) {
        return stakedTokens[account];
    }
    
    /**
     * @dev Emergency function to recover stuck tokens
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    /**
     * @dev Get reward amount for commitment type
     */
    function getRewardAmount(string memory commitmentType) external pure returns (uint256) {
        // Different reward amounts based on commitment type
        bytes32 typeHash = keccak256(abi.encodePacked(commitmentType));
        
        if (typeHash == keccak256(abi.encodePacked("PM25"))) {
            return REWARD_AMOUNT; // 1000 tokens
        } else if (typeHash == keccak256(abi.encodePacked("CO2"))) {
            return REWARD_AMOUNT * 2; // 2000 tokens (higher impact)
        } else if (typeHash == keccak256(abi.encodePacked("FOREST"))) {
            return REWARD_AMOUNT * 3; // 3000 tokens (highest impact)
        }
        
        return REWARD_AMOUNT; // Default reward
    }
    
    /**
     * @dev Get penalty amount for commitment type
     */
    function getPenaltyAmount(string memory commitmentType) external pure returns (uint256) {
        bytes32 typeHash = keccak256(abi.encodePacked(commitmentType));
        
        if (typeHash == keccak256(abi.encodePacked("PM25"))) {
            return PENALTY_AMOUNT; // 500 tokens
        } else if (typeHash == keccak256(abi.encodePacked("CO2"))) {
            return PENALTY_AMOUNT * 2; // 1000 tokens
        } else if (typeHash == keccak256(abi.encodePacked("FOREST"))) {
            return PENALTY_AMOUNT * 3; // 1500 tokens
        }
        
        return PENALTY_AMOUNT; // Default penalty
    }
}
