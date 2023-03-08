import { JsonRpcProvider } from '@mysten/sui.js';

const provider = new JsonRpcProvider();

/**
 * Function: sell_nft 
 * Module: sell
 * From: my address
 * If sender is provided, then returns all objects in sell for the specific address ("sender")
 */
export const getObjectsInSell = async (sender) => {
    const nftsInSell = [];
    const txn = await provider.getTransactions({
        MoveFunction: {
            function: 'sell_nft',
            module: 'sell',
            package: process.env.REACT_APP_PACKAGE_ID
        },
    })
    const txns = txn.data;
    const res = await provider.getTransactionWithEffectsBatch(txns);
    for (let item of res) {
        for (let createdEl of item.effects.created) {
            const res = await provider.getObject(createdEl.reference.objectId);
            const { nft, publisher } = res.details["data"].fields;
            if (res.status === 'Exists') {
                if (sender) {
                    if (publisher === sender) {
                        nftsInSell.push({
                            publication: { ...res.details["data"].fields },
                            nft,
                        });
                    }
                } else if (publisher !== '0x0000000000000000000000000000000000000000') {
                    nftsInSell.push({
                        publication: { ...res.details["data"].fields },
                        nft,
                    });
                }
            }
        }
    }
    return nftsInSell;
}

/**
 * Get all of my created objects (published or not)
 */
export const getMyObjects = async (sender) => {
    const myObjects = [];
    const txns = await provider.getTransactions({
        // FromAddress: sender,
        MoveFunction: {
            function: 'create_nft',
            module: 'mint',
            package: process.env.REACT_APP_PACKAGE_ID
        },
    })
    for (let txn of txns.data) {
        const res = await provider.getTransactionWithEffects(txn);
        // TODO: think efficient way of requesting this information
        for (let createdItem of res.effects.created) {
            const createdObjectId = createdItem.reference.objectId;
            const nft = await provider.getObject(createdObjectId);
            if (nft.details.data.fields.owner === sender) {
                myObjects.push(createdObjectId);
            }
        }
    }
    return myObjects;
}

/**
 * Get the difference between these two arrays. 
 */
export const getNotPublishedObjects = async (sender) => {
    const objectsInSell = await getObjectsInSell(sender);
    const allMyObjects = await getMyObjects(sender);
    objectsInSell.forEach(inSell => {
        const idx = allMyObjects.findIndex((gen) => gen === inSell.nft)
        allMyObjects.splice(idx, 1);
    })
    return allMyObjects;
}

export const getSUICoinForSpending = async (sender, balanceRequired) => {
    const coins = await provider.getCoins(sender, process.env.REACT_APP_SUI_COIN_TYPE);
    let totalBalance = 0;
    for (let coin of coins.data) {
        if (coin.balance >= balanceRequired) {
            return coin.coinObjectId;
        } else {
            totalBalance += coin.balance;
        }
    }

    if (totalBalance >= balanceRequired) {
        throw new Error("Not enough balance. Join all your SUI coins and try again");
    } else {
        throw new Error("Not enough balance");
    }
}

export const fetchObjects = async (objs) => {
    const objsMetadata = [];
    for (let obj of objs) {
        const objMetadata = await provider.getObject(obj.nft ? obj.nft : obj);
        objsMetadata.push({
            publication: obj.publication,
            ...objMetadata.details.data.fields
        });
    }
    return objsMetadata;
}