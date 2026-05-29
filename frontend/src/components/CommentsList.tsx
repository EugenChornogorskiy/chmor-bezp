'use client'   
export function CommentsList( {ratings,setRatingList} :any) {    

  return ( 
    <div id="backgr-rate">
        <div id="rate-list">
            <button id="close-fix" onClick={() => setRatingList(false)}>X</button> 
          
          {ratings.length > 0 && ratings.map((r:any) => {
              return (
                <div key={r.title} id="rate">
                  <div className="group-rate">
                    <p>{r.title}</p>
                    <p>{r.rating}</p>
                  </div> 
                  <div className="group-rate">
                    <p>{r.comment}</p>
                  </div>
                  <div className="group-rate">
                    <p>{r.email}</p>
                    <p>{r.nickname}</p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
  )
}