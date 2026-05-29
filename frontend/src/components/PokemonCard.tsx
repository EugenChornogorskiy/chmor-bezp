import { Link } from 'react-router-dom';
import { ToggleFavorites } from "../components/ToggleFavorites";
import { CompareCheckbox } from "../components/CompareCheckbox"; 
export function PokemonCard({pokemon,favorite,toggleFavorite,setComparisonList,comparisonList,addTeam,addToast }: any) {
  return ( 
    <div className="pokemon">
      <Link key={pokemon.name} to={`/stats/${pokemon.name}`}>
        <div className="pok-card">
          <button className="img_btn"  >
            <img src={pokemon.sprite} alt={pokemon.name} />
          </button> 
          <p className="tab_name">{pokemon.name}</p>
        </div> 
      </Link> 
    </div> 
  );
}
     