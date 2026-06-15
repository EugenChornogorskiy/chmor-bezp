'use client'; 
import React, { createContext, useContext, useReducer, useEffect,useState } from 'react'; 
const LoginContext = createContext<any>(null);  
const axios = require('axios').default;
export const LoginProvider = ({ children }:any) => {   
  const [token, setToken] = useState<string>(""); 
  const [idToken, setIdToken] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);   
  
  useEffect(() => {
    if (loaded) { 
      localStorage.setItem(`Token`, token ); 
      localStorage.setItem(`idToken`, token ); 
    }
  }, [token]);
 
  useEffect(() => { 
    const savedToken = localStorage.getItem(`Token`); 
    const savedIdToken = localStorage.getItem(`idToken`);  
    if (savedToken) {
      setToken(savedToken.replace(/^"(.*)"$/, '$1'))
    }  
    if (savedIdToken) {
      setIdToken(savedIdToken.replace(/^"(.*)"$/, '$1'))
    }  
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && token ) { 
      fetch('/api/verify', {
        headers: { Authorization: `Bearer ${token}` }
      }) 
      .catch(function (error:any) {  
        setToken("");  
        setIdToken("")
      });  
      console.log( token ); 
    } 
  }, [loaded]); 
  const addToken = (action: any) => {  
    setToken(action) 
  }
  const addIdToken = (action: any) => {  
    setToken(action) 
  }  
  const value = {  
    token, 
    idToken,
    addToken,
    addIdToken,
  }; 
  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider >
  );
  
};

export const useLogin = () => {
  const context = useContext(LoginContext ); 
  return context;
};