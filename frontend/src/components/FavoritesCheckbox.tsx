   
export function FavoritesCheckbox( { setFavChange }: any) {    

  return (  
    <div className='panel-filters'>
        <div className="filter-type">
            Only Favorites<input type="checkbox" onChange={ setFavChange }/> 
        </div>
    </div>
  )
}