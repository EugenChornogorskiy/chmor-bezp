'use client' 

export function ToggleButton({ label, targetId }: { label: string, targetId: string }) { 
  function toggle( ) {
    const section = document.getElementById(targetId) 
    if (!section) return;
    section.style.opacity = section.style.opacity === '0' ? '1' : '0'
  }

  return ( 
      <button id="toggle-stats" onClick={toggle} >
        Toggle {label}
      </button>  
  )
}
export function ToggleTheme( ) { 
  function toggle( ) {
    const section = document.getElementById("main")
    if (!section) return;
    const isLight = section.style.backgroundColor === 'snow' 
    section.style.backgroundColor = isLight ? '#1d1d1d' : 'snow'; 
    section.style.color = isLight ? 'white' : '#1d1d1d';
  }

  return ( 
      <p className="rand" onClick={toggle} >
        Change Theme
      </p>  
  )
}
