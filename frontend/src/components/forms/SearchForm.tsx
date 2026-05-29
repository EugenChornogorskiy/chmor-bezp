import { useEffect, useState } from 'react';
import { StatRangeFilter } from "../../components/StatRangeFilter";
import { FavoritesCheckbox } from "../../components/FavoritesCheckbox";
import { ResultsCounter } from "../../components/ResultsCounter"; 
export function SearchForm({ pokemons, setFilters,filters,favorite, addToast,cenfil,update,isSearchLoading,setShowPanel}: any) {
    const [showTypes, setShowTypes] = useState(false);
    const [showAbilities, setShowAbilities] = useState(false); 
    const [hpRange, setHpRange] = useState([filters.minHp,filters.maxHp]);   
    const [attackRange, setAttackRange] = useState([filters.minAttack,filters.maxAttack]);   
    const [defenseRange, setDefenseRange] = useState([filters.minDefense,filters.maxDefense]);   
    const [speedRange, setSpeedRange] = useState([filters.minSpeed,filters.maxSpeed]);  
    const [favChange, setFavChange] = useState(false);    
    const filterList = (mode:any) => {
        if (mode == "type") {   
            const pok = pokemons.filter((p:any) => filters.types.every((t:any) => p.types.map((pt:any) => pt.type.name).includes(t)) && filters.abilities.every((t:any) => p.abilities.map((pt:any) => pt.ability.name).includes(t)) )
            const pokstat = pok.filter((p:any) => (p.stats[0].base_stat > hpRange[0] && p.stats[0].base_stat < hpRange[1]) && (p.stats[1].base_stat > attackRange[0] && p.stats[1].base_stat < attackRange[1]) &&
            (p.stats[2].base_stat > defenseRange[0] && p.stats[2].base_stat < defenseRange[1]) && (p.stats[3].base_stat > speedRange[0] && p.stats[3].base_stat < speedRange[1]))
            const favPok = favChange ? pokstat.filter((p:any) => favorite.some((f:any) => p.id==f)) : pokstat
            const typesSet = new Set<string>();
            favPok.forEach((p:any) => p.types.forEach((t: any) => typesSet.add(t.type.name)));
            return Array.from(typesSet).filter(t => !filters.types.includes(t));
        }
        else {   
            const pok = pokemons.filter((p:any) => filters.abilities.every((a:any) => p.abilities.map((pt:any) => pt.ability.name).includes(a)) && filters.types.every((a:any) => p.types.map((pt:any) => pt.type.name).includes(a)) )
            const pokstat = pok.filter((p:any) => (p.stats[0].base_stat > hpRange[0] && p.stats[0].base_stat < hpRange[1]) && (p.stats[1].base_stat > attackRange[0] && p.stats[1].base_stat < attackRange[1]) &&
            (p.stats[2].base_stat > defenseRange[0] && p.stats[2].base_stat < defenseRange[1]) && (p.stats[3].base_stat > speedRange[0] && p.stats[3].base_stat < speedRange[1]))
            const favPok = favChange ? pokstat.filter((p:any) => favorite.some((f:any) => p.id==f)) : pokstat
            const absSet = new Set<string>();
            favPok.forEach((p:any) => p.abilities.forEach((a: any) => absSet.add(a.ability.name)));
            return Array.from(absSet).filter(a => !filters.abilities.includes(a));
        }  
    }  
     return (
        <div id="filter-panel">
              <ResultsCounter pokemons={pokemons} favChange={favChange} filters={filters} favorite={favorite} hpRange={hpRange} attackRange={attackRange} defenseRange={defenseRange} speedRange={speedRange}/>
              <p id="panel-filters">Filters</p>
              <div className='panel-filters'>
                <div className="filter-type">
                    <p>Filter by type: </p>
                        <div className="dropdown">
                            <button 
                                className="dropdown-btn"
                                onClick={() => setShowTypes(!showTypes)} >
                                Select type {showTypes ? "▴" : "▾"} 
                            </button>
                            {showTypes && (
                                <div className='dropdown-list'  >
                                    {filterList("type").map((p:any) => {
                                        return <p className="filter" onClick={() =>  setFilters("add","types",p) } key={p}>{p}</p>
                                    })}
                                </div>
                            )}
                        </div> 
                    
                </div>
                <div className='filters'>{filters.types.map((t:any) => {
                        return <p key={t} onClick={() => setFilters("remove","types",t ) }>{t}</p> 
                    } )}</div>
             </div>
             <div className='panel-filters'>
              <div className="filter-type">
                <p>Filter by ability: </p> 
                    <div className="dropdown">
                        <button 
                            className="dropdown-btn"
                            onClick={() => setShowAbilities(!showAbilities)} >
                            Select ability {showAbilities ? "▴" : "▾"} 
                        </button>
                        {showAbilities && (
                            <div className='dropdown-list'  >
                                {filterList("ability").map((p:any) => {
                                    return <p className="filter" onClick={() => setFilters("add","abilities",p) } key={p}>{p}</p>
                                })}
                            </div>
                        )}
                    </div>  
              </div>
                <div className='filters'>{filters.abilities.map((t:any) => {
                    return <p key={t} onClick={() => { setFilters("remove","abilities", t)}}>{t}</p> 
                } )}</div>
             </div> 
             <div className='panel-filters'>
                <div className='range-stat'>
                    <div className="filter-type-range">
                        <p>Filter by HP: </p> 
                        <StatRangeFilter hpRange ={hpRange} setHpRange={(value : any) => setHpRange(value)}/>
                    </div> 
                    <div className='filters-range'> 
                        <p >{hpRange[0]}</p> 
                        <p >{hpRange[1]}</p> 
                    </div>
                </div>
                <div className='range-stat'>
                    <div className="filter-type-range">
                        <p>Filter by Attack: </p> 
                        <StatRangeFilter hpRange ={attackRange} setHpRange={(value : any) => setAttackRange(value)}/>
                    </div>
                    <div className='filters-range'> 
                        <p >{attackRange[0]}</p> 
                        <p >{attackRange[1]}</p> 
                    </div>
                </div>
                <div className='range-stat'>
                    <div className="filter-type-range">
                        <p>Filter by Defense: </p> 
                        <StatRangeFilter hpRange ={defenseRange} setHpRange={(value : any) => setDefenseRange(value)}/>
                    </div>
                    <div className='filters-range'> 
                        <p >{defenseRange[0]}</p> 
                        <p >{defenseRange[1]}</p> 
                    </div> 
                </div>
                <div className='range-stat'>
                    <div className="filter-type-range">
                        <p>Filter by Speed: </p> 
                        <StatRangeFilter hpRange ={speedRange} setHpRange={(value : any) => setSpeedRange(value)}/>
                    </div>
                    <div className='filters-range'> 
                        <p >{speedRange[0]}</p> 
                        <p >{speedRange[1]}</p> 
                    </div> 
                </div>
            </div> 
             <FavoritesCheckbox setFavChange={() => setFavChange(!favChange)}/>
             <div id="filter_btns">
                <button className='filter_btn' onClick={async() => { 
                    // filters.filtered.length == 0 ? addToast("error","No pokemons for that filters") : addToast("success","You filtered pokemons") 
                    update({abilities:filters.abilities,maxAttack:attackRange[1],minAttack:attackRange[0],maxDefense:defenseRange[1],minDefense:defenseRange[0],maxSpeed:speedRange[0],minSpeed:speedRange[0],maxHp:hpRange[1],minHp:hpRange[0],search:filters.search, types:filters.types,sortBy:filters.sortBy}) 
                    setShowPanel(false)
                } } disabled={isSearchLoading}>  {isSearchLoading ? "Applying..." : "Apply filters"}</button>
                <button className='filter_btn'onClick={() => cenfil() } >Cencel filters</button>
             </div>
        </div>
    ) 
}