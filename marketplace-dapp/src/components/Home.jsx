import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import WalletBalance from './WalletBalance';
import UnsatiableGuy from '../artifacts/contracts/UTG.sol/UnsatiableGuy.json';


import { Container, Card, Grid, Spacer, Image, Button, Text} from "@nextui-org/react";

const contractAddress = '0x92F5405A6c1395D79111bF4369Cd2a2F2BD3ad3F';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user (execute transactions)
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, UnsatiableGuy.abi, signer);

const Home = () => {

    const [totalMinted, setTotalMinted] = useState(0);

    useEffect(() => {
        getCount();
    }, []);


    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    };

    return (
        <Container>
            <Spacer y={1} />
            <WalletBalance />
            <Spacer y={2} />
            <Card bordered shadow={false} justify="center">
                <Text h1 style={{textAlign: "center"}}>Unsatiable Guys NFT Collection</Text>
                <div className="container">
                    <div className="row">
                        {
                            Array(totalMinted + 1)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} className="col-sm">
                                        <NFTImage tokenId={i} getCount={getCount} />
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </Card>
        </Container>
    );
}

function NFTImage({ tokenId, getCount }) {
    const contentId = "QmPr1xJmWAjFwP5iXoFcnbrARmLLXbNAWBKYizykhXAQP3";
    // const metadataURI = `${contentId}/${tokenId}.json`;
    // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const metadataURI = `img/${tokenId}.json`;
    const imageURI = `img/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        setIsMinted(result);
    };


    const mintToken = async () => {

        // making connection between the contract and the signer
        const connection = contract.connect(signer);

        // getting access to the recipient wallet address
        const addr = connection.address;

        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
        getCount();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
    }

    return (
        <Card bordered>
            <img width={200} height={200}  src={isMinted ? imageURI : 'img/placeholder.png'} />
            <div>
                <Text h5>ID #{tokenId}</Text>
                {!isMinted ? (
                    <Button onClick={mintToken}>
                        Mint
                    </Button>
                ) : (
                    <Button onClick={getURI}>
                        Taken! Show URI
                    </Button>
                )}
            </div>
        </Card>
    )

}

export default Home;