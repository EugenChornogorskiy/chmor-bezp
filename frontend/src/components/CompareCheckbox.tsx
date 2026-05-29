'use client'

export function CompareCheckbox({ setComparisonList,comparisonList,id }: any) {   
  return ( 
      <button id="toggle-comparision" onClick={() => setComparisonList(id) } > 
        {comparisonList.includes(id) ? '-' : '+' } 
      </button>  
  )
}