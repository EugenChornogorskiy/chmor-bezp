'use client'   
export function ActiveFiltersCount( {filters }:any) {    

  return (  
    <>
      {((filters.types.length + filters.abilities.length + filters.minHp + filters.maxHp + filters.search.length) != 260) && (
        <p className="filters-count" >
           {(filters.minHp == 0 && filters.maxHp == 260) ? filters.types.length + filters.abilities.length : filters.types.length + filters.abilities.length + 1}
        </p>
      )}
    </>
  )
}