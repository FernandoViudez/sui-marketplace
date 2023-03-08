import { useWallet } from '@suiet/wallet-kit';
import { useState } from 'react';

export function MintModal() {
    const wallet = useWallet();


    let [imagePreview, setImagePreview] = useState('');
    // eslint-disable-next-line no-unused-vars
    let [image, setImage] = useState('');
    // eslint-disable-next-line no-unused-vars
    let [name, setName] = useState('');
    // eslint-disable-next-line no-unused-vars
    let [description, setDescription] = useState('');

    function formatImageUrl() {
        let value = document.getElementById("image")?.value;
        if (value && value.startsWith("ipfs://")) {
            const parts = value.split("://");
            parts.shift();
            setImagePreview('https://ipfs.io/ipfs/' + parts.join("://"))
            return;
        }
        setImagePreview(value);
    }

    function processInputChange(e) {
        switch (e.target.id) {
            case 'name': {
                setName(e.target.value);
                break;
            }
            case 'description': {
                setDescription(e.target.value);
                break;
            }
            case 'image': {
                formatImageUrl();
                setImage(e.target.value);
                break;
            }
            default: {
                return;
            }
        }

    }

    async function mint() {
        await wallet.executeMoveCall({
            arguments: [name, description, image],
            function: 'create_nft',
            module: 'mint',
            packageObjectId: process.env.REACT_APP_PACKAGE_ID,
            typeArguments: [],
            gasBudget: 10000
        });
        window.location.reload();
    }

    return (
        <div className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="mintModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Mint your NFTs</h1>
                        <button id='close-mint' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row w-100 m-0">
                            <div className="col-12">
                                <input onChange={processInputChange} id="name" placeholder="Name*" className="form-control m-1" type="text" />
                            </div>
                            <div className="col-12">
                                <input onChange={processInputChange} id="description" placeholder="Description*" className="form-control m-1" type="text" />
                            </div>
                            <div className="col-12">
                                <input id="image" onChange={processInputChange} placeholder="Picture URL" className="form-control m-1" type="text" />
                            </div>
                        </div>
                        <div className="mt-5">
                            <h5>Preview</h5>
                            <hr />
                            {
                                imagePreview && imagePreview !== '' ? <img src={imagePreview} width="100%" alt="nft" /> : null
                            }

                            <h5 className='mt-2' align="left"><b>{name}</b></h5>
                            <p align="left">{description}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={mint}>Mint</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
