'use client'  
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PokemonCard } from "../components/PokemonCard";
import { PokemonList } from "../components/PokemonList"; 
import { FloatingCompareButton } from "../components/FloatingCompareButton";  
import { ComparisonModal } from "../components/ComparisonModal";   
import { ToastContainer } from "../components/ToastContainer";  
import { FilterPanel } from "../components/FilterPanel";
import { CreationModal } from '../components/CreationModal';
import { Link } from 'react-router-dom';
import { setTimeout } from 'timers/promises';
import { useLogin } from '../contexts/Login';
async function list( arr: any, limit=1000, offset=0,token:any,navigate:any) {
    try { 
        if (arr == "list") {
            console.log(token)
            const response = await fetch('/api/items', {
                headers: {
                    Authorization: `Bearer ${token}`
                } }) 
            if (!response.ok) {
                throw new Error(`${response.status}`) 
            }
            const dane = await response.json()  
            return dane.items.slice(offset,limit)
        } 
    } catch (error) {
        console.log(error)
        navigate("/");
    }
}    
export default function List() {    
  return <ClientApp />; 
}    
function ClientApp( ){     
    const [pokemons, setPokemons] = useState<any[]>( []);
    const [pagePokemons, setPagePokemons] = useState<any[]>( []);
    const [sidePanel, setSidePanel] = useState<any >({"random": [], "top":[],"rand": 0}); 
    const [favorite, setFavorite] = useState<string[]>( []); 
    const [favoriteLimit, setFavoriteLimit] = useState<Boolean>(false);  
    const [filters, setFilters] = useState<any>({"types": [],"abilities":[],"minHp": 0,"maxHp":260,"minAttack": 0,"maxAttack":260,"minDefense": 0,"maxDefense":260,"minSpeed": 0,"maxSpeed":260,"showPanel": false,"filtered": [],"search": "" });
    const [comparisonList, setComparisonList] = useState<string[]>( []); 
    const [comparisionTable, setComparisionTable] = useState<Boolean>(false); 
    const [creationForm, setCreationForm] = useState<Boolean>(false); 
    const [addTeam, setAddTeam] = useState<Boolean>(false); 
    const [toastList, setToastList] = useState<any>( []); 
    const [page, setPage] = useState(0);   
    const [loaded, setLoaded] = useState(false);
    const [createdList, setCreatedList] = useState<string[]>( []);  
    const {token}:any = useLogin()
    const navigate = useNavigate();
    const toggleComparision = (id: any) => {
        setComparisonList((prev:any) => { 
            if (prev.includes(id)) { 
                addToast("info","You remove pokemon from comparison")
                return prev.filter((f:any) => f !== id);
            } 
            if (prev.length >= 3) { 
                addToast("warning","Comparison list is full")
                return prev;
            } 
            addToast("success","You add pokemon to comparison")
            return [...prev, id];
        });
    };
    async function right() {
            if (pagePokemons[pagePokemons.length-1].id < 1000) { 
            const newPage = page + 1 
            const offset = newPage * 50  
            const pok = filters.filtered.length > 0 ? filters.filtered : pokemons
            setPagePokemons(pok.slice(offset,offset+50)) 
            setPage(newPage)  
            } 
    }  
    async function left() { 
        if (page === 0) return 
        const newPage = page - 1 
        const offset = newPage * 50  
        const pok = filters.filtered.length > 0 ? filters.filtered : pokemons
        setPagePokemons(pok.slice(offset,offset+50)) 
        setPage(newPage)  
    }    
    const cenfil = () => {
        filtfunc("add","showPanel",false)
        filtfunc("add","minHp",0)
        filtfunc("add","maxHp",260)
        filtfunc("add","minAttack",0)
        filtfunc("add","maxAttack",260)
        filtfunc("add","minDefense",0)
        filtfunc("add","maxDefense",260)
        filtfunc("add","minSpeed",0)
        filtfunc("add","maxSpeed",260)
        filtfunc("clear","types",[] )
        filtfunc("clear","abilities",[] )
        filtfunc("clear","filtered",[] )
        filtfunc("add","search", "")
        setPage(0)
        setPagePokemons(pokemons.slice(0,50)) 
    }
    const addToast = (type:any,value:any) => {
        const id = Date.now()
        setToastList((prev:any) => [...toastList, {type,id,value}])
    }
    const removeToast = (id:any) => { 
        setToastList(toastList.filter((p:any) => p.id != id))
    }
    const toggleFavorite = (id: any) => {
        setFavorite((prev) => { 
            if (prev.includes(id)) {
                setFavoriteLimit(false); 
                addToast("info","You remove pokemon from favorite")
                return prev.filter((f) => f !== id);
            } 
            if (prev.length >= 12) {
                setFavoriteLimit(true);
                addToast("warning","Favorite list is full")
                return prev;
            }  
            addToast("success","You add pokemon from favorite")
            return [...prev, id];
        });
    }; 
    useEffect(() => {
        async function fetchData( ) {
            const savedPokemons = localStorage.getItem(`pokemons`);
            const data = await list("list", 50,0,token,navigate) || []; 
            const random = ([data[Math.floor(Math.random() * data.length)],data[Math.floor(Math.random() * data.length)],data[Math.floor(Math.random() * data.length)]]) 
            const top =  [ data.find((p:any) => p.name == "charizard"),data.find((p:any) => p.name == "bulbasaur")]   
            if (savedPokemons) {
                setPokemons(JSON.parse(savedPokemons))
                setPagePokemons(JSON.parse(savedPokemons))
            }
            else{ 
                setPokemons(data)
                setPagePokemons(data .slice(0,50))
                const rand = Math.floor(Math.random() * 1001)
                setSidePanel({ top, random,rand })     
            } 
        }
        fetchData()
    },[token]) 
    useEffect(() => {
        async function fetchData( ) { 
            const data = await list("list", 50,0,token,navigate) || []; 
            const random = ([data[Math.floor(Math.random() * data.length)],data[Math.floor(Math.random() * data.length)],data[Math.floor(Math.random() * data.length)]]) 
            const top =  [ data.find((p:any) => p.name == "charizard"),data.find((p:any) => p.name == "bulbasaur")]   
            setPokemons(data)
            setPagePokemons(data .slice(0,50))
            const rand = Math.floor(Math.random() * 1001)
            setSidePanel({ top, random,rand })   
            localStorage.setItem(`pokemons`, JSON.stringify(data));   
        }
        const timer = window.setTimeout(() => {
            fetchData();
        }, 2000);

        return () => clearTimeout(timer); 
        
    },[createdList])    
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
                <p className="rand" onClick={() => setCreationForm(true)}>Create Pokemon</p> 
                <Link key={sidePanel.rand} to={`/pokemon/${sidePanel.rand}`}>
                    <p className="rand">Random pokemon</p>
                </Link>  
                <Link to={`/team-builder`}>
                    <p className="rand">Team</p>
                </Link>    
                <p className ="rand"onClick={async () => { 
                    pagePokemons .every(p => favorite.includes(p.id)) ? setPagePokemons(pokemons .slice(0,50)) : setPagePokemons(pokemons .filter(p => favorite.includes(p.id)))} }>Favorites: {favorite.length}</p>  
                <img id="nav-ball"src="master-ball2.png" alt="" /> 
            </div>
        </header>
        <div id ="main"> 
            <div className="random"> 
                {sidePanel.top.map((p:any)=> <PokemonCard key={p.id} pokemon={p} favorite = {favorite} toggleFavorite = {toggleFavorite} setComparisonList ={setComparisonList} comparisonList ={comparisonList} addTeam={addTeam}addToast={addToast}/> )}
            </div> 
            <div id ="wrapper">
                <div id="search">
                    <div id="search-panel">
                        <p id="add-team" onClick={() => setAddTeam(!addTeam)}>{addTeam ? "Cencel" : "Add to team"}</p> 
                        <FilterPanel pokemons={pokemons} setFilters={filtfunc } filters={filters} favorite={favorite} addToast={addToast} setPage={setPage} cenfil={cenfil}/> 
                        <button id="inp_btn" >Send</button>   
                        <Link to={`/advanced-search`}>
                            <p id="advanced-search">Advanced search</p>
                        </Link>    
                    </div>
                    <div id="search-panel-err"> 
                        {((filters.types.length + filters.abilities.length + filters.minHp + filters.maxHp + filters.search.length) != 260) && (<button onClick={cenfil} id="remove-filters">Remove filters</button>)}
                    </div>
                    <button id="main-left" onClick={right }>&gt;</button>
                    <button id="main-right" onClick={left }>&lt;</button> 
                </div>
                {filters.filtered.length > 0 ?
                <PokemonList  
                        pagePokemons = {pagePokemons } 
                        favorite = {favorite} 
                        toggleFavorite = {toggleFavorite} 
                        limit={favoriteLimit}
                        btn={true}  
                        filters={filters} 
                        setComparisonList= {toggleComparision}
                        comparisonList ={comparisonList}
                        page={page}
                        addTeam={addTeam}
                        addToast={addToast}/> :
                    <PokemonList  
                        pagePokemons = {pagePokemons } 
                        favorite = {favorite} 
                        toggleFavorite = {toggleFavorite} 
                        limit={favoriteLimit}
                        btn={true}  
                        filters={filters} 
                        setComparisonList= {toggleComparision}
                        comparisonList ={comparisonList}
                        page={page}
                        addTeam={addTeam}
                        addToast={addToast} /> }
           </div>
            <div className="random"> 
                {comparisonList.length > 1 && <FloatingCompareButton setComparisionTable={() => setComparisionTable(!comparisionTable)} comparisonList={comparisonList} />  }
                {sidePanel.random.map((p:any)=> <PokemonCard key={p.id} pokemon={p} favorite = {favorite} toggleFavorite = {toggleFavorite} setComparisonList ={setComparisonList} comparisonList ={comparisonList} addTeam={addTeam}addToast={addToast}/> )}
            </div>
            { comparisionTable && <ComparisonModal dane={pokemons.filter(p => comparisonList.some(i => p.id ==i)) } onClose={() => setComparisionTable(false)}  />}
            {(toastList.length > 0 && <ToastContainer dane = {toastList} removeToast={removeToast}/>)} 
            {creationForm && <CreationModal onClose={() => setCreationForm(false)} setCreatedList={(e:any) => setPokemons(prev => { const newPokemons = [e, ...prev];
                                                                                                                                    setCreatedList((prev:any) => [...prev, e])
                                                                                                                                    setPagePokemons(newPokemons.slice(0, 50)); 
                                                                                                                                    return newPokemons;
                                                                                                                                    })} pokemons={pokemons}/>}
        </div>
    </div>
    );
}  
 