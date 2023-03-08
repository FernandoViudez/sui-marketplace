import './App.css';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { List } from './components/list/List';
import { useEffect, useState } from 'react';
import { MintModal } from './components/mint/mint';
import { SellModal } from './components/sell/sell';
import { JsonRpcProvider, devnetConnection } from '@mysten/sui.js';

function App() {
  const [connected, setWalletConnected] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) return;
    setWalletConnected(true);
  }, [wallet.connected])

  async function getSUICoin() {
    const provider = new JsonRpcProvider(devnetConnection);
    try {
      await provider.requestSuiFromFaucet(
        wallet.account.address,
      );
      alert("DONE");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {connected ?
          (<div className='btns-wrapper'><button data-bs-toggle="modal" data-bs-target="#mintModal" className='btn btn-warning'>Mint</button>
            <button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#sellModal" >Sell</button>
            <button className='btn btn-primary' onClick={getSUICoin}>Request SUI coin</button></div>) : null}
        <ConnectButton>
          Connect wallet
        </ConnectButton>
      </header>
      <main className='App-main'>
        <List></List>
      </main>
      <MintModal></MintModal>
      <SellModal></SellModal>
    </div>
  );
}

export default App;
