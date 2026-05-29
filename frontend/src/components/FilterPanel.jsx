'use client'  
import { SearchInput } from "../components/SearchInput"; 
import { TypeMultiSelect } from "../components/TypeMultiSelect";  
export function FilterPanel( {pokemons, setFilters, filters,favorite,addToast,setPage,cenfil }) {    

  return ( 
    <div id="search-filter">  
      {((filters.types.length + filters.abilities.length + filters.minHp + filters.maxHp + filters.search.length) != 260) ? <p id="filters" onClick={() =>  setFilters("add","showPanel",true)} >Filters {(filters.minHp == 0 && filters.maxHp == 260) ? filters.types.length + filters.abilities.length : filters.types.length + filters.abilities.length + 1}</p> :
      <p id="filters" onClick={() =>  setFilters("add","showPanel",true)} >Filters</p>}
       
        <SearchInput setFilters={setFilters}/> 
        {filters.showPanel && (
          <div id="filter-back">
            <TypeMultiSelect pokemons={pokemons} setFilters={setFilters} filters={filters} favorite={favorite} addToast={addToast} cenfil={cenfil}/>
          </div> 
        )} 
    </div> 
  )
}