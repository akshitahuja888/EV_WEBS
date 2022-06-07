import React,{Component} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
// import { Nav,Navbar} from 'react-bootstrap';
import Menu from './SelectorMenu';
import axios from 'axios';

mapboxgl.accessToken='pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// Sample data 
const d = [
	{
		"location": "St. Georges School Alaknanda ND",
		"city": "New Delhi",
		"state": "Delhi",
		"coordinates": [77.252970,28.525260],
	},
	{
		"location": "Govindpuri Metro Station",
		"city": "New Delhi",
		"state": "Delhi",
		"coordinates": [77.264427,28.543952],
	},
	{
		"location": "Domino's Kalkaji",
		"city": "New Delhi",
		"state": "Delhi",
		"coordinates": [77.257661,28.540669],
	}
]

class Mapp extends Component{

	// Set up states for updating map 
	constructor(props){
		super(props);
		this.state = {
			lng: 77.260071,
			lat: 28.543140,
			zoom: 12,
			dz:[]
		}
	}

	// Create map and lay over markers
	async componentDidMount(){
		const map = await new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/dark-v10', 
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom
		})

		// d = await axios.get('/api/getstations/');
		// console.log('data got is',d.data);
		// this.setState({
		// 	dz:d.data.map((p)=>(p))
		// })
		// console.log(this.state.dz);

		d.forEach((location) => {
			console.log(location)
			var marker = new mapboxgl.Marker()
							.setLngLat(location.coordinates)
							.setPopup(new mapboxgl.Popup({ offset: 30 })
							.setHTML('<h4>' + location.city + '</h4>' + location.location))  //add a booking button here and it's functionality
							.addTo(map);

		})

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
                })
            );
	}
	render(){
		return(
            <>
			<Menu></Menu>
			<div>
				<div className="map-container" ref={el => this.mapContainer = el}/>
			</div>
            </>
		)
	}
}

export default Mapp;
