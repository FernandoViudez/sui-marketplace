import './Card.css'
import { useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';
import { getSUICoinForSpending } from '../_utils/query';

export function Card(props) {
    const wallet = useWallet();
    const [showBtns, setBtns] = useState(false);

    useEffect(() => {
        if (!wallet.connected) return;
        setBtns(true)
    }, [wallet.connected])

    function readUrl(url) {
        if (url.startsWith("ipfs://")) {
            const parts = url.split("://");
            parts.shift();
            return 'https://ipfs.io/ipfs/' + parts.join("://");
        }
        return url;
    }

    async function buyNft() {
        if (!wallet.connected) {
            return alert("Connect your wallet to buy this NFT");
        }
        console.warn("Buying nft process WIP ~> ", props.value);
        const coin = await getSUICoinForSpending(wallet.account.address, props.value.publication.price);
        const res = await wallet.executeMoveCall({
            arguments: [props.value.publication.id.id, props.value.id.id, coin],
            function: 'buy_nft',
            module: 'buy',
            packageObjectId: process.env.REACT_APP_PACKAGE_ID,
            typeArguments: [],
            gasBudget: 1000
        })
        alert(JSON.stringify(res.effects));
        window.location.reload();
    }

    async function sellNft() {
        const price = document.getElementById("price").value;
        if (!price || price <= 0) {
            return alert("Invalid price");
        }
        console.warn("Selling nft process WIP ~> ", props.value.id);
        const res = await wallet.executeMoveCall({
            arguments: [props.value.id.id, price],
            function: 'sell_nft',
            module: 'sell',
            packageObjectId: process.env.REACT_APP_PACKAGE_ID,
            typeArguments: [],
            gasBudget: 1000
        })
        alert(res.effects.status);
        window.location.reload();
    }

    return (

        <div className="col">
            <div className="card">
                <img src={readUrl(props.value.url)} className="card-img-top" alt='test' />
                <div className="card-body">
                    <h5 className="card-title">{props.value.name}</h5>
                    <p className="card-text">{props.value.description}</p>
                </div>
                {
                    showBtns && props.forSell ?
                        <div className='card-footer d-grid gap-2'>
                            <input className='form-control' id='price' placeholder='Price' type="number" />
                            <button onClick={sellNft} className='btn btn-danger'>Sell</button>
                        </div> :
                        <div className='card-footer d-grid gap-2'>
                            <button onClick={buyNft} className='btn btn-success'>Buy</button>
                        </div>
                }
            </div>
        </div>

    )
}