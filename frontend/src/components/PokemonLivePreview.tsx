export function PokemonLivePreview({ values, image }: any) {
  return ( 
        <div id="rating-form">
            <p id="rating-pokemon">Rating pokemon</p>
            <div id="image-stats">  
              <img src= {image} id="image-prewiev" ></img> 
              <p id="name"> {values.name}</p>   
          </div> 
          <div id="information">    
              <p>Stats:</p>
              <ul> 
                <li id="list">❤️ Hp: {values.hp}  </li>  
                <li id="list">⚔️ Attack: {values.attack}  </li>   
                <li id="list">🛡️ Defense: {values.defense}  </li>  
                <li id="list">🏃 Speed: {values.speed}  </li> 
              </ul>  
              <p>Type: {values.type }</p>
              <p>Second type: {values.second_type }</p> 
            </div> 
        </div> 
  );
}