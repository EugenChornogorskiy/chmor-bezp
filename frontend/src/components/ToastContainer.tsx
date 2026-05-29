 
import { useEffect, useState,useRef } from 'react';
import ReactDOM from "react-dom"; 
import { Toast } from "../components/Toast";
export function ToastContainer( { dane, removeToast } : any) {  
    const toastRoot = typeof window !== "undefined" ? document.getElementById("toast-root") : null; 
    const timersRef = useRef(new Map()) 

    useEffect(() => {
        const now = Date.now()

        dane.forEach((toast:any) => {
            const elapsed = now - toast.id

            if (elapsed >= 3000) {
                removeToast(toast.id)
            } else {
                const remaining = 3000 - elapsed
                const timer = setTimeout(() => removeToast(toast.id), remaining)
                timersRef.current.set(toast.id, timer)
            }
        }) 
        return () => {
            timersRef.current.forEach(timer => clearTimeout(timer))
            timersRef.current.clear()
        }
    }, [dane])
    if(!toastRoot) return null
    return ReactDOM.createPortal( 
        <div id="toast-container" onClick={(e) => e.stopPropagation()}> 
        <div id="toast-list"> 
            {dane.map((t:any) => {
                return (<Toast key={t.id} dane ={t.value} removeToast={removeToast} id={t.id} type={t.type}/>)
            })}
        </div>  
        </div>, toastRoot )
}