
import './App.css';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Modal } from "@web3modal/react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import Header from './components/header';
import Footer from './components/footer';
import HomePage from './components/HomePage';
import ProposalsTab from './components/proposals';

const chains = [chain.goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "f8db4053fa272753dc51d10ce33ae6ef" }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "DAO", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
      

    function App() {
      return (
        <div className='app'>
        <WagmiConfig client={wagmiClient}>
          <Router>
            <Header />
                <main>
                  <Route exact path="/">
                    <HomePage />
                  </Route>

                  <Route path="/proposals">
                    <ProposalsTab />
                  </Route>
                </main>
            <Footer />
          </Router>
        </WagmiConfig>

        <Web3Modal
          projectId="f8db4053fa272753dc51d10ce33ae6ef"
          ethereumClient={ethereumClient} />
    </div>
    )
}

export default App;
