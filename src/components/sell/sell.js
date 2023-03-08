import { useWallet } from '@suiet/wallet-kit';
import { useEffect, useState } from 'react';
import { Card } from '../card/Card';
import { fetchObjects, getNotPublishedObjects } from '../_utils/query';

export function SellModal() {

    let [objectsInSell, setObjects] = useState([]);

    const wallet = useWallet();

    useEffect(() => {
        if (!wallet.connected) return;
        getAnsSaveMyObjects(wallet.account.address).then(objs => {
            setObjects(objs);
        })
    }, [wallet.connected])

    async function getAnsSaveMyObjects() {
        const objs = await getNotPublishedObjects(wallet.account.address);
        return await fetchObjects(objs);
    }

    return (
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="sellModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sell your NFTs</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='w-100 row row-cols-1 row-cols-md-3 g-4 list-wrapper'>
                            {
                                objectsInSell.length > 0 ? objectsInSell.map(el => <Card forSell="true" value={el} key={el.id.id}></Card>) : <div>No objects to sell</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
