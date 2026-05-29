 
import { useEffect, useState,useRef } from 'react';
import ReactDOM from "react-dom";
import { ComparisonTable } from "./ComparisonTable";
export function ComparisonModal( { dane , onClose } : any) {  
    const modalRoot = typeof window !== "undefined" ? document.getElementById("modal-root") : null;
    const modalRef = useRef<HTMLDivElement | null>(null);
      
    useEffect(() => {
        if(!modalRef.current){
          return
        }
        const focusable = modalRef.current.querySelectorAll("button, [href], input, select, textarea");
        const first = focusable[0] as HTMLElement;
        first?.focus();
        const last = focusable[focusable.length - 1] as HTMLElement;

        function handleTab(e:any) {
          if (e.key !== "Tab") return;
          if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
          }
        }

        document.addEventListener("keydown", handleTab);
        return () => document.removeEventListener("keydown", handleTab);
    }, []);
    useEffect(() => {
      
      const handleEsc = (e:any) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, []);
    if(!modalRoot) return null
  return ReactDOM.createPortal( 
    <div   ref={modalRef} id="backgr" onClick={onClose} style={{position:"absolute"}}> 
      <div onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose } id="close-modal">
          X
        </button> 
        <ComparisonTable dane={dane} setComparisionTable={onClose} />
      </div>  
    </div>, modalRoot )
}