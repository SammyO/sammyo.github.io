mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtbXlvc3VtdGluZyIsImEiOiJja3llbHd2c2YwdDNuMnZxaG50cGlzNjk5In0.9CFGWGiyXWZxzon6ENAYeA';

     const map = new mapboxgl.Map({
       container: 'map',
       style: 'mapbox://styles/sumting/ckzgwchr2000116lcvusqd79j',
       center: [0.0, 0.0],
       zoom: 0.3,
       scrollZoom: true
   });

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add max zoom level
var options = {
  maxZoom: 18};

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
           "projectname":"Sumting Club",
           "projectpage": "sdv",
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
           "phoneFormatted": "(202) 507-8357",
           "phone": "2025078357",
           "address": "2221 I St NW",
           "city": "Washington DC",
           "country": "United States",
           "crossStreet": "at 22nd St NW",
           "postalCode": "20037",
           "state": "D.C."
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
     map.addLayer({
       id: 'locations',
       type: 'circle',
       /* Add a GeoJSON source containing place coordinates and information. */
       source: {
         type: 'geojson',
         data: stores
       }
     });
     buildLocationList(stores);
   });

   map.on('click', (event) => {
     /* Determine if a feature in the "locations" layer exists at that point. */
     const features = map.queryRenderedFeatures(event.point, {
       layers: ['locations']
     });

     /* If it does not exist, return */
     if (!features.length) return;

     const clickedPoint = features[0];

     /* Fly to the point */
     flyToStore(clickedPoint);

     /* Close all other popups and display popup for clicked store */
     createPopUp(clickedPoint);

     /* Highlight listing in sidebar (and remove highlight for all other listings) */
     const activeItem = document.getElementsByClassName('active');
     if (activeItem[0]) {
       activeItem[0].classList.remove('active');
     }
     const listing = document.getElementById(
       `listing-${clickedPoint.properties.id}`
     );
     listing.classList.add('active');
   });


   function buildLocationList(stores) {
     for (const store of stores.features) {
       /* Add a new listing section to the sidebar. */
       const listings = document.getElementById('listings');
       const listing = listings.appendChild(document.createElement('div'));
       /* Assign a unique `id` to the listing. */
       listing.id = `listing-${store.properties.id}`;
       /* Assign the `item` class to each listing for styling. */
       listing.className = 'item';

       /* Add the link to the individual listing created above. */
       const link = listing.appendChild(document.createElement('a'));
       link.href = '#';
       link.className = 'title';
       link.id = `link-${store.properties.id}`;
       link.innerHTML = `${store.properties.address}`;

       /* Add details to the individual listing. */
       const details = listing.appendChild(document.createElement('div'));
       details.innerHTML = `${store.properties.city}`;
       if (store.properties.phone) {
         details.innerHTML += ` · ${store.properties.phoneFormatted}`;
       }
       if (store.properties.distance) {
         const roundedDistance = Math.round(store.properties.distance * 100) / 100;
         details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
       }


       link.addEventListener('click', function () {
         for (const feature of stores.features) {
           if (this.id === `link-${feature.properties.id}`) {
             flyToStore(feature);
             createPopUp(feature);
           }
         }
         const activeItem = document.getElementsByClassName('active');
         if (activeItem[0]) {
           activeItem[0].classList.remove('active');
         }
         this.parentNode.classList.add('active');
       });

     }
   }
   function flyToStore(currentFeature) {
     map.flyTo({
       center: currentFeature.geometry.coordinates,
       zoom: 17.7
     });
   }

   function createPopUp(currentFeature) {
     const popUps = document.getElementsByClassName('mapboxgl-popup');
     /** Check if there is already a popup on the map and if so, remove it */
     if (popUps[0]) popUps[0].remove();

     const popup = new mapboxgl.Popup({ closeOnClick: false })
       .setLngLat(currentFeature.geometry.coordinates)
       .setHTML(`<h3>Sweetgreen</h3><h4>${currentFeature.properties.projectname}</h4>`)
       .addTo(map);
   }
     
