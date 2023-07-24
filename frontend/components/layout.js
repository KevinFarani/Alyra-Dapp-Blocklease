import Footer from "./footer";
import { useRouter } from "next/router";
import Header01 from "./header/Header01";
import '@rainbow-me/rainbowkit/styles.css';
// Rainbowkit
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [ goerli, hardhat ],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: '214dbc581c3406040963d84b9c665ca3',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

export default function Layout({ children }) {
  const route = useRouter();

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Header01 />
          <main>{children}</main>
          <Footer />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
