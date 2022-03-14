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
             92.861524, 26.339692
             
           ]
         },
         "properties": {
           "projectlink": "www.sumting.org/product/bamboo-for-forest-restoration",
           "projectimage": "",
           "projectmarker": "https://uploads-ssl.webflow.com/61b75f7704ba6b6a2966c019/61caf21ff0e4473d258b7870_Capa%201-2.png",
           "projectname":"Bamboo for forest Restoration"
         }
       },
       {
         "type": "Feature",
         "geometry": {
           "type": "Point",
           "coordinates": [
             -4.85807,
             55.80736
             
           ]
         },
         "properties": {
           "projectlink": "https://www.sumting.org/product/plant-a-tree-in-the-uk",
           "projectimage": "",
           "projectmarker": "https://uploads-ssl.webflow.com/61b75f7704ba6b6a2966c019/61caef99f16cb018a1ae4529_Group.png",
           "projectname":"Planting trees on the Brisbane Mains"
         }
       },
       {
         "type": "Feature",
         "geometry": {
           "type": "Point",
           "coordinates": [
             -4.649508,
             57.850405
             
           ]
         },
         "properties": {
           "projectlink": "https://www.sumting.org/product/restoring-aspen",
           "projectimage": "https://uploads-ssl.webflow.com/61bb086531e81a34127b71cf/6225ec401c6abe8441bdea8b_94f1dea7-2e11-4782-acdf-bbc44680ab8e_Beaver-2.jpg",
           "projectmarker": "https://uploads-ssl.webflow.com/61b75f7704ba6b6a2966c019/61caef99f16cb018a1ae4529_Group.png",
           "projectname":"Restoring Aspen"
         }
       },
       {
         "type": "Feature",
         "geometry": {
           "type": "Point",
           "coordinates": [
             39.367823,-4.714428
           ]
         },
         "properties": {
           "projectlink": "https://www.sumting.org/product/reefmodule-for-growing-biodiversity",
           "projectimage": "",
           "projectmarker": "https://uploads-ssl.webflow.com/61b75f7704ba6b6a2966c019/61caef990cb36b1397e3f070_Frame-6.png",
           "projectname":"Reefsystems"
         }
       },
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
           "marker": "https://uploads-ssl.webflow.com/61b75f7704ba6b6a2966c019/61caef956c8c4afb9f5b0825_Group%20141-2.png",
           "projectname":"Sumting Club"
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
   });

     function addMarkers() {
          /* For each feature in the GeoJSON object above: */
          for (const marker of stores.features) {
               /* Create a div element for the marker. */
               const el = document.createElement('img');
               /* Assign a unique `id` to the marker. */
               el.id = `marker-${marker.properties.id}`;
               /* Assign the `marker` class to each marker for styling. */
               el.className = 'marker';

               el.src = marker.properties.projectmarker;

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
        <h3 href="${currentFeature.properties.projectlink}">${currentFeature.properties.projectname}</h3>
        <img src="${currentFeature.properties.projectimage}" class="custom-popup-image">
       `)
       .addTo(map);
   }
