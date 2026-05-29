   
export function Toast( { dane, removeToast, id,type}: any) {    

  return (  
    <div style={{backgroundColor: type=="success" ? "rgba(51, 255, 0, 0.918)":type=="warning" ? "rgba(255, 238, 0, 0.92)" :type=="info" ? "rgba(0, 225, 255, 0.92)" : "rgba(255, 0, 0, 0.92)"}}className="toast-div">
        <p onClick={() => removeToast(id)} className="close-toast">X</p>
        <p className="toast">{dane}</p>
    </div>
  )
}