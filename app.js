
//fetch covid data from api
async function fetchCovidInfo() {
	const request = await fetch(
		"https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=json",
		{
			method: "GET",
		}
	);

	const data = await request.json();
	console.log(data)
	return data;
}


fetchCovidInfo().then((data) => {

	combineDataGeoJSON(geojsonFeature.features, formatCovidData(data))

	// Adding Some Color
	L.geoJson(geojsonFeature, { style: style }).addTo(map);

	// Adding Interaction
	geojson = L.geoJson(geojsonFeature, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	// Custom Info Control
	info.addTo(map);

	// Custom Legend Control
	legend.addTo(map);



});

function formatCovidData(data) {
	var covidData = [];
	for (i = 0; i < data.features.length; i++) {

		covidData.push(

			{
				"name": data.features[i].attributes.Country_Region,
				"Last_Update": data.features[i].attributes.Last_Update,
				"Lat": data.features[i].attributes.Lat,
				"Long_": data.features[i].attributes.Long_,
				"cases": data.features[i].attributes.Confirmed,
				"deaths": data.features[i].attributes.Deaths,
				"recovered": data.features[i].attributes.Recovered,
				"Active": data.features[i].attributes.Active,
				"Incident_Rate": data.features[i].attributes.Incident_Rate,
				"UID": data.features[i].attributes.UID,
				"ISO3": data.features[i].attributes.ISO3,
			})

	}

	return covidData
}

function combineDataGeoJSON(ar1, ar2) {
	var notFound = []

	ar2.forEach((country2) => {
		var found = false
		c2name = country2.name

		ar1.forEach((country1) => {

			c1name = country1.properties.name;

			if (c2name == c1name) {
				found = true
				country1.properties.covidData = country2;

			}


		});
		if (found == false) {
			notFound.push(c2name)
		}
	});
	// countries that are not found in GeoJSON 
	console.log(notFound);
	return ar1;
}




// genereate map, and initial postion + zoom amount
var map = L.map("map").setView([0, 0], 1.5);
L.tileLayer(
	"https://api.mapbox.com/styles/v1/tarikjh/ckwzbwigw14b614pqjytuvvc4/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGFyaWtqaCIsImEiOiJja3d6OWRuY2EwZmwxMnpueWw0bzJsOHY5In0.n6bQCIi_caskJrELacqZQA",
	{
		attribution:
			'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: "mapbox/streets-v11",
		tileSize: 512,
		zoomOffset: -1,
		// accessToken: "pk.eyJ1IjoidGFyaWtqaCIsImEiOiJja3d6OWRuY2EwZmwxMnpueWw0bzJsOHY5In0.n6bQCIi_caskJrELacqZQA",
	}
).addTo(map);

// ADDING COLOR -------------------------------------------
function getColor(d) {
	return d > 4000000 ? '#7400b8' :
		d > 2000000 ? '#6930c3' :
			d > 1000000 ? '#5e60ce' :
				d > 500000 ? '#5390d9' :
					d > 100000 ? '#4ea8de' :
						d > 50000 ? '#48bfe3' :
							d > 10000 ? '#64dfdf' :
								'#80ffdb';
}



function style(feature) {
	return {
		fillColor: getColor(feature.properties.covidData.cases),
		weight: 1,
		opacity: 1,
		color: 'black',
		fillOpacity: 0.7
	};
}

// ADDING INTERACTION -------------------------------------------



function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: 'white',
		// dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties.covidData);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	console.log(e.target)
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}


// Custom Info Control -------------------------------------------


var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

	if (props) {
		var date = new Date(props.Last_Update);
		this._div.innerHTML = '<h4>Global Covid Cases</h4>' + (props ?
			'<b>' + props.name + '</b><br />' + props.cases.toLocaleString() + ' Cases'
			+ '</b><br />' + props.deaths.toLocaleString() + ' Deaths'
			+ '</b><br />' + date.toUTCString()
			: 'Hover over a country');
	}
};


// Custom Legend Control
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10000, 50000, 100000, 500000, 100000, 2000000, 4000000],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i].toLocaleString() + (grades[i + 1] ? '&ndash;' + grades[i + 1].toLocaleString() + '<br>' : '+');
	}

	return div;
};



