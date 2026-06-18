'use client'; 
import React, { createContext, useContext, useReducer, useEffect,useState } from 'react'; 
const LoginContext = createContext<any>(null);  
const axios = require('axios').default;
export const LoginProvider = ({ children }:any) => {   
  const [token, setToken] = useState<string>(""); 
  const [idToken, setIdToken] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);   
  
  useEffect(() => {
    if (loaded && token) { 
      localStorage.setItem(`Token`, token ); 
      localStorage.setItem(`idToken`, idToken ); 
    }
  }, [token]);
 
  useEffect(() => { 
    const savedToken = localStorage.getItem(`Token`); 
    const savedIdToken = localStorage.getItem(`idToken`);  
    if (savedToken) {
      setToken(savedToken)
    }  
    if (savedIdToken) {
      setIdToken(savedIdToken)
    }  
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && token ) { 
      console.log( token ); 
      fetch('/api/verify', {
        headers: { Authorization: `Bearer ${token}` }
      }) 
      .catch(function (error:any) {  
        console.log( token ); 
        setToken("");  
        setIdToken("")
        localStorage.removeItem('Token');
        localStorage.removeItem('idToken');
      });   
    } 
  }, [loaded]); 
  const addToken = (action: any) => {  
    setToken(action) 
  }
  const addIdToken = (action: any) => {  
    setIdToken(action) 
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