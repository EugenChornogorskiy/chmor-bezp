"use client" 
import { PokemonCard } from "../components/PokemonCard";  
export function PokemonList({ pagePokemons, favorite, toggleFavorite , filters, setComparisonList ,comparisonList,page,addTeam,addToast  }: any) {    
  return ( 
      <div id="table">  
        {filters.filtered.length > 0 ? filters.filtered. slice(page*50 ,(page+1)*50).map( (p: any) => ( 
          <PokemonCard
          key={p.name}
          pokemon={p} 
          favorite = {favorite} 
          toggleFavorite = {toggleFavorite}
          setComparisonList ={setComparisonList}
          comparisonList ={comparisonList}
          addTeam={addTeam}
          addToast={addToast}/> 
        )): pagePokemons.map( (p: any) => ( 
          <PokemonCard
          key={p.name}
          pokemon={p} 
          favorite = {favorite} 
          toggleFavorite = {toggleFavorite}
          setComparisonList ={setComparisonList}
          comparisonList ={comparisonList}
          addTeam={addTeam}
          addToast={addToast}/> 
        ))} 
      </div> 
  );
} 