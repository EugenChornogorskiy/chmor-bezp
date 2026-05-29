  
'use client'
import { useEffect, useState } from 'react';
export function ComparisonTable({ dane, setComparisionTable }: any) { 
  const [pok, setPok] = useState<any>( dane ); 
  useEffect(() => {
    if (pok.length == 0 ) {
      setComparisionTable()
    }
  },[pok])
  const total = (dane:any) => { return dane.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0); }
  const statsList = pok.map((p:any) => p.stats.map((s: any) => ({ [s.stat.name]: s.base_stat })) )
  const totalMax = pok.map((p:any) => p.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0)).reduce((acc:any,curr:any) => {
    return acc >= curr ? acc : curr
  },0)  
  const maxStats : any = { } 
  statsList.forEach( (curr:any) => {
    curr.forEach((obj: any) => {
      const [key, value]: any = Object.entries(obj)[0];
      if(!maxStats[key] || maxStats[key] < value){
        maxStats[key] = value
      } 
    });
  })
  const remove = (pokemon: any) => {
    setPok(pok.filter((p:any) => p != pokemon))
  } 
  const color = (stat: number, id: number) => {
    if (id == 1) {
      if (stat > 90) return "#4CAF50";
      if (stat <= 90 && stat >= 60) return "#FFEB3B";
      return "#F44336";
    } else {
      if (stat > 500) return "#4CAF50";
      if (stat <= 500 && stat >= 300) return "#FFEB3B";
      return "#F44336";
    }
  };

  return    (  
    <div id="window">
      {pok.map((pok: any) => {
        return (
          <div key={pok.name} className="pok-stats"> 
            <button onClick={() => remove(pok)} id="close-com">X</button>
            <div id="image"> 
              <img id = "poke_img" src= {pok.sprites.front_default} ></img>
              <img id = "poke_img" src= {pok.sprites.front_shiny} ></img> 
            </div>   
            <div id="information"><p id="name"> {pok.name}</p>  
                <p className="params">abilities: <span className="stat-value">{pok.abilities.map((a: any) => {
                  if(a.is_hidden){
                    return a.ability.name + " (hidden)"
                  }
                  else{
                    return a.ability.name
                  } }).join(", ") }</span></p>
                <p className="params">form: <span className="stat-value">{pok.forms.map((f: any) => f.name) } </span></p>
                <p className="params">height: <span className="stat-value">{pok.height} </span></p>
                <p className="params">stats:</p>
                <ul>
                  {pok.stats.map((p: any) => { 
                    return <li key={p.stat.name} id="list" style={{color: p.base_stat == maxStats[p.stat.name] ? `#17ac67` : `auto`}}>{p.stat.name} {Math.round((p.base_stat / maxStats[p.stat.name]) * 100)}% 
                      <div id="stats"  >
                        <div id="counter" style={{width: `${(p.base_stat / 150) * 100}%`,
                         background: color(p.base_stat,1) }}></div>
                      </div>
                    </li>  })}
                    <li id="list" style={{color: total(pok) == totalMax ? `#17ac67` : `auto`}}>total {Math.round((total(pok) / totalMax ) * 100)}%
                      <div id="stats" >
                        <div id="counter" style={{width: `${( total(pok) / 900) * 100}%`, background: color(total(pok),0) }}></div>
                      </div>
                    </li>
                </ul>  
                <p className="params">types: <span className="stat-value">{pok.types.map( ( t: any) => t.type.name).join(", ") }</span></p>
                <p className="params">weight: <span className="stat-value">{pok.weight} </span></p> 
              </div> 
          </div>)
        })} 
     </div> 
  );
}
