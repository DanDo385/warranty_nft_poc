import { createConfig, configureChains } from 'wagmi';
import { mainnet, localhost } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { http, createPublicClient } from 'viem';

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localhost, mainnet], // localhost first for local development
  [
    publicProvider(),
  ]
);

// Set up wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
});

// Export chains for use in components
export { chains };
