'use client'

export function ToggleFavorites({ favorite = [], toggleFavorite,id }: any) {   
  return ( 
      <button id="toggle-favorites" onClick={() => toggleFavorite(id) } > 
        {favorite.includes(id) ? '⭐' : '☆' } 
      </button>  
  )
}