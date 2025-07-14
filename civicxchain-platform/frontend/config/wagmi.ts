import { createConfig, http } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define localhost chain configuration
const localhostChain = {
  ...localhost,
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
} as const;

export const config = createConfig({
  chains: [localhostChain],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [localhostChain.id]: http('http://127.0.0.1:8545'),
  },
});
