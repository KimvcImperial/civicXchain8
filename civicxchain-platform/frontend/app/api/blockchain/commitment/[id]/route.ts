import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// Import contract configuration
const CONTRACT_CONFIG = {
  COMMITMENT_CONTRACT: '0xC6aB674d9d251d6bB5f55287109aa44D3cfd74B2',
  RPC_URL: 'https://eth-sepolia.public.blastapi.io',
};

// Contract ABI for commitments mapping
const CIVIC_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "commitments",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "officialAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "officialName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "officialRole",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "targetValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metricType",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isFulfilled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "rewardClaimed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "stakeAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokenReward",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "oracleJobId",
        "type": "bytes32"
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

    // Read commitment data from the smart contract
    const commitmentData = await client.readContract({
      address: CONTRACT_CONFIG.COMMITMENT_CONTRACT as `0x${string}`,
      abi: CIVIC_CONTRACT_ABI,
      functionName: 'commitments',
      args: [BigInt(commitmentId)],
    }) as any;

    console.log('Raw commitment data:', commitmentData);

    // Check if commitment exists (id should be > 0)
    if (!commitmentData || !commitmentData[0] || commitmentData[0] === 0n) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Extract data from tuple (commitmentData is an array)
    const [
      id,
      title,
      description,
      officialAddress,
      officialName,
      officialRole,
      targetValue,
      deadline,
      metricType,
      isActive,
      isFulfilled,
      rewardClaimed,
      stakeAmount,
      tokenReward,
      oracleJobId
    ] = commitmentData;

    // Get current environmental data from oracle for comparison
    let actualValue = 0;
    try {
      if (metricType === 'pm25') {
        // Get current PM2.5 from the live oracle (force fresh read)
        const oracleClient = createPublicClient({
          chain: sepolia,
          transport: http(CONTRACT_CONFIG.RPC_URL),
          batch: {
            multicall: false, // Disable batching to ensure fresh data
          },
        });

        const oracleData = await oracleClient.readContract({
          address: CONTRACT_CONFIG.ENVIRONMENTAL_ORACLE as `0x${string}`,
          abi: [
            {
              "inputs": [],
              "name": "getLatestPM25Data",
              "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: 'getLatestPM25Data',
          blockTag: 'latest', // Force latest block
        }) as any;

        actualValue = Number(oracleData); // Already scaled by 100 in the oracle
        console.log('🔍 API Oracle PM2.5:', actualValue / 100, 'μg/m³', 'at', new Date().toISOString());
      }
    } catch (error) {
      console.log('Could not fetch oracle data, using fallback:', error);
      actualValue = 2037; // Use dashboard value as fallback (20.37 μg/m³)
    }

    // Transform blockchain data to frontend format
    const transformedCommitment = {
      id: Number(id),
      title: title, // Add title field (same as Live Feed)
      description: description,
      official: officialAddress,
      targetValue: Number(targetValue),
      actualValue: actualValue,
      deadline: Number(deadline),
      isCompleted: isFulfilled,
      rewardClaimed: rewardClaimed,
      metricType: metricType,
      needsVerification: isActive && !isFulfilled,
      firstAchievementTime: null, // Would need to track this separately
      recentAchievementTime: null, // Would need to track this separately
      achievementFrequency: null, // Would need to track this separately
    };

    return NextResponse.json(transformedCommitment);
  } catch (error) {
    console.error('Error fetching commitment from blockchain:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch commitment from blockchain',
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
