/* eslint-disable @next/next/no-sync-scripts */
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import Head from 'components/Head'
import Connect from 'components/Connect'
import Navbar from 'components/Navbar'
import Illustration from 'components/Illustration'
import MainUI from 'components/MainUI'
import Image from 'next/image'

let toggleflag = false;

export default function Home() {
  const TUTORIAL_STATE = 'Tutorial'
  const MAIN_MENU_STATE = 'MainMenu'
  const NEW_PLAYER_STATE = 'NewPlayer'
  const MARKET_PLACE_STATE = 'Marketplace'
  const FARM_FIELD_STATE = 'FarmField'
  const { activeAddress,  } = useWallet()
  const [sequenceNumber, setSequenceNumber] = useState(0)
  const [storyState, setStoryState] = useState('')
  const [playerData,setPlayerData] = useState([]);
  const [characterName,setCharacterName] = useState('');
  
  let userRecordFound = false;
  
  const updateStoryState = (newState: string) => {
    setSequenceNumber(0)
    setStoryState(newState);
  };

  /*const db = require('public/assets/js/db.js')*/
  const getData=()=>{
    fetch('data/user.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(json) {
        setPlayerData(json)
      });
  }
  useEffect(()=>{
    getData()
  },[])

  getData()
  let sequence = [{ storyKey: 0, imageKey: 0 }]

  if (activeAddress) {
    userRecordFound = playerData.find(o => o['WalletAddress'] === activeAddress) == null ? false : true;
  }

  function incrementSequence(num: number) {
    setSequenceNumber(sequenceNumber + num)
  }

  function populateStoryState(value : string) {
    toggleflag = false;
    setStoryState(value)
    setSequenceNumber(0);
  }

   function createCharacter() {
    if (storyState == TUTORIAL_STATE) {
      /*fs.writeFileSync('public/data/user.json', {
        "Username": characterName,
        "WalletAddress": activeAddress,
        "CharacterType": null,
        "DateCreated": new Date()
      });*/
      populateStoryState(NEW_PLAYER_STATE)
    }
  }
  function validateInput() {
    return (characterName.length > 5 && characterName.length < 30 && !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(characterName))
  }

  const tutorialSequence = [
    { storyKey: 0, imageKey: 0 },
    { storyKey: 1, imageKey: 0 },
    { storyKey: 2, imageKey: 0 },
    { storyKey: 3, imageKey: 1 },
    { storyKey: 4, imageKey: 1 },
    { storyKey: 5, imageKey: 1 },
    { storyKey: 6, imageKey: 2 }
  ]

  const newPlayerSequence = [
    { storyKey: 8, imageKey: 3 },
    { storyKey: 9, imageKey: 3 }
  ]

  const mainMenuSequence = [
    { storyKey: 10, imageKey: 3 }
  ]

  const marketplaceSequence = [
    { storyKey: 10, imageKey: 0 }
  ]

  const farmfieldSequence = [
    { storyKey: 11, imageKey: 2 }
  ]

  const imgs = [
    '/assets/images/marketplace-hd.png',
    '/assets/images/village-hd.png',
    '/assets/images/tending-to-crops-hd.png',
    '/assets/images/village-2-hd.png'
  ]

  const story = [
    'Welcome New Player!',
    'This is, Sakura Marketplace: a tapestry of colors, aromas, and community.',
    'You can buy and sell in-game assets here.',
    'A fresh start...',
    'Haru no Sato, the "Village of Spring".',
    'War-torn farmer finds hope in a spring village, rebuilding and growing.',
    "Cultivating Resilience: A Farmer's Journey to Self-Reconstruction",
    "What's the name, partner?",
    "Welcome " + characterName + "!",
    "Glad to have you onboard, let's go and purchase some land and seeds at the marketplace.",
    "Welcome to Sakura Marketplace.",
    characterName + "\'s farm."
  ]

  // Check for existing user:
  /*
  RESERVED FOR LIVE. FOR NOW, USING LOCAL JSON.
  db.query("SELECT * FROM User", (err: any,result: any)=>{
    if(err) {
    console.log(err)
    } 
console.log(result);
  })*/
  if (!userRecordFound && !storyState) {
    populateStoryState(TUTORIAL_STATE)
  }
  else if (!storyState) {
    populateStoryState(MAIN_MENU_STATE)
  }

  if (storyState == TUTORIAL_STATE) {
    sequence = tutorialSequence
  }
  if (storyState == MAIN_MENU_STATE) {
    if (sequenceNumber != 0 && !toggleflag)
    setSequenceNumber(0);
    sequence = mainMenuSequence;
    toggleflag = true;
  }
  else if (storyState == NEW_PLAYER_STATE) {
    if (sequenceNumber != 0 && !toggleflag)
    setSequenceNumber(0);
    sequence = newPlayerSequence;
    toggleflag = true;
  }
  else if (storyState == MARKET_PLACE_STATE) {
    if (sequenceNumber != 0 && !toggleflag)
    setSequenceNumber(0);
    sequence = marketplaceSequence;
    toggleflag = true;
  }
  else if (storyState == FARM_FIELD_STATE) {
    if (sequenceNumber != 0 && !toggleflag)
    setSequenceNumber(0);
    sequence = farmfieldSequence;
    toggleflag = true;
  }

  let mainController;
  if (sequence.length - 1 > sequenceNumber) {
    mainController = <button
      onClick={() => {
        incrementSequence(+1);
      }}
      className="btn"
    >
      Next
    </button>;
    }
    else if ((storyState != TUTORIAL_STATE) && sequence.length - 1 <= sequenceNumber) {
      mainController = <MainUI state={storyState} updateStoryState={updateStoryState}/>
    }
    else if (storyState == TUTORIAL_STATE && sequence.length - 1 <= sequenceNumber) {
      mainController =
    <div>
      <div className="youplay-input inu-input-container inu-margin-top-bottom-m">
        <input
          type="text"
          className="inu-text-large inu-input"
          name="CharacterName"
          placeholder="Character Name"
          onChange={e => 
            setCharacterName(e.target.value)}
          autoFocus
        />
      </div> 
      {validateInput() ? <button onClick={() => createCharacter()} className="btn btn-success active"> Create Character </button> : <button disabled={true}  className="btn "> Create Character </button>}
      
    </div>
   }
  return (
    <>
      <div>
        <Head />
        <div
          className="modal fade"
          id="inuModel"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="inuModelLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog inu-modal">
            <div className="modal-content inu-modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title" id="inuModelLabel">
                  {activeAddress != '' && activeAddress != null
                    ? 'Connection Details'
                    : 'Connect to wallet'}
                </h4>
              </div>
              <div className="modal-body">
                <Connect />
              </div>
            </div>
          </div>
        </div>
        {/* /Modal */}
        <Navbar />
        <div className="content-wrap">
          <section className="youplay-banner banner-top youplay-banner-parallax full">
            <div className="image" data-speed="0.4">
              <img src="assets/images/high-res-open-gates.png" alt="" className="jarallax-img inu-centre-background" />
            </div>
            <div className="info">
              <div>
                <div className="container">
                  {activeAddress != '' && activeAddress != null ? (
                    <div className="game-container">
                      <div>
                        <section className="inu-inner-container">
                          {
                            userRecordFound ? <a></a> :
                            
                            <Illustration
                              imgkey={sequence[sequenceNumber].imageKey}
                              storykey={sequence[sequenceNumber].storyKey}
                              imgs={imgs}
                              story={story}
                            />
                          }
                          {mainController}
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div>
                    <Image
                        height={300}
                        width={300}
                        className="center-image"
                        style={{marginTop: '20px !important'}}
                        alt=""
                        src="/assets/images/icon.png"
                      />
                    <div className="game-container">
                      
                      <h4 className="p-40 mt-40" role="button" data-toggle="modal" data-target="#inuModel">
                        ウォレットを接続する Harmonize your wallet with the game, and the path to
                        play shall unfold
                      </h4>
                    </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* /Banner */}
          {/* Footer */}
          <footer className="youplay-footer youplay-footer-parallax">
            <div className="wrapper">
              {/* Copyright */}
              <div className="copyright">
                <div className="container">
                  <p>© 2023 Inu Moo. All rights reserved.</p>
                </div>
              </div>
              {/* /Copyright */}
            </div>
          </footer>
          {/* /Footer */}
        </div>
      </div>

      <script src="assets/vendor/object-fit-images/dist/ofi.min.js"></script>
      <script src="assets/vendor/jquery/dist/jquery.min.js"></script>
      <script src="assets/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
      <script src="assets/vendor/magnific-popup/dist/jquery.magnific-popup.min.js"></script>
      <script src="assets/js/youplay.min.js"></script>
      <script src="assets/js/youplay-init.js"></script>
      <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>
    </>
  )
}
