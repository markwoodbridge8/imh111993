function Illustration({imgkey, storykey, imgs, story} : {imgkey:any, storykey:any, imgs:any, story:any}) {

  
  return (
    <>
      <img
        width="100%"
        alt=""
        src={imgs[imgkey]}
        className="inu-image"
      />
      <div><h3 className="mb-60 overlay-text">{story[storykey]}</h3></div>
    </>
  )
}
export default Illustration;
