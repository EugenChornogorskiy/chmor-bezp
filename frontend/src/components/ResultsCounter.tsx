import { useEffect, useState } from 'react';
export function ResultsCounter( {pokemons, favChange, filters, favorite, hpRange,attackRange=[0,260],defenseRange=[0,260],speedRange=[0,260] }: any) { 
    const [pokemonsCount, setPokemonsCount] = useState(0);   
    useEffect(() => {
            filteredPokemons()
    },[filters, hpRange,attackRange,defenseRange,speedRange ,favChange])  
    const filteredPokemons = () => { 
            const count = pokemons.filter((p:any) => filters.types.every((ft:any) => p.types.some((pt:any) => pt.type.name === ft)) && filters.abilities.every((fa:any) => p.abilities.some((pa:any) => pa.ability.name === fa)) &&  p.name.includes(filters.search) )
            const pokstat = count.filter((p:any) => (p.stats[0].base_stat > hpRange[0] && p.stats[0].base_stat < hpRange[1]) && (p.stats[1].base_stat > attackRange[0] && p.stats[1].base_stat < attackRange[1]) &&
            (p.stats[2].base_stat > defenseRange[0] && p.stats[2].base_stat < defenseRange[1]) && (p.stats[3].base_stat > speedRange[0] && p.stats[3].base_stat < speedRange[1])) 
            const favCount = pokstat.filter((p:any) => favorite.includes(p.id))
            setPokemonsCount(favChange ? favCount.length : pokstat.length  ) 
    } 
    return (  
        <p id="pokemons-count">Pokemons: {pokemonsCount }</p>
    )
}