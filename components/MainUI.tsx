import { useWallet } from '@txnlab/use-wallet'
import useWalletBalance from 'hooks/useWalletBalance'
import { useState } from 'react'
import algosdk from 'algosdk'
import algodClient from 'lib/algodClient'
import toast from 'react-hot-toast'

let productDetails = '',
  playerOwnedLandName = '',
  title = '',
  mainContentSection: JSX.Element,
  playerInventory: JSX.Element,
  gameitem1: JSX.Element,
  gameitem2: JSX.Element
let gamestate: string
let sectionOpen = 'LandPurchase'
let marketplaceButtonClasses = 'btn btn-success width-93'
let playerFarmButtonClasses = 'btn btn-success mt-10 width-93'
let landPurchaseButtonClasses = 'btn btn-primary active'
let seedStallButtonClasses = 'btn btn-primary'
let inuMooAmount = ''
const TUTORIAL_STATE = 'Tutorial'
const MAIN_MENU_STATE = 'MainMenu'
const NEW_PLAYER_STATE = 'NewPlayer'
const MARKET_PLACE_STATE = 'Marketplace'
const FARM_FIELD_STATE = 'FarmField'
let selectedPatch = ''
let patch1Status = 'Empty'
let patch2Status = 'Empty'
let patch3Status = 'Empty'
let patch4Status = 'Empty'
let patch1Details : JSX.Element
let patch2Details : JSX.Element
let patch3Details : JSX.Element
let patch4Details : JSX.Element

// FOR DEMO ONLY
let playerOwnedItems: string[] = []
let playerOwnsLand = false

function setGameState(state: string) {
  gamestate = state
}

