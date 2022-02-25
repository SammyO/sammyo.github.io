mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtbXlvc3VtdGluZyIsImEiOiJja3llbHd2c2YwdDNuMnZxaG50cGlzNjk5In0.9CFGWGiyXWZxzon6ENAYeA';

     const map = new mapboxgl.Map({
       container: 'map',
       style: 'mapbox://styles/sumting/ckzgwchr2000116lcvusqd79j',
       center: [25.000, 50.000],
       zoom: 0.70,
       scrollZoom: true,
     attributionControl: false
   });

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add max zoom level
var options = {
  maxZoom: 15};

   const stores = {
     "type": "FeatureCollection",
     "features": [
       {
         "type": "Feature",
         "geometry": {
           "type": "Point",
           "coordinates": [
             4.919700,
             52.353529
             
           ]
         },
         "properties": {
           "projectlink": "https://sumting-give-back-to-earth.webflow.io/product/mixed-portfolio",
           "projectimage": "https://d354cgj0llpu6u.cloudfront.net/roberto-sorin-RS0-h_pyByk-unsplash.jpg",
           "projectmarker": "https://upload.wikimedia.org/wikipedia/commons/0/07/Communication_icon_%28The_Noun_Project%29.svg",
           "projectname":"Sumting Club"
         }
       },
       {
         "type": "Feature",
         "geometry": {
           "type": "Point",
           "coordinates": [
             -77.049766,
             38.900772
           ]
         },
         "properties": {
          "projectlink": "https://sumting-give-back-to-earth.webflow.io/product/mixed-portfolio",
          "projectimage": "https://innovationorigins.com/app/uploads/2021/03/2020Blokkendam-304-2048x1367.jpg",
          "projectmarker": "https://static.tildacdn.com/tild6138-3939-4631-b939-393665353063/Line_logo-1-1.svg",
          "projectname":"Reefsystems"
         }
       }
     ]
   };
   /* Assign a unique ID to each store */
   stores.features.forEach(function (store, i) {
     store.properties.id = i;
   });
   map.on('load', () => {
     /* Add the data to your map as a layer */
     map.addSource('places', {
     'type': 'geojson',
     'data': stores
     });
     addMarkers();
     buildLocationList(stores);
   });

     function addMarkers() {
          /* For each feature in the GeoJSON object above: */
          for (const marker of stores.features) {
               /* Create a div element for the marker. */
               const el = document.createElement('div');
               /* Assign a unique `id` to the marker. */
               el.id = `marker-${marker.properties.id}`;
               /* Assign the `marker` class to each marker for styling. */
               el.className = 'marker';
               /* Set the feature's image property as the custom marker image */
               el.style.backgroundImage=`url('${marker.properties.projectmarker}')`;

               /**
               * Create a marker using the div element
               * defined above and add it to the map.
               **/
               new mapboxgl.Marker(el, { offset: [0, -23] })
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
               /**
               * Listen to the element and when it is clicked, do three things:
               * 1. Fly to the point
               * 2. Close all other popups and display popup for clicked store
               * 3. Highlight listing in sidebar (and remove highlight for all other listings)
               **/
               el.addEventListener('click', (e) => {
                    /* Fly to the point */
                    flyToStore(marker);
                    /* Close all other popups and display popup for clicked store */
                    createPopUp(marker);
                    /* Highlight listing in sidebar */
                    const activeItem = document.getElementsByClassName('active');
                    e.stopPropagation();
                    if (activeItem[0]) {
                         activeItem[0].classList.remove('active');
                    }
                    const listing = document.getElementById(
                         `listing-${marker.properties.id}`
                    );
                    listing.classList.add('active');
               });
          }
     }

   function flyToStore(currentFeature) {
     map.flyTo({
       center: currentFeature.geometry.coordinates,
       zoom: 13
     });
   }

   function createPopUp(currentFeature) {
     const popUps = document.getElementsByClassName('mapboxgl-popup');
     /** Check if there is already a popup on the map and if so, remove it */
     if (popUps[0]) popUps[0].remove();

     const popup = new mapboxgl.Popup({ closeOnClick: false })
  
     popup.setLngLat(currentFeature.geometry.coordinates)
       .setHTML(`
        <h3><a href="${currentFeature.properties.projectlink}">${currentFeature.properties.projectname}</a></h3>
        <img src="${currentFeature.properties.projectimage}" class="custom-popup-image">
       `)
       .addTo(map);
   }
