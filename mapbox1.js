mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtbXlvc3VtdGluZyIsImEiOiJja3llbHd2c2YwdDNuMnZxaG50cGlzNjk5In0.9CFGWGiyXWZxzon6ENAYeA';

     const map = new mapboxgl.Map({
       container: 'map',
       style: 'mapbox://styles/sumting/ckzgwchr2000116lcvusqd79j',
       center: [40.594, 14.447],
       zoom: 0.8,
       scrollZoom: true
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
           "projectmarker": "https://d354cgj0llpu6u.cloudfront.net/roberto-sorin-RS0-h_pyByk-unsplash.jpg",
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
          "projectmarker": "https://innovationorigins.com/app/uploads/2021/03/2020Blokkendam-304-2048x1367.jpg",
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
       zoom: 13
     });
   }

   function createPopUp(currentFeature) {
     const popUps = document.getElementsByClassName('mapboxgl-popup');
     /** Check if there is already a popup on the map and if so, remove it */
     if (popUps[0]) popUps[0].remove();

     const popup = new mapboxgl.Popup({ closeOnClick: false })
  
     popup.setLngLat(currentFeature.geometry.coordinates)
       .setHTML(`<h3><a href="${currentFeature.properties.projectlink}">${currentFeature.properties.projectname}</a></h3>`)
       .addTo(map);
        
    console.log(`${currentFeature.properties.projectimage}`);

    console.log("1");

     document.getElementsByClassName('mapboxgl-popup-content')[0].style.backgroundImage=`url('${currentFeature.properties.projectimage}')`;
     document.getElementsByClassName('marker')[0].style.backgroundImage=`url('${currentFeature.properties.projectillustration}')`;
   }
