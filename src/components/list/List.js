import './List.css'
import { Card } from '../card/Card';
import { fetchObjects, getObjectsInSell } from '../_utils/query';
import { useEffect, useState } from 'react';

export function List() {

    const [nft, setNfts] = useState([]);

    useEffect(() => {
        getObjects().then(objs => {
            setNfts(objs);
        });
    }, [])

    async function getObjects() {
        const objsReference = await getObjectsInSell();
        const metadata = await fetchObjects(objsReference);
        return metadata;
    }

    return (
        <div className='w-100 row row-cols-1 row-cols-md-3 g-4 list-wrapper'>
            {
                nft.map(el => <Card value={el} key={el.id.id}></Card>)
            }
        </div>
    )
}