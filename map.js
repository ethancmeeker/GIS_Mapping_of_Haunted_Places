require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend"	
  ], function(Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend) {
        // Create a basemap for the map view
        var myMap = new Map({
            basemap: "dark-gray-vector"
        });

        // Create a map view for the HTML using the basemap
        // previously created.
        var myView = new MapView({
            container: "viewDiv",  // HTML ID 
            map: myMap,        // BaseMap Created
			center: [-109, 39], // Choses where it will start
            zoom: 4                // zoom in level
        });


        // Create a Graphics Layer which can be used to draw graphics
        // on the map
        var graphicsLayer = new GraphicsLayer();
        myMap.add(graphicsLayer);  

        // We will use the XMLHttpRequest object to read data from the USGS
        // server and populate graphics on our map based on the results
        // https://www.w3schools.com/js/js_ajax_http.asp
		for (let i = 0, len = haunt_locs.data.length; i < len; i++) {
			//console.log(haunt_loc.data[i].the_location
			var los = haunt_locs.data[i].level_of_spooky;
			var the_color;
			var warning;
			if (los == "Top") {
				the_color = [105, 0, 0]; 
				warning = "CAUTION, THIS LOCATION HAS HIGH PARANORMAL/DEMONIC ACTIVITY<br><br>";
				warning = warning.fontcolor( "red" );
			}
			else if (los == "Mid") {
				the_color = [207, 192, 37]; 
				warning = "Note: This place has been claimed to be heavily haunted<br><br>";
			}
			else if (los == "Ify") {
				the_color = [138, 59, 135]; 
				warning = "Note: this place has questionable sources claiming it haunted<br><br>";
			}
			else {
				the_color = [41, 196, 227];
				warning = "";
			}
			var marker = {
				type: "simple-marker",
				style: "https://pngimg.com/uploads/ghost/ghost_PNG17.png",
				color: the_color,
			};

			// Define location to draw
			// This JS map is expected by ArcGIS to make a graphic
			var location = {
				type: "point",
				longitude: haunt_locs.data[i].longitude,
				latitude: haunt_locs.data[i].latitude,
			};

			// Define attributes for us in popup template.  The popup
			// template uses {}'s to access items in the attributes map.
			// The template content also supports HTML tags.
			var popup_attributes = {
				warn: warning,
				loc: haunt_locs.data[i].the_location,
				city: haunt_locs.data[i].city,
				describe: haunt_locs.data[i].description
			};

			var popup_template = {
				title: "Haunted Spot",
				content: "<b>{warn}Location</b>: {loc}<br><b>City</b>: {city}<br><br>{describe}"
			};

			// Combine location and symbol to create a graphic object
			// Also include the attributes and template for popup
			var graphic = new Graphic({
				ID: 1,
				name: los,
				geometry: location,
				symbol: marker,
				attributes: popup_attributes,
				popupTemplate: popup_template
			});
	
		// Add the graphic (with its popup) to the graphics layer
			graphicsLayer.add(graphic);
        }

        // Time to actually send the GET request to the USGS.  When we get a response
        // it will call and execute the function we defined above.
        
        // Create a locate me button
        var locate = new Locate({
            view: myView,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
                options.target.scale = 1000000;  // 1/1000000 scale
                return view.goTo(options.target);
              }
        });
        myView.ui.add(locate, "top-left");

		
        var legend = new Legend({
            view: myView,
            layerInfos: [{
                layer: graphicsLayer,
                title: "Haunt"
            }]
        });
        myView.ui.add(legend, "bottom-left");

});