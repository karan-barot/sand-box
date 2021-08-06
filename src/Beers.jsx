import { useEffect,useState } from 'react';
import axios from 'axios'
import {animated, useTransition} from '@react-spring/web'
export default function Beers() {

    const [beers,setBeers] = useState([])
    const [filterBeers,setFilterBeers] = useState([])
    const [searchString,setSearchString] = useState("")

    useEffect(()=>{
        async function fetchData(){
            const response = await axios.get("https://api.punkapi.com/v2/beers")
            if(response.status===200){
                setBeers(response.data)
            }
            console.log(response.data)
        }
        fetchData()
        
    },[])


    useEffect(()=>{
        let filtered= beers.filter(beer=>beer.name.toLowerCase().includes(searchString.toLowerCase()))
        setFilterBeers(filtered)
    },[searchString,beers])
    return(
        <div className="container">
            <div className="search-container container">
                <input type="text" className="mt-2" placeholder="Search..." onChange={(e)=>setSearchString(e.target.value)}/>
            </div>
            {
                beers.length===0? <b className="mt-2">Loading...</b>:
                filterBeers.map((beer,index)=>(
                <Beer beer={beer} key={index}/>
                ))
            }
        </div>
    );
}

const Beer =(props)=>{

    const [showDetailsButton, setShowDetailsButton] = useState(false)
    const [showDetails, setShowDetails] = useState(false)

    const transition  = useTransition(showDetails,{
        from:{x:-100,y:0,opacity:0},
        enter:{x:0,y:0,opacity:1},
        leave:{x:2000,y:0,display:'none'},
        
    })
    const btntransition = useTransition(showDetailsButton,{
        from:{x:-100,y:0,opacity:0,display:'block'},
        enter:{x:0,y:0,opacity:1},
        leave:{x:2000,y:0,opacity:0},
        
    })
    const handleMouseEnter=()=>{
        setShowDetailsButton(true)
    }
    const handleMouseLeave=()=>{
        setShowDetailsButton(false)
        setShowDetails(false)
    }
    
    return(
        <animated.div className="container beer-card mt-5" onMouseEnter={()=>handleMouseEnter()} onMouseLeave={()=>handleMouseLeave()}>
            <div className="image-container">
                <img src={props.beer.image_url} alt="beer"/>
            </div>
            <div className="details-container">
                <p className="beer-name">{props.beer.name}</p>
                <p className="beer-tagline">{props.beer.tagline}</p>
                {
                   
                    btntransition((style,btn)=>
                        btn? <animated.button style={style} onClick={()=>setShowDetails(!showDetails)}>Abcd</animated.button> : ""

                    )
                    
                }                
                {
                    transition((style,details)=>
                    details?
                        <animated.div className="details" style={style}>
                                <ul>
                                    <li><b>boil volume:</b>{props.beer.boil_volume.value}</li>
                                    <li><b>brewer_tips:</b>{props.beer.brewers_tips}</li>
                                    <li><b>contributed by:</b>{props.beer.contributed_by.replace("<samjbmason>","")}</li>
                                    <li><b>description:</b>{props.beer.description}</li>
                                    <li><b>first brewed:</b>{props.beer.first_brewed}</li>
                                    <li><b>food_pairing:</b>{props.beer.food_pairing.map((ingredient,index)=>(
                                        <ul className="food-pairing">
                                            <li key={index}>{ingredient}</li>
                                        </ul>
                                    ))}</li>
                                    <li><b>ingredients:</b></li>
                                    <li><b>tagline:</b>{props.beer.tagline}</li>
                                    <li><b>volume:</b>{props.beer.volume.value} {props.beer.volume.unit} </li>
                                </ul>
                            </animated.div> : ""
                    )
                   
                        
                }
                
            </div>
        </animated.div>
        
    )
}