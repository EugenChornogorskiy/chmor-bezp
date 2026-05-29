'use client'  
import { useRef, useEffect,useState } from 'react'
export function SearchInput( {setFilters}) {   
  const inputRef = useRef(null)
  const [value, setValue] = useState("")
 
  useEffect(() => {
    inputRef.current?.focus()
  }, []) 
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters("add", "search", value.toLowerCase())
    }, 500)

    return () => clearTimeout(timer)
  }, [value])
  return ( 
      <input ref={inputRef} type="text" id="inp" name="value" placeholder="What to find?" onChange={(e) => setValue(e.target.value)} />  
  )
}