function MainUI({
  state,
  updateStoryState
}: {
  state: any
  updateStoryState: (newState: string) => void
}) {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const { walletAvailableBalance } = useWalletBalance()
  const handleAmountAndProductChange = (amountChange: string, product: string) => {
    productDetails = product
    const amount = amountChange
    // matches integers or floats up to 6 decimal places
    const regExp = /^\d+(?:\.\d{0,6})?$/gm
    if (amount !== '' && amount.match(regExp) === null) {
      return
    }
    inuMooAmount = amount
  }
  if (!gamestate && state && state['state']) {
    setGameState(state['state'])
    updateStoryState(state['state'])
  }

  for (let i = 0; i < playerOwnedItems.length; i++) {
    if (playerOwnedItems[i].startsWith('Plot#')) {
      playerOwnsLand = true
    }
  }

  const sendTransaction = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet not connected')
      }

      const params = await algodClient.getTransactionParams().do()
      params.fee = 1000
      params.flatFee = true
      const sender = activeAddress
      //  Ledger device (InuMooRewards.algo) - securely holds Inu Moo and redistributes back to the game ecosystem adding to LP / Burn Incentive Reserve / In-Game Rewards Reserve.
      const recipient = 'KEYBVAFOHNAIAUOKHLZ7UHCXAYBBWOA52NKCQML7D7MKQMXS2YJ5YIBD54'
      const amount = inuMooAmount === '' ? 0 : parseFloat(inuMooAmount)
      const revocationTarget = undefined
      const closeRemainderTo = undefined
      const assetID = 507472097
      const note = undefined
      const transaction = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetID,
        params
      )

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Waiting for user to sign...', { id: 'txn', duration: Infinity })

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      console.log(`Successfully sent transaction. Transaction ID: ${id}`)

      toast.success('Transaction successful!', {
        id: 'txn',
        duration: 5000
      })

      // HERE WRITE TO DB - ASSET OBJECT.
      // FOR DEMO ONLY:
      playerOwnedItems.push(productDetails)
      if (productDetails.startsWith('Plot#')) {
        playerOwnedLandName = productDetails
      }
      console.log(playerOwnedItems)
    } catch (error) {
      console.error(error)
      toast.error('Transaction failed', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendTransaction()
  }

  function hasSufficientBalance(amountCheck: string) {
    const sendAmount = amountCheck === '' ? 0 : parseFloat(amountCheck)
    const availableBalance = parseFloat(walletAvailableBalance || '0')
    const txnCost = sendAmount + 1000
    return !(availableBalance >= txnCost)
  }

  function goTo(location: string | any) {
    sectionOpen = location
    if (location == 'LandPurchase') {
      landPurchaseButtonClasses = 'btn btn-primary active'
      seedStallButtonClasses = 'btn btn-primary'
    }
    if (location == 'SeedStall') {
      landPurchaseButtonClasses = 'btn btn-primary'
      seedStallButtonClasses = 'btn btn-primary active'
    }
  }

  function handlePlantSeed() {
    console.log(selectedPatch)
    if (selectedPatch == 'Patch-1') {
      patch1Status = 'Planted'
      patch1Details = <div><div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style={{width: '90%', height: '16px'}}></div><br /></div>
    }
    else if (selectedPatch == 'Patch-2') {
      patch2Status = 'Planted'
      patch2Details = <div><div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style={{width: '90%', height: '16px'}}></div><br /></div>
    }
    else if (selectedPatch == 'Patch-3') {
      patch3Status = 'Planted'
      patch3Details = <div><div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style={{width: '90%', height: '16px'}}></div><br /></div>
    }
    else if (selectedPatch == 'Patch-4') {
      patch4Status = 'Planted'
      patch4Details = <div><div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style={{width: '90%', height: '16px'}}></div><br /></div>
    }
  }

  let playerInventoryItems = []
  for (let i = 0; i < playerOwnedItems.length; i++) {
    if (!playerOwnedItems[i].startsWith('Plot#')) {
      playerInventoryItems.push(
        <div onClick={handlePlantSeed} data-toggle="modal" className="inu-player-inventory-item-l">
          <img
            width="100%"
            alt=""
            src="assets/images/Products/product-potato-seed-zoom.png"
            className="inu-inventory-product-image center-image"
          />
          {playerOwnedItems[i]}
        </div>
      )
    }
  }

  playerInventory = <div>{playerInventoryItems}</div>

  if (sectionOpen == 'LandPurchase') {
    const gameitem1Disable = hasSufficientBalance('500.00')
    gameitem1 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/Products/product-small-land.png"
          className="inu-product-image center-image"
        />
        <div className="pr-20 pl-20 pb-20">
          <h3>Serenity Grove: A Petite Homestead in Rural Japan</h3>
          <p>
            Serenity Grove: A cozy Japanese homestead in a tranquil village, offering simplicity and
            charm amidst lush landscapes. Embrace the essence of rural living in this compact
            retreat.
          </p>
          <div className="requirements-block mb-20">
            <h4>
              <strong>Land Purchase Features</strong>
            </h4>
            <div>
              <strong>Starting Farmland for Newer Players:</strong> This farmland comprises three
              plots, accommodating the cultivation of crops up to a proficiency level of 20 in
              farming skill. While ideal for planting various crops, note that it does not support
              the cultivation of herbs and trees. Perfect for those embarking on their journey as
              novice farmers.
            </div>
            <div>
              <strong>Ownership:</strong> You will possess exclusive ownership of this plot as an
              NFT (Non-Fungible Token). Ownership of the NFT grants access to the land. However,
              resale of the NFT will result in the forfeiture of any produced crops. There is only 1
              of this plot.
            </div>
          </div>
          Cost: <span className="label label-info">5 ₥</span>
        </div>
        <form
          onClick={() => handleAmountAndProductChange('5.00', 'Plot#01')}
          onSubmit={handleSubmit}
        >
          <button
            disabled={gameitem1Disable || playerOwnsLand}
            type="submit"
            className="btn btn-success inu-purchase-button"
          >
            {playerOwnsLand ? 'Farm Land Already Owned' : 'Purchase Plot #1'}
          </button>
        </form>
      </div>
    )
    const gameitem2Disable = hasSufficientBalance('1000000.00')
    gameitem2 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/Products/product-large-land.png"
          className="inu-product-image center-image"
        />
        <div className="pr-20 pl-20 pb-20">
          <h3>Bountiful Haven: Expansive Farmland in Idyllic Japanese Village</h3>
          <p>
            Bountiful Haven unfolds as a vast expanse of farmland in a serene Japanese village.
            Stretching across rolling landscapes, this generous plot invites you into a realm of
            agricultural abundance and natural beauty. Embrace the spacious tranquility of rural
            living in the heart of Japan.
          </p>
          <div className="requirements-block mb-20">
            <h4>
              <strong>Land Purchase Features</strong>
            </h4>
            <div>
              <strong>Abundant Cultivation Space:</strong> You will have access to a total of 15
              versatile land plots, suitable for cultivating a wide array of crops.
            </div>
            <div>
              <strong>Enhanced Soil: Progressive Agricultural Terrain:</strong> All land plots will
              accommodate produce from any farming level, eliminating restrictions for high skilled
              farmers and ensuring versatility in cultivation.
            </div>
            <div>
              <strong>Investment Potential:</strong> The spaciousness and location make this
              farmland an attractive investment, with potential for future developments or increased
              property value.
            </div>
            <div>
              <strong>Ownership:</strong> You will possess exclusive ownership of this plot as an
              NFT (Non-Fungible Token). Ownership of the NFT grants access to the land. However,
              resale of the NFT will result in the forfeiture of any produced crops.
            </div>
          </div>
          Cost: <span className="label label-info">1,000,000 ₥</span>
        </div>
        <form
          onClick={() => handleAmountAndProductChange('1000000.00', 'Plot#02')}
          onSubmit={handleSubmit}
        >
          <button
            disabled={gameitem2Disable || playerOwnsLand}
            type="submit"
            className="btn btn-success inu-purchase-button"
          >
            {playerOwnsLand ? 'Farm Land Already Owned' : 'Purchase Plot #2'}
          </button>
        </form>
      </div>
    )
  }

  if (sectionOpen == 'SeedStall') {
    const gameitem1Disable = hasSufficientBalance('100.00')
    gameitem1 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/Products/product-potato-seed.png"
          className="inu-product-image center-image"
        />
        <div className="pr-20 pl-20 pb-20">
          <h3>Potato Seeds (100x)</h3>
          <p>
            Unlock the potential of your virtual farmland with these magical potato seeds! Plant,
            cultivate, and watch as these extraordinary spuds grow into a bountiful harvest. These
            seeds hold the promise of crispy fries, creamy mashed potatoes, and savory dishes that
            will leave your virtual community craving for more. Get ready to sow the seeds of
            greatness in your farm and elevate your farming game to a whole new level with the
            enchanting journey of potato cultivation!
          </p>
          Cost: <span className="label label-info">100 ₥</span>
        </div>
        <form
          onClick={() => handleAmountAndProductChange('100.00', 'Potato Seeds')}
          onSubmit={handleSubmit}
        >
          <button
            disabled={gameitem1Disable || !playerOwnsLand}
            type="submit"
            className="btn btn-success inu-purchase-button"
          >
            {!playerOwnsLand ? "You don't own land" : 'Purchase 100 Potato Seeds'}
          </button>
        </form>
      </div>
    )
    const gameitem2Disable = hasSufficientBalance('140.00')
    gameitem2 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/Products/product-rice-seed.png"
          className="inu-product-image center-image"
        />
        <div className="pr-20 pl-20 pb-20">
          <h3>Rice Seeds (100x)</h3>
          <p>
            Embark on a lush journey with our premium rice seeds! Immerse yourself in the art of
            paddy cultivation as you sow these magical grains. Watch as your virtual fields
            transform into serene rice terraces, reflecting the beauty of your farming prowess. From
            sushi to risotto, these seeds unlock a world of culinary possibilities, making your
            harvest the talk of the virtual town. Plant, grow, and reap the rewards as you become
            the rice maestro in your own pixelated paradise!
          </p>
          Cost: <span className="label label-info">140 ₥</span>
        </div>
        <form
          onClick={() => handleAmountAndProductChange('140.00', 'Seeds#Rice#01')}
          onSubmit={handleSubmit}
        >
          <button
           // disabled={gameitem2Disable || !playerOwnsLand}
            disabled={true}
            type="submit"
            className="btn btn-success inu-purchase-button"
          >
            {!playerOwnsLand ? "You don't own land" : 'Purchase 100 Rice Seeds'}
          </button>
        </form>
      </div>
    )
  }

  if (gamestate == MAIN_MENU_STATE || gamestate == NEW_PLAYER_STATE) {
    title = 'メインメニュー Main Menu'
    mainContentSection = <div></div>
    marketplaceButtonClasses = 'btn btn-success width-93'
    playerFarmButtonClasses = 'btn btn-success mt-10 width-93'
  } else if (gamestate == MARKET_PLACE_STATE) {
    title = 'さくらマーケットプレイス Sakura Marketplace : Where Land and Commerce Unite'
    mainContentSection = (
      <div>
        <div className="inu-content-player-funds-container mb-20">
          You have <span className="label label-primary">{walletAvailableBalance} ₥</span>
        </div>
        <div className="inu-content-stall-summary-container">
          <button onClick={() => goTo('LandPurchase')} className={landPurchaseButtonClasses}>
            Land Purchase
          </button>
          <button disabled={true} className="btn btn-primary">
            Land Rental
          </button>
          <button
            disabled={!playerOwnsLand}
            onClick={() => goTo('SeedStall')}
            className={seedStallButtonClasses}
          >
            Seed Stall
          </button>
        </div>

        <div className="inu-content-stall-items-container">
          <div className="inu-content-stall-item-l">{gameitem1}</div>
          <div className="inu-content-stall-item-r">{gameitem2}</div>
        </div>
      </div>
    )
    marketplaceButtonClasses = 'btn btn-success width-93 active'
    playerFarmButtonClasses = 'btn btn-success mt-10 width-93'
  } else if (gamestate == FARM_FIELD_STATE) {
    let patch01 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/small-farm-space.png"
          className="inu-product-image center-image inu-no-bottom-margin"
        />
        {patch1Details}
        <div className="pr-20 pl-20 pb-20">
          <h3>Patch #1</h3>
          Status: <span className="label label-info">{patch1Status}</span>
        </div>
          <button data-toggle="modal" data-target="#inuModelInventory" onClick={() => selectedPatch='Patch-1'} className="btn btn-info width-93">Plant Seed</button>
      </div>
    )
    let patch02 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/small-farm-space.png"
          className="inu-product-image center-image inu-no-bottom-margin"
        />
        {patch2Details}
        <div className="pr-20 pl-20 pb-20">
          <h3>Patch #2</h3>
          Status: <span className="label label-info">{patch2Status}</span>
        </div>
          <button data-toggle="modal" data-target="#inuModelInventory" onClick={() => selectedPatch='Patch-2'} className="btn btn-info width-93">Plant Seed</button>
      </div>
    )
    let patch03 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/small-farm-space.png"
          className="inu-product-image center-image inu-no-bottom-margin"
        />
        {patch3Details}
        <div className="pr-20 pl-20 pb-20">
          <h3>Patch #3</h3>
          Status: <span className="label label-info">{patch3Status}</span>
        </div>
          <button data-toggle="modal" data-target="#inuModelInventory" onClick={() => selectedPatch='Patch-3'} className="btn btn-info width-93">Plant Seed</button>
      </div>
    )
    let patch04 = (
      <div>
        <img
          width="100%"
          alt=""
          src="assets/images/small-farm-space.png"
          className="inu-product-image center-image inu-no-bottom-margin"
        />
        {patch4Details}
        <div className="pr-20 pl-20 pb-20">
          <h3>Patch #4</h3>
          Status: <span className="label label-info">{patch4Status}</span>
        </div>
          <button data-toggle="modal" data-target="#inuModelInventory" onClick={() => selectedPatch='Patch-4'} className="btn btn-info width-93">Plant Seed</button>
      </div>
    )
    title = 'プレイヤーファーム Player Farm: ' + playerOwnedLandName
    mainContentSection = (
      <div>
        <div className="inu-content-player-funds-container mb-20">
          You have <span className="label label-primary">{walletAvailableBalance} ₥</span>
        </div>

        <div className="inu-content-stall-summary-container">
          <div>
            <h3>Farming Skill</h3>
            <p>Level<span className="label label-info">1</span></p>
            <p>XP<span className="label label-info">23 XP</span></p>
          </div>
        </div>

        <div className="inu-content-stall-items-container">
          <div className="inu-content-stall-item-l">{patch01}</div>
          <div className="inu-content-stall-item-r">{patch02}</div>
          <div className="inu-content-stall-item-l">{patch03}</div>
          <div className="inu-content-stall-item-r">{patch04}</div>
        </div>
      </div>
    )
    marketplaceButtonClasses = 'btn btn-success width-93'
    playerFarmButtonClasses = 'btn btn-success mt-10 width-93 active'
  }
  return (
    <>
      <div className="container">
      <div
          className="modal fade"
          id="inuModelInventory"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="inuModelInventoryLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog inu-modal">
            <div className="modal-content inu-modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title" id="inuModelInventoryLabel">
                  Inventory
                </h4>
              </div>
              <div className="modal-body">
                {playerInventory}
              </div>
            </div>
          </div>
        </div>
        <div className="row width-100">
          <div className="col-md-9 col-md-push-3 pr-20">
            <div className="inu-title-section">
              <h2 className="inu-h2-header">{title}</h2>
            </div>
            <div className="inu-content-section">{mainContentSection}</div>
          </div>

          <div className="col-md-3 col-md-pull-9">
            <div className="side-block">
              <h4 className="block-title">Areas of Interest</h4>
              <ul className="block-content inu-force-no-padding">
                <li>
                  <button
                    onClick={() => {
                      setGameState(MARKET_PLACE_STATE)
                      updateStoryState(MARKET_PLACE_STATE)
                    }}
                    className={marketplaceButtonClasses}
                  >
                    Markertplace
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setGameState(FARM_FIELD_STATE)
                      updateStoryState(FARM_FIELD_STATE)
                    }}
                    disabled={!playerOwnsLand}
                    className={playerFarmButtonClasses}
                  >
                    Player Farm
                  </button>
                </li>
              </ul>
            </div>
            <div className="side-block">
              <h4 className="block-title">Player Skills</h4>
              <ul className="block-content inu-force-no-padding">
                <li>
                  <button disabled={true} className="btn btn-success width-93">
                    Farming
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MainUI
