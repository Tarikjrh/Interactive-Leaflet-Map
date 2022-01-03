async function getGlobalInfo() {
	const request = await fetch("https://restcountries.com/v2/all?fields=name,latlng", {
		method: "GET",
	});
	const data = await request.json();
	return data;
}

getGlobalInfo()
	.then((data) => {
		console.log(data);

		var map = L.map("map").setView([0, 0], 1);
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

		data.forEach((country) => {
			try {
				var marker = L.marker([country.latlng[0], country.latlng[1]]).addTo(map);
				marker.bindPopup(country.name).openPopup();
				// L.popup().setLatLng([country.latlng[0], country.latlng[1]]).setContent(country.name).openOn(map);
			} catch (err) {
				console.log(err);
			}
		});

		// var marker = L.marker([33.818481, 35.844604]).addTo(map);

		var popup = L.popup();

		function onMapClick(e) {
			console.log(e);
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(map);
		}

		map.on("click", onMapClick);
	})
	.catch((err) => {
		console.log(err);
	});

// var map = L.map("map").setView([0, 0], 1);
// L.tileLayer(
// 	"https://api.mapbox.com/styles/v1/tarikjh/ckwzbwigw14b614pqjytuvvc4/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGFyaWtqaCIsImEiOiJja3d6OWRuY2EwZmwxMnpueWw0bzJsOHY5In0.n6bQCIi_caskJrELacqZQA",
// 	{
// 		attribution:
// 			'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// 		maxZoom: 18,
// 		id: "mapbox/streets-v11",
// 		tileSize: 512,
// 		zoomOffset: -1,
// 		// accessToken: "pk.eyJ1IjoidGFyaWtqaCIsImEiOiJja3d6OWRuY2EwZmwxMnpueWw0bzJsOHY5In0.n6bQCIi_caskJrELacqZQA",
// 	}
// ).addTo(map);
