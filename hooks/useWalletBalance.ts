import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import algodClient from 'lib/algodClient'

export default function useWalletBalance() {
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [walletAvailableBalance, setWalletAvailableBalance] = useState<string | null>(null)

  const { activeAccount } = useWallet()

  const getAccountInfo = async () => {
    if (!activeAccount) throw new Error('No selected account.')
    const accountInfo = await algodClient.accountAssetInformation(activeAccount.address, 507472097).do()
    return accountInfo["asset-holding"]
  }

  const { data: accountInfo } = useQuery(['amount', activeAccount?.address], getAccountInfo, {
    enabled: !!activeAccount?.address,
    refetchInterval: 30000
  })

  useEffect(() => {
    if (
      accountInfo &&
      accountInfo.amount !== undefined
    ) {
      const balance = accountInfo.amount
      const availableBalance = accountInfo.amount;

      if (balance !== walletBalance) {
        setWalletBalance(balance)
        return
      }

      if (parseFloat(availableBalance) < 0) {
        setWalletAvailableBalance('0.000000')
        return
      }

      if (availableBalance !== walletAvailableBalance) {
        setWalletAvailableBalance(availableBalance)
        return
      }
    } else {
      setWalletBalance('0.000000')
      setWalletAvailableBalance('0.000000')
    }
  }, [accountInfo, walletBalance, walletAvailableBalance])

  return {
    walletBalance,
    walletAvailableBalance
  }
}
