import '../styles/globals.css'
import { WagmiConfig, createClient } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { getDefaultProvider } from 'ethers'
import { chain } from 'wagmi'
import { AppProps } from 'next/app'


const provider = getDefaultProvider(chain.goerli.id)

const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({
      chains: [chain.goerli],
      options: {
        shimDisconnect: true,
      },
    }),
  ],
  provider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={client}>
    <Component {...pageProps} />
  </WagmiConfig>
}

export default MyApp
