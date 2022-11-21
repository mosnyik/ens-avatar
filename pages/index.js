import Head from 'next/head';
import { useState, useRef, useEffect} from 'react';
import styles from '../styles/Home.module.css';
import { providers } from 'ethers';
import Web3Modal from 'web3modal';


export default function Home() {
  // check and track if the user's wallet is connected or not
  const [walletConnected, setWalletConnected]= useState(false);
  // keep track of the currently connected wallet
  const [address, setAddress] = useState('');
  // store the ENS
  const [ens, setENS] = useState('');
  // keep reference of web3modalref
  const web3ModalRef = useRef();


  const setENSOrAddress = async (address, web3Provider) => {
    // lookup the ENS is associated with the connected address
    var _ens = await web3Provider.lookupAddress(address);
    // if there is an ENS, set it, otherwise, set the address
    if(_ens){
      setENS(_ens);
    }else{
      setAddress(address);
    }
  };

// function to fetch the Provider or Signer of the connected wallet

const getProviderOrSigner = async () => {
  // access the web3modal reference
  const provider = await web3ModalRef.current.connect();
  // access the underlying object of the web3modal object
  const web3Provider = new providers.Web3Provider(provider);

  // check if the user is connected to the Goerli network otherwise throw an error
  const { chainId } = await web3Provider.getNetwork();

  if( chainId !== 5 ){
    window.alert('Change network to Goerli');
    throw new Error('Change network to Goerli');
  }
const signer = web3Provider.getSigner();

// get address associated with the signer
const address = await signer.getAddress();
// set the ENS 
setENSOrAddress(address, web3Provider);
return signer; 

}

const connectWallet = async()=>{
  try{
    // get the web3modal ie metamask
    // prompt the user to connect if the user is connecting for the first time
    await getProviderOrSigner(true);
    setWalletConnected(true)
  }catch(err){
console.error(err);
  }
};

// return a button depending on the state of the dapp
const renderButton=()=>{
  if(walletConnected){
    <div>Wallet connected </div>
  }else{
    return <button className={styles.button} onClick={connectWallet}>Connect your wallet</button>
  }
}
useEffect(
  ()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal(
        {
          network: 'goerli',
          providerOptions: {},
          disableInjectedProvider: false,
        });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Mosnyik ENS dApp</title>
        <meta name= 'description' content='mosnyik-ENS-dApp' />
        <link rel='icon' href='/favicon.ico'/>
      </Head>
      <div className={styles.main}>
        <div >
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens: address } !
          </h1>
          <div className={styles.description}>
            It is an NFT collection for LearnWeb3 Punks - .
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src = './learnweb3punks.png'/>
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by mosnyik
      </footer>
    </div>
  );
}
