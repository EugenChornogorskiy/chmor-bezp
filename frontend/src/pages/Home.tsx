'use client'  
import { useEffect, useState } from 'react';
import { PokemonCard } from "../components/PokemonCard"; 
import { FloatingCompareButton } from "../components/FloatingCompareButton";  
import { ComparisonModal } from "../components/ComparisonModal";   
import { ToastContainer } from "../components/ToastContainer";   
import { CreationModal } from '../components/CreationModal';
import { Link } from 'react-router-dom'; 
import { useLogin } from '../contexts/Login'; 
import { useNavigate } from "react-router-dom";
export default function Home() {    
  return <ClientApp />; 
}    
function ClientApp( ){     
    const [pokemons, setPokemons] = useState<any[]>( []); 
    const [sidePanel, setSidePanel] = useState<any >({"random": [], "top":[],"rand": 0}); 
    const [favorite, setFavorite] = useState<string[]>( []);  
    const [filters, setFilters] = useState<any>({"types": [],"abilities":[],"minHp": 0,"maxHp":260,"minAttack": 0,"maxAttack":260,"minDefense": 0,"maxDefense":260,"minSpeed": 0,"maxSpeed":260,"showPanel": false,"filtered": [],"search": "" });
    const [comparisonList, setComparisonList] = useState<string[]>( []); 
    const [comparisionTable, setComparisionTable] = useState<Boolean>(false); 
    const [creationForm, setCreationForm] = useState<Boolean>(false); 
    const [addTeam, setAddTeam] = useState<Boolean>(false); 
    const [toastList, setToastList] = useState<any>( []);  
    const [loaded, setLoaded] = useState(false); 
    const { token,addToken,addIdToken,idToken}:any = useLogin(); 
    const navigate = useNavigate();
    const addToast = (type:any,value:any) => {
        const id = Date.now()
        setToastList((prev:any) => [...toastList, {type,id,value}])
    }
    const removeToast = (id:any) => { 
        setToastList(toastList.filter((p:any) => p.id != id))
    }
    const toggleFavorite = (id: any) => {
        setFavorite((prev:any) => { 
            if (prev.includes(id)) { 
                addToast("info","You remove pokemon from favorite")
                return prev.filter((f:any) => f !== id);
            } 
            if (prev.length >= 12) { 
                addToast("warning","Favorite list is full")
                return prev;
            }  
            addToast("success","You add pokemon from favorite")
            return [...prev, id];
        });
    };  
    async function generateCodeVerifier() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(Array.from(array).map(byte => String.fromCharCode(byte)).join(''))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    async function generateCodeChallenge(verifier: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint8Array(hash);
        return btoa(Array.from(hashArray).map(byte => String.fromCharCode(byte)).join(''))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    } 

    useEffect(() => {
        if (loaded) {
            localStorage.setItem(`pokemons`, JSON.stringify(pokemons));
        }
    }, [pokemons]); 
    const Login = async ( ) => { 
                const codeVerifier = await generateCodeVerifier();
                const codeChallenge = await generateCodeChallenge(codeVerifier);
                sessionStorage.setItem('pkce_verifier', codeVerifier);
                window.location.href =
                    "http://localhost:9000/application/o/authorize/" +
                    "?client_id=" + (process.env.REACT_APP_CLIENT_ID || "my-app") +
                    "&response_type=code" +
                    "&scope=openid profile email" +
                    "&redirect_uri=" + (process.env.REDIRECT_URI || "http://localhost/callback")  +
                    "&code_challenge=" + codeChallenge +
                    "&code_challenge_method=S256";
    }     
    const getMetrics = async () => {
        try {
            const response = await fetch('/api/metrics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const metrics = await response.text();
            console.log(metrics); 
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };
    const logOut = async () => { 
        if (!token) {
            navigate("/");
            return;
        }
        
        try {
            console.log("idToken", idToken);
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-ID-Token': idToken,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.warn('Server logout failed:', await response.text()); 
                addToken("");
                addIdToken("");
                navigate("/");
                return;
            }
            
            const data = await response.json();
            console.log('Logout response:', data);
             
            addToken("");
            addIdToken(""); 
            if (data.logoutUrl && data.id_token) {  
                const logoutRedirectUrl = `${data.logoutUrl}?id_token_hint=${data.id_token}&post_logout_redirect_uri=${encodeURIComponent('http://localhost/callback')}`;
                window.location.href = logoutRedirectUrl;
            } else { 
                navigate("/");
            }
        } catch (error) {
            console.error('Logout error:', error);
            addToken("");
            addIdToken("");
            navigate("/");
        }
    }
    return ( 
    <div id ="root"> 
        <header>
            <div id="nav-items"> 
                <img id="logo"src="Pokemon-Logo.png" alt="" />   
                {token.length == 0 && <p className="rand" onClick={() => Login()}>Login</p> } 
                {token.length > 0 && <p className="rand" onClick={() => logOut()}>Log-out</p> }
                {token.length > 0 && <p className="rand" onClick={() => getMetrics()}>Metrics</p> }
                <img id="nav-ball"src="master-ball2.png" alt="" /> 
            </div>
        </header>
        <div id ="main"> 
            <div className="random"> 
                {sidePanel.top.map((p:any)=> <PokemonCard key={p.id} pokemon={p} favorite = {favorite} toggleFavorite = {toggleFavorite} setComparisonList ={setComparisonList} comparisonList ={comparisonList} addTeam={addTeam}addToast={addToast}/> )}
            </div> 
            <div id ="wrapper"> 
                <p id = "welcome-message">Welcome to <span style={{color:"red"}}>Pokemon-Stats</span></p>
                {token.length > 0 && <Link to={"/list"}>
                    <button id ="welcome-button">Start</button>
                </Link>}
           </div>
            <div className="random"> 
                {comparisonList.length > 1 && <FloatingCompareButton setComparisionTable={() => setComparisionTable(!comparisionTable)} comparisonList={comparisonList} />  }
                {sidePanel.random.map((p:any)=> <PokemonCard key={p.id} pokemon={p} favorite = {favorite} toggleFavorite = {toggleFavorite} setComparisonList ={setComparisonList} comparisonList ={comparisonList} addTeam={addTeam}addToast={addToast}/> )}
            </div>
            { comparisionTable && <ComparisonModal dane={pokemons.filter(p => comparisonList.some(i => p.id ==i)) } onClose={() => setComparisionTable(false)}  />}
            {(toastList.length > 0 && <ToastContainer dane = {toastList} removeToast={removeToast}/>)} 
            {creationForm && <CreationModal onClose={() => setCreationForm(false)}  />}
        </div>
    </div>
    );
}  
 