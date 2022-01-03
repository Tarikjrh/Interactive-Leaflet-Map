// var trimmedGeoJson = delete geojsonFeature.type;
y = {
	type: "FeatureCollection",
}
var x = []
for (i = 0; i < geojsonFeature.features.length; i++) {

	// console.log(geojsonFeature.features[i].properties);

	x.push({
		type: geojsonFeature.features[i].type,
		properties: {
			name: geojsonFeature.features[i].properties.name,
			filename: geojsonFeature.features[i].properties.filename,
			covidData: {
				"name": "",
				"Last_Update": "",
				"Lat": "",
				"Long_": "",
				"cases": 0,
				"Deaths": 0,
				"Recovered": 0,
				"Active": 0,
				"Incident_Rate": 0,
				"UID": "",
				"ISO3": "",
			},
			// type: geojsonFeature.features[i].properties.type,
		},

		geometry: geojsonFeature.features[i].geometry
	}
	)
}

// console.log(x)
// console.log(geojsonFeature.features[0])
y.features = x
console.log(y)
// console.log(geojsonFeature.features, trimmedGeoJson);
