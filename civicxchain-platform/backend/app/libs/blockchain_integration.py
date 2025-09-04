from web3 import Web3
from eth_account import Account
from hexbytes import HexBytes
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Any
import databutton as db
import requests
from dataclasses import dataclass
from enum import Enum

class CommitmentStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    FULFILLED = "fulfilled"
    FAILED = "failed"
    DISPUTED = "disputed"

class NetworkType(Enum):
    MAINNET = "mainnet"
    SEPOLIA = "sepolia"
    POLYGON = "polygon"
    POLYGON_MUMBAI = "polygon_mumbai"

@dataclass
class BlockchainConfig:
    network: NetworkType
    rpc_url: str
    chain_id: int
    contract_address: str
    private_key: Optional[str] = None

class SmartContractManager:
    def __init__(self, config: Optional[BlockchainConfig] = None):
        """Initialize blockchain connection with real Web3 provider"""
        if config is None:
            config = self._get_default_config()
        
        self.config = config
        self.w3 = Web3(Web3.HTTPProvider(config.rpc_url))
        
        # Verify connection
        if not self.w3.is_connected():
            raise ConnectionError(f"Failed to connect to blockchain network: {config.network.value}")
        
        # Load contract ABI and create contract instance
        self.contract_abi = self._load_contract_abi()
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(config.contract_address),
            abi=self.contract_abi
        )
        
        # Initialize account if private key provided
        self.account = None
        if config.private_key:
            self.account = Account.from_key(config.private_key)
    
    def _get_default_config(self) -> BlockchainConfig:
        """Get default blockchain configuration from secrets"""
        # Try to get from secrets, fallback to Sepolia testnet
        rpc_url = db.secrets.get("BLOCKCHAIN_RPC_URL") or "https://sepolia.infura.io/v3/demo"
        contract_address = db.secrets.get("SMART_CONTRACT_ADDRESS") or "0x0000000000000000000000000000000000000000"
        private_key = db.secrets.get("PRIVATE_KEY")
        
        return BlockchainConfig(
            network=NetworkType.SEPOLIA,
            rpc_url=rpc_url,
            chain_id=11155111,  # Sepolia chain ID
            contract_address=contract_address,
            private_key=private_key
        )
    
    def _load_contract_abi(self) -> List[Dict]:
        """Load smart contract ABI"""
        # This would normally be loaded from a file or deployment artifacts
        # For now, return a basic ERC20-like ABI with governance functions
        return [
            {
                "inputs": [
                    {"internalType": "string", "name": "commitmentId", "type": "string"},
                    {"internalType": "address", "name": "official", "type": "address"},
                    {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
                    {"internalType": "uint256", "name": "deadline", "type": "uint256"},
                    {"internalType": "string", "name": "commitmentType", "type": "string"}
                ],
                "name": "createCommitment",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "string", "name": "commitmentId", "type": "string"},
                    {"internalType": "uint256", "name": "currentValue", "type": "uint256"},
                    {"internalType": "bool", "name": "targetMet", "type": "bool"}
                ],
                "name": "validateCommitment",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "address", "name": "official", "type": "address"},
                    {"internalType": "uint256", "name": "amount", "type": "uint256"}
                ],
                "name": "distributeReward",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "string", "name": "commitmentId", "type": "string"}],
                "name": "getCommitment",
                "outputs": [
                    {"internalType": "address", "name": "official", "type": "address"},
                    {"internalType": "uint256", "name": "targetValue", "type": "uint256"},
                    {"internalType": "uint256", "name": "currentValue", "type": "uint256"},
                    {"internalType": "uint256", "name": "deadline", "type": "uint256"},
                    {"internalType": "uint8", "name": "status", "type": "uint8"},
                    {"internalType": "string", "name": "commitmentType", "type": "string"}
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    
    async def create_commitment_on_chain(
        self, 
        commitment_id: str, 
        official_address: str, 
        target_value: int, 
        deadline_timestamp: int, 
        commitment_type: str
    ) -> Dict[str, Any]:
        """Create a new commitment on the blockchain"""
        try:
            if not self.account:
                raise ValueError("Private key required for transaction signing")
            
            # Build transaction
            function = self.contract.functions.createCommitment(
                commitment_id,
                Web3.to_checksum_address(official_address),
                target_value,
                deadline_timestamp,
                commitment_type
            )
            
            # Estimate gas
            gas_estimate = function.estimate_gas({'from': self.account.address})
            
            # Build transaction
            transaction = function.build_transaction({
                'from': self.account.address,
                'gas': gas_estimate,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.config.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "success": True,
                "transaction_hash": receipt.transactionHash.hex(),
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "commitment_id": commitment_id,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "commitment_id": commitment_id,
                "timestamp": datetime.now().isoformat()
            }
    
    async def validate_commitment_on_chain(
        self, 
        commitment_id: str, 
        current_value: int, 
        target_met: bool
    ) -> Dict[str, Any]:
        """Validate a commitment on the blockchain with oracle data"""
        try:
            if not self.account:
                raise ValueError("Private key required for transaction signing")
            
            # Build validation transaction
            function = self.contract.functions.validateCommitment(
                commitment_id,
                current_value,
                target_met
            )
            
            # Estimate gas
            gas_estimate = function.estimate_gas({'from': self.account.address})
            
            # Build transaction
            transaction = function.build_transaction({
                'from': self.account.address,
                'gas': gas_estimate,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address)
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.config.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "success": True,
                "transaction_hash": receipt.transactionHash.hex(),
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "target_met": target_met,
                "current_value": current_value,
                "validation_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "commitment_id": commitment_id,
                "validation_timestamp": datetime.now().isoformat()
            }
    
    async def get_commitment_from_chain(self, commitment_id: str) -> Dict[str, Any]:
        """Retrieve commitment data from blockchain"""
        try:
            # Call the smart contract function
            result = self.contract.functions.getCommitment(commitment_id).call()
            
            official_address, target_value, current_value, deadline, status, commitment_type = result
            
            return {
                "success": True,
                "commitment_id": commitment_id,
                "official_address": official_address,
                "target_value": target_value,
                "current_value": current_value,
                "deadline": deadline,
                "status": CommitmentStatus(status).value if status < len(CommitmentStatus) else "unknown",
                "commitment_type": commitment_type,
                "retrieved_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "commitment_id": commitment_id,
                "retrieved_at": datetime.now().isoformat()
            }
    
    async def distribute_reward(
        self, 
        official_address: str, 
        reward_amount_wei: int
    ) -> Dict[str, Any]:
        """Distribute reward tokens/ETH to officials who met their commitments"""
        try:
            if not self.account:
                raise ValueError("Private key required for transaction signing")
            
            # Build reward distribution transaction
            function = self.contract.functions.distributeReward(
                Web3.to_checksum_address(official_address),
                reward_amount_wei
            )
            
            # Estimate gas
            gas_estimate = function.estimate_gas({
                'from': self.account.address,
                'value': reward_amount_wei
            })
            
            # Build transaction
            transaction = function.build_transaction({
                'from': self.account.address,
                'gas': gas_estimate,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'value': reward_amount_wei
            })
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.config.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "success": True,
                "transaction_hash": receipt.transactionHash.hex(),
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
                "recipient": official_address,
                "reward_amount_wei": reward_amount_wei,
                "reward_amount_eth": Web3.from_wei(reward_amount_wei, 'ether'),
                "distributed_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "recipient": official_address,
                "distributed_at": datetime.now().isoformat()
            }
    
    def check_commitment_fulfillment(
        self, 
        commitment_data: Dict[str, Any], 
        environmental_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Advanced commitment fulfillment checker with multiple environmental metrics"""
        commitment_type = commitment_data.get("type", "")
        target_value = commitment_data.get("target_value", 0)
        
        # Initialize validation result
        validation_result = {
            "target_met": False,
            "confidence_score": 0.0,
            "validation_timestamp": datetime.now().isoformat(),
            "metrics_analyzed": [],
            "current_value": 0,
            "target_value": target_value,
            "commitment_type": commitment_type
        }
        
        try:
            if commitment_type == "forest_protection":
                current_cover = environmental_data.get("forest_cover_percentage", 0)
                deforestation_rate = environmental_data.get("deforestation_rate", 0)
                
                # Forest protection considers both coverage and deforestation rate
                coverage_met = current_cover >= target_value
                deforestation_acceptable = deforestation_rate <= 0.02  # 2% acceptable rate
                
                validation_result.update({
                    "target_met": coverage_met and deforestation_acceptable,
                    "current_value": current_cover,
                    "confidence_score": 0.9 if (coverage_met and deforestation_acceptable) else 0.3,
                    "metrics_analyzed": ["forest_cover_percentage", "deforestation_rate"],
                    "additional_metrics": {
                        "deforestation_rate": deforestation_rate,
                        "coverage_target_met": coverage_met,
                        "deforestation_acceptable": deforestation_acceptable
                    }
                })
                
            elif commitment_type == "air_quality":
                pm25_level = environmental_data.get("pm25_level", 999)
                aqi_score = environmental_data.get("aqi_score", 999)
                
                # Air quality considers both PM2.5 and overall AQI
                pm25_target_met = pm25_level <= target_value
                aqi_acceptable = aqi_score <= 100  # Good to moderate AQI
                
                validation_result.update({
                    "target_met": pm25_target_met and aqi_acceptable,
                    "current_value": pm25_level,
                    "confidence_score": 0.85 if (pm25_target_met and aqi_acceptable) else 0.4,
                    "metrics_analyzed": ["pm25_level", "aqi_score"],
                    "additional_metrics": {
                        "aqi_score": aqi_score,
                        "pm25_target_met": pm25_target_met,
                        "aqi_acceptable": aqi_acceptable
                    }
                })
                
            elif commitment_type == "water_quality":
                water_quality_index = environmental_data.get("water_quality_index", 0)
                contamination_level = environmental_data.get("contamination_level", 100)
                
                # Water quality improvement target
                quality_target_met = water_quality_index >= target_value
                contamination_acceptable = contamination_level <= 20  # 20% contamination threshold
                
                validation_result.update({
                    "target_met": quality_target_met and contamination_acceptable,
                    "current_value": water_quality_index,
                    "confidence_score": 0.88 if (quality_target_met and contamination_acceptable) else 0.35,
                    "metrics_analyzed": ["water_quality_index", "contamination_level"],
                    "additional_metrics": {
                        "contamination_level": contamination_level,
                        "quality_target_met": quality_target_met,
                        "contamination_acceptable": contamination_acceptable
                    }
                })
                
            elif commitment_type == "renewable_energy":
                renewable_percentage = environmental_data.get("renewable_energy_percentage", 0)
                energy_efficiency = environmental_data.get("energy_efficiency_score", 0)
                
                # Renewable energy adoption target
                renewable_target_met = renewable_percentage >= target_value
                efficiency_acceptable = energy_efficiency >= 70  # 70% efficiency threshold
                
                validation_result.update({
                    "target_met": renewable_target_met and efficiency_acceptable,
                    "current_value": renewable_percentage,
                    "confidence_score": 0.92 if (renewable_target_met and efficiency_acceptable) else 0.25,
                    "metrics_analyzed": ["renewable_energy_percentage", "energy_efficiency_score"],
                    "additional_metrics": {
                        "energy_efficiency_score": energy_efficiency,
                        "renewable_target_met": renewable_target_met,
                        "efficiency_acceptable": efficiency_acceptable
                    }
                })
                
            else:
                # Generic commitment type
                current_value = environmental_data.get("value", 0)
                target_met = current_value >= target_value if target_value > 0 else current_value <= abs(target_value)
                
                validation_result.update({
                    "target_met": target_met,
                    "current_value": current_value,
                    "confidence_score": 0.7 if target_met else 0.3,
                    "metrics_analyzed": ["generic_value"]
                })
                
        except Exception as e:
            validation_result.update({
                "error": str(e),
                "confidence_score": 0.0
            })
        
        return validation_result
    
    def get_account_balance(self, address: Optional[str] = None) -> Dict[str, Any]:
        """Get ETH balance for an address"""
        try:
            check_address = address or self.account.address if self.account else None
            if not check_address:
                raise ValueError("No address provided and no account configured")
            
            balance_wei = self.w3.eth.get_balance(Web3.to_checksum_address(check_address))
            balance_eth = Web3.from_wei(balance_wei, 'ether')
            
            return {
                "success": True,
                "address": check_address,
                "balance_wei": balance_wei,
                "balance_eth": float(balance_eth),
                "network": self.config.network.value,
                "checked_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "checked_at": datetime.now().isoformat()
            }
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information"""
        try:
            latest_block = self.w3.eth.get_block('latest')
            
            return {
                "success": True,
                "network": self.config.network.value,
                "chain_id": self.w3.eth.chain_id,
                "latest_block_number": latest_block.number,
                "latest_block_timestamp": latest_block.timestamp,
                "gas_price_wei": self.w3.eth.gas_price,
                "gas_price_gwei": Web3.from_wei(self.w3.eth.gas_price, 'gwei'),
                "is_connected": self.w3.is_connected(),
                "contract_address": self.config.contract_address
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Utility functions for common blockchain operations
def create_ethereum_address() -> Dict[str, str]:
    """Generate a new Ethereum address and private key"""
    account = Account.create()
    return {
        "address": account.address,
        "private_key": account.key.hex(),
        "created_at": datetime.now().isoformat()
    }

def validate_ethereum_address(address: str) -> bool:
    """Validate if a string is a valid Ethereum address"""
    try:
        Web3.to_checksum_address(address)
        return True
    except Exception:
        return False

def wei_to_eth(wei_amount: int) -> float:
    """Convert Wei to ETH"""
    return float(Web3.from_wei(wei_amount, 'ether'))

def eth_to_wei(eth_amount: float) -> int:
    """Convert ETH to Wei"""
    return Web3.to_wei(eth_amount, 'ether')

# Initialize singleton instance
_smart_contract_manager = None

def get_smart_contract_manager(config: Optional[BlockchainConfig] = None) -> SmartContractManager:
    """Get singleton instance of SmartContractManager"""
    global _smart_contract_manager
    if _smart_contract_manager is None or config is not None:
        _smart_contract_manager = SmartContractManager(config)
    return _smart_contract_manager