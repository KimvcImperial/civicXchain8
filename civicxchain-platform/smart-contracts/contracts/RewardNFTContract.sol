// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFTContract is ERC721, ERC721URIStorage, Ownable {
    
    // Replace Counters with simple uint256
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => uint256) public tokenToCommitment;
    mapping(uint256 => bool) public commitmentRewardClaimed;
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 indexed commitmentId,
        string tokenURI
    );
    
    constructor() ERC721("EcoChain Reward NFT", "ECNFT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    function mintRewardNFT(
        address _recipient,
        uint256 _commitmentId,
        string memory _tokenURI
    ) external onlyOwner returns (uint256) {
        require(!commitmentRewardClaimed[_commitmentId], "Reward already claimed for this commitment");
        
        // Increment counter manually
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(_recipient, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        tokenToCommitment[newTokenId] = _commitmentId;
        commitmentRewardClaimed[_commitmentId] = true;
        
        emit NFTMinted(newTokenId, _recipient, _commitmentId, _tokenURI);
        
        return newTokenId;
    }
    
    function getTokenCommitment(uint256 _tokenId) external view returns (uint256) {
        require(_ownerOf(_tokenId) != address(0), "Token does not exist");
        return tokenToCommitment[_tokenId];
    }
    
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function isCommitmentRewarded(uint256 _commitmentId) external view returns (bool) {
        return commitmentRewardClaimed[_commitmentId];
    }
    
    // Override required by Solidity for multiple inheritance
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}