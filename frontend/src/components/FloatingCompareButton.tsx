'use client'   
export function FloatingCompareButton( { setComparisionTable,comparisonList,toastList,setToastList}: any) {    

  return (  
    <div id="compare">
        {<button id="compare-btn" onClick={comparisonList.length > 0 ? setComparisionTable : () => setToastList("nana pokemonyyyyyyyy")}>Compare Pokemons({comparisonList.length})</button>}
    </div>
  )
}