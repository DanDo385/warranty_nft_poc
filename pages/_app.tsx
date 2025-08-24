import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { WagmiConfig } from 'wagmi';
import { config } from '@/lib/wagmi';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
