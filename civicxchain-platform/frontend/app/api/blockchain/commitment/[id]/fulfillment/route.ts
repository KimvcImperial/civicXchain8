import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// Import contract configuration
const CONTRACT_CONFIG = {
  COMMITMENT_CONTRACT: '0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2',
  RPC_URL: 'https://eth-sepolia.public.blastapi.io',
};

// Contract ABI for checkFulfillment function
const CIVIC_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_commitmentId",
        "type": "uint256"
      }
    ],
    "name": "checkFulfillment",
    "outputs": [
      {
        "internalType": "bool",
        "name": "fulfilled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "currentValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "targetValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commitmentId = params.id;
    
    // Create a public client to read from the blockchain
    const client = createPublicClient({
      chain: sepolia,
      transport: http(CONTRACT_CONFIG.RPC_URL),
    });

    // Check fulfillment status from the smart contract - USE GOVERNANCE_CONTRACT
    const fulfillmentData = await client.readContract({
      address: CONTRACT_CONFIG.GOVERNANCE_CONTRACT as `0x${string}`,
      abi: CIVIC_CONTRACT_ABI,
      functionName: 'checkFulfillment',
      args: [BigInt(commitmentId)],
    }) as any;

    console.log('Fulfillment data:', fulfillmentData);

    // Extract data from tuple
    const [fulfilled, currentValue, targetValue] = fulfillmentData;

    return NextResponse.json({
      fulfilled: fulfilled,
      currentValue: Number(currentValue),
      targetValue: Number(targetValue),
      commitmentId: Number(commitmentId)
    });
  } catch (error) {
    console.error('Error checking fulfillment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check fulfillment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
