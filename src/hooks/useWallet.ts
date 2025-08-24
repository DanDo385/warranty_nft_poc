import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const connectWallet = () => {
    connect({ connector: new MetaMaskConnector() });
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    address,
    isConnected,
    isConnecting,
    chainId: chain?.id,
    error,
    connectWallet,
    disconnectWallet,
  };
}
