import Image from 'next/image'
import { ReactNode } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import useWalletBalance from 'hooks/useWalletBalance'

export default function Navbar() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const { walletBalance, walletAvailableBalance } = useWalletBalance()

  return (
    <>
  <nav className="navbar-youplay navbar navbar-default navbar-fixed-top">
    <div className="container">
      <div className="navbar-header">
        <a className="navbar-brand" href="index">
          <img src="assets/images/logo.png" style={{maxHeight: '60px !important'}} alt="" />
        </a>
      </div>
      <div id="navbar" className="navbar-collapse">
        <ul className="nav navbar-nav navbar-right">
          <li className=" dropdown dropdown-hover">
            {activeAddress != '' && activeAddress != null ? 
            <a href="#" role="button" data-toggle="modal" data-target="#inuModel"> Wallet Connected <span className="label">Inu Moo Balance: {walletBalance}</span> </a> 
            : <a href="#" role="button" data-toggle="modal" data-target="#inuModel"> Connect Wallet 
            <span className="label">Pera, Defly and Daffi Supported</span>
          </a> }
            
          </li>
        </ul>
      </div>
    </div>
  </nav>
    </>
  )
}
