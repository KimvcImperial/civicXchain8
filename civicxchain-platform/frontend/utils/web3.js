import { ethers } from 'ethers';
import { CONTRACT_CONFIG, CIVIC_CONTRACT_ABI } from '../config/contracts';

export class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async connect() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.CIVIC_CONTRACT,
        CIVIC_CONTRACT_ABI,
        this.signer
      );
      return true;
    }
    return false;
  }

  async createCommitment(description, deadline, target, metricType, dataSource) {
    if (!this.contract) throw new Error('Contract not connected');
    
    const tx = await this.contract.createCommitment(
      description,
      deadline,
      target,
      metricType,
      dataSource
    );
    return await tx.wait();
  }

  async getCommitment(id) {
    if (!this.contract) throw new Error('Contract not connected');
    return await this.contract.getCommitment(id);
  }
}