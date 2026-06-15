'use client'  
import { useEffect, useState } from 'react';
import { PokemonCard } from "../components/PokemonCard"; 
import { FloatingCompareButton } from "../components/FloatingCompareButton";  
import { ComparisonModal } from "../components/ComparisonModal";   
import { ToastContainer } from "../components/ToastContainer";   
import { CreationModal } from '../components/CreationModal';
import { Link } from 'react-router-dom'; 
import { useLogin } from '../contexts/Login'; 
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
    const { token }:any = useLogin(); 
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
        if (!token) {
            const link = async function() {
                const codeVerifier = await generateCodeVerifier();
                const codeChallenge = await generateCodeChallenge(codeVerifier);
                sessionStorage.setItem('pkce_verifier', codeVerifier);
                window.location.href =
                    "http://localhost:9000/application/o/authorize/" +
                    "?client_id=" + process.env.CLIENT_ID +
                    "&response_type=code" +
                    "&scope=openid profile email" +
                    "&redirect_uri=" + process.env.REDIRECT_URI +
                    "&code_challenge=" + codeChallenge +
                    "&code_challenge_method=S256";
            } 
            link() 
        }
    }, [token]);
    useEffect(() => {
        if (loaded) {
            localStorage.setItem(`pokemons`, JSON.stringify(pokemons));
        }
    }, [pokemons]); 
    const filtfunc = (form: any, key: any,value : any) => {
        if (form=="add") {
            if (key == "types" || key == "abilities") {
                setFilters((prev :any) => ({ ...prev, [key]: [...filters [key], value] }));  
                }
            else{
                setFilters((prev :any) => ({ ...prev, [key]: value  }));  
            }   
        }
        else if(form=="remove"){ 
            if (key == "types" || key == "abilities") {
                setFilters((prev :any) => ({ ...prev, [key]: filters [key].filter((p:any) => p!= value)}));   
            }
            else{
                setFilters((prev :any) => ({ ...prev, [key]: value  }));   
            } 
        } 
        else{
            setFilters((prev :any) => ({ ...prev, [key]: value  }));
        }
    }     
    return ( 
    <div id ="root"> 
        <header>
            <div id="nav-items"> 
                <img id="logo"src="Pokemon-Logo.png" alt="" />  
                <img id="nav-ball"src="master-ball2.png" alt="" /> 
            </div>
        </header>
        <div id ="main"> 
            <div className="random"> 
                {sidePanel.top.map((p:any)=> <PokemonCard key={p.id} pokemon={p} favorite = {favorite} toggleFavorite = {toggleFavorite} setComparisonList ={setComparisonList} comparisonList ={comparisonList} addTeam={addTeam}addToast={addToast}/> )}
            </div> 
            <div id ="wrapper"> 
                <p id = "welcome-message">Welcome to <span style={{color:"red"}}>Pokemon-Stats</span></p>
                <Link to={"/list"}>
                    <button id ="welcome-button">Start</button>
                </Link>
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
 