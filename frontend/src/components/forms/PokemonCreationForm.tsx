import { useState, startTransition } from 'react';   
import { useFormik } from 'formik'; 
import { createValidationSchema } from '../../utils/validationSchemas'; 
import { SubmitButton } from '../../components/forms/SubmitButton';   
import { PokemonLivePreview } from '../../components/PokemonLivePreview';   
import { useLogin } from '../../contexts/Login';
export function PokemonCreationForm( { pokemons,prewievWindow,addOptimisticPokemon,setCreatedPokemons,setCreatedList }: any) {    
  const [value, setValue] = useState( 0);   
  const [showTypes, setShowTypes] = useState(false); 
  const [showSecondTypes, setShowSecondTypes] = useState(false);  
  const [image, setImage] = useState<string | null>(null);  
  const {token}:any = useLogin()
    const filterList = (mode:any) => {  
            const types = pokemons.flatMap((p: any) => p.types );
            const newTypes = Array.from(new Set(types));
            return newTypes;
        }
  const formik = useFormik({
      initialValues: { 
        name: '',
        type: '', 
        second_type: '',
        information: '',
        hp: '',
        attack: '',
        defense: '',
        speed: '',
      },
      validationSchema: createValidationSchema,
      onSubmit: async (values, { resetForm ,setSubmitting}) => { 
        setSubmitting(true);
        const newPokemon = { 
            name: values.name, 
            types: values.second_type.length > 0 ? [values.type,values.second_type] : [values.type],
            stats: [{value:Number(values.hp),name:"hp"},{value:Number(values.attack),name:"attack"},{value:Number(values.defense), name:"defense"},{value:Number(values.speed),name:"speed"}],
            sprite: image, 
            id: Date.now(), 
            date: new Date().toLocaleDateString('pl-PL') 
        }; 
        await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( newPokemon )
                }) 
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setCreatedList(newPokemon)
        setCreatedPokemons((prev:any) => [...prev, newPokemon])
        resetForm();
        setValue(0)
        setImage(null); 
        setSubmitting(false);
      },
    });   
  return (   
        <div id="window-create" style={{width: prewievWindow ? "1200px" : "700px"}}>
            <form onSubmit={formik.handleSubmit} id="form-create">  
                <div id="rating-form">
                    <p id="rating-pokemon">Rating pokemon</p> 
                    <div id="create-inputs">
                        <div className='create-property'>
                            <input type="text" id="pokemon-name" name="name" placeholder="Pokemon name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                            {formik.touched.name && formik.errors.name && (
                                <div className="error">{formik.errors.name}</div>
                            )}   
                        </div>  
                        <div className='create-property'> 
                                <p>Hp: <input type="text" className="stat" name="hp" placeholder="0-255" value={formik.values.hp} onChange={formik.handleChange} onBlur={formik.handleBlur}/></p>
                                
                                <p>Attack: <input type="text" className="stat" name="attack" placeholder="0-255" value={formik.values.attack} onChange={formik.handleChange} onBlur={formik.handleBlur}/></p>
                            
                                <p>Defense: <input type="text" className="stat" name="defense" placeholder="0-255" value={formik.values.defense} onChange={formik.handleChange} onBlur={formik.handleBlur}/></p>
                            
                                <p>Speed: <input type="text" className="stat" name="speed" placeholder="0-255" value={formik.values.speed} onChange={formik.handleChange} onBlur={formik.handleBlur}/></p>
                                
                        </div>
                        {((formik.touched.hp && formik.errors.hp) || (formik.touched.attack && formik.errors.attack) || (formik.touched.defense && formik.errors.defense) || (formik.touched.speed && formik.errors.speed)) && (
                                    <div className="error">{formik.errors.hp || formik.errors.attack || formik.errors.defense || formik.errors.speed}</div>)}
                        <div className='create-property'>
                            < textarea id="comment-value" name="information" placeholder="Information" value={formik.values.information} onChange={formik.handleChange} onBlur={formik.handleBlur}></textarea>
                            {formik.touched.information && formik.errors.information && (
                                <div className="error">{formik.errors.information}</div>
                            )}
                        </div>
                        <div className='create-property-types'>
                            <div className='panel-filters'>
                                <div className="filter-type">
                                    <p>Type: </p>
                                        <div className="dropdown">
                                            <button type="button"
                                                className="dropdown-btn"
                                                onClick={() => setShowTypes(!showTypes)} >
                                                Select type {showTypes ? "▴" : "▾"} 
                                            </button>
                                            {showTypes && (
                                                <div className='dropdown-list'  >
                                                    {filterList("type").map((p:any) => {
                                                        return <p className="filter" onClick={() =>  {formik.setFieldValue("type", p); setShowTypes(!showTypes)} } key={p}>{p}</p>
                                                    })}
                                                </div>
                                            )}
                                        </div>  
                                </div>
                                <div className='filters'>{formik.values.type &&  (<p onClick={() => formik.setFieldValue("type", '') }>{formik.values.type}</p> )
                                    }
                                    {formik.touched.type && formik.errors.type && (
                                        <div className="error">{formik.errors.type}</div>)}
                                </div> 
                            </div>
                            <div className='panel-filters'>
                                <div className="filter-type">
                                    <p>Second type: </p>
                                        <div className="dropdown">
                                            <button type="button"
                                                className="dropdown-btn"
                                                onClick={() => setShowSecondTypes(!showSecondTypes)} >
                                                Select type {showSecondTypes ? "▴" : "▾"} 
                                            </button>
                                            {showSecondTypes && (
                                                <div className='dropdown-list'  >
                                                    {filterList("type").map((p:any) => {
                                                        return <p className="filter" onClick={() =>  {formik.setFieldValue("second_type", p);setShowSecondTypes(!showSecondTypes)} } key={p}>{p}</p>
                                                    })}
                                                </div>
                                            )}
                                        </div>  
                                </div>
                                <div className='filters'>{formik.values.second_type &&  (<p onClick={() => formik.setFieldValue("second_type",  '') }>{formik.values.second_type}</p> )
                                    } </div>
                            </div> 
                        </div>
                        <div className='create-property'>
                            <div id="upload-file">
                                <p>Image:</p> 
                                <label className="upload-btn">
                                    Upload image
                                    <input
                                    type="file"
                                    className="hidden-file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setImage(reader.result as string); 
                                        };
                                        reader.readAsDataURL(file);
                                        }
                                    }}
                                    />
                                </label>
                            </div> 
                            {image && (
                                <div className="image-preview">
                                    <img src={image} alt="Preview" style={{ width: "120px", borderRadius: "8px" }} />
                                </div>
                            )}
                        </div> 
                    </div> 
                    <SubmitButton submitting={formik.isSubmitting }/> 
                </div>
            </form> 
            {prewievWindow && <PokemonLivePreview values={formik.values} image={image} />}  
        </div> 
  )
}