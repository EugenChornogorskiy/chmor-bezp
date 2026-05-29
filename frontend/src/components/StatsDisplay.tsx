'use client'
import { Link } from 'react-router-dom';
import { ToggleButton } from "../components/ToggleButton";
import {  useState,useEffect } from 'react';
import { RatingForm } from "../components/forms/RatingForm";
import { CommentsList } from "../components/CommentsList"; 
export function StatsDisplay({ dane,backId,requestCount,serverTime }: any) {
  const [ratingWindow, setRatingWindow] = useState<Boolean>(false); 
  const [ratingList, setRatingList] = useState<Boolean>(false); 
  const [ratings, setRatings] = useState<any[]>( []);
  const [loaded, setLoaded] = useState(false); 
  
  const total = dane.stats.reduce((acc: number, curr: any) => acc + curr.value, 0);

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
  useEffect(() => {
    const savedRatings = localStorage.getItem(`pokemon-ratings-${dane.name}`);
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    } else {
      setRatings([]); 
    }
    setLoaded(true);
  }, [dane.name]); 
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(`pokemon-ratings-${dane.name}`, JSON.stringify(ratings));
    }
  }, [ratings, dane.name, loaded]); 
  return    ( 
  <div id="backgr">
    <button id="rate-list-btn" onClick={() => setRatingList(true)}>Rate List</button>
    {ratingList && <CommentsList ratings={ratings} setRatingList={setRatingList}/>}
    <div id="stats-form"> 
      <div id="window-stats" style={{ width: ratingWindow ? "1000px" : "600px"}}>
        <div id="stats-place">
          <div id="stats-left">
            <div id="image-stats"> 
              <img id = "poke_img" src= {dane.sprite} ></img> 
              <p id="name"> {dane.name}</p> 
            </div> 
            <ToggleButton label="Stats" targetId="information"/> 
          </div> 
          <div id="information">  
              <p>Stats:</p>
              <ul>
                  {dane.stats.map((p: any) => {
                      return <li key={p.name} id="list">{p.name}: 
                          <div id="stats" >
                              <div id="counter" style={{width: `${(p.value / 150) * 100}%`, background: color(p.value,1) }}></div>
                          </div>
                      </li> 
                  })}
                  <li>Total: <div id="stats" >
                              <div id="counter" style={{width: `${( total / 900) * 100}%`, background: color(total,0) }}></div>
                          </div></li>
              </ul>  
              <p>Types: {dane.types.join(", ") }</p> 
              <p>BackEnd id = { backId }</p>
              <p>Server time = { serverTime }</p>
              <p>Request count = { requestCount }</p>
            </div>
        </div> 
        {ratingWindow && <RatingForm setRatings={setRatings} ratings={ratings}/>}
        <div style={{width: "200px"}}>
            <Link to={`/`}>
              <button id="close" >X</button>
            </Link>
             
        </div>
    </div>
      <div id="rating"> 
        <button id="rating-btn" onClick={() => setRatingWindow(!ratingWindow)}>{ratingWindow ? "<" : ">"}</button>
      </div>
    </div>
  </div>
  );
}
