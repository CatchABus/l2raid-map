/**
 * L2Raid-Map. A Raid Boss interactive map for Lineage2 websites.
 *
 * Author: DnR
 * Version: 1.0 - 20-09-2019
 * Chronicle: C4 Scions of Destiny
 *
 * Description: This map can display raid boss locations according to 
 * retail co-ordinates.
 *
 * This is based on Leaflet JS, an open-source JavaScript library
 * for mobile-friendly interactive maps.
 */


/**
 * Shift by, defines number of regions note, shifting by 15 will result in regions
 * corresponding to map tiles shifting by 12 divides one tile to 8x8 regions.
 */
const SHIFT_BY = 12;
const TILE_SIZE = 32768;

/** Map dimensions */
const TILE_X_MIN = 16;
const TILE_Y_MIN = 10;
const TILE_X_MAX = 26;
const TILE_Y_MAX = 25;
const TILE_ZERO_COORD_X = 20;
const TILE_ZERO_COORD_Y = 18;
const MAP_MIN_X = (TILE_X_MIN - TILE_ZERO_COORD_X) * TILE_SIZE;
const MAP_MIN_Y = (TILE_Y_MIN - TILE_ZERO_COORD_Y) * TILE_SIZE;
const MAP_MAX_X = ((TILE_X_MAX - TILE_ZERO_COORD_X) + 1) * TILE_SIZE;
const MAP_MAX_Y = ((TILE_Y_MAX - TILE_ZERO_COORD_Y) + 1) * TILE_SIZE;

/** World Map Bounds */
const BOUNDS = [[MAP_MIN_Y, MAP_MIN_X], [MAP_MAX_Y, MAP_MAX_X]];

// Marker icon for DEAD raid bosses
const redIcon = L.icon(
{
	iconUrl: 'leaflet/images/marker-red-icon.png',
	iconRetinaUrl: 'leaflet/images/marker-red-icon-2x.png',
	shadowUrl: 'leaflet/images/marker-shadow.png',
	iconSize:    [25, 41],
	iconAnchor:  [12, 41],
	popupAnchor: [1, -34],
	tooltipAnchor: [16, -28],
	shadowSize:  [41, 41]
});

// Initialize map
const map = L.map('map', {crs: L.CRS.Simple, maxBoundsViscosity: 1, zoomDelta: 0.5, zoomSnap: 0.5, attributionControl: false, markerZoomAnimation: false});
// Set l2 map overlay
L.imageOverlay("maps/C4.jpg", BOUNDS).addTo(map);

// Map bounds
map.fitBounds(BOUNDS);
map.setMaxBounds(BOUNDS);

// Scale map (done mostly for larger screens)
resizeMapContent();

// Map resize listener
window.onresize = function()
{
	map.invalidateSize();
	
	// Scale map (done mostly for larger screens)
	resizeMapContent();
};

// Finally, generate a group of markers
generateMarkers();

/**
 * Generates markers using raid boss data retrieved from database.
 */
function generateMarkers()
{
	let xhttp = new XMLHttpRequest();
	xhttp.onloadend = function()
	{
		if (this.status === 200)
		{
			if (this.responseText)
			{
				// This group will contain all markers
				let pointGroup = L.layerGroup();

	 			let data = JSON.parse(this.responseText);
	 			for (let obj of data)
	 			{
	 				/**
					 * This is done because leaflet simple CRS uses bottom-left as pixel origin.
					 * If we change its pixel origin, couple of minor things will get broken.
					 */
					let point = L.CRS.Simple.transformation.transform(L.point(obj.loc_x, obj.loc_y));
					// y - latitude, x - longitude
					let marker = L.marker([point.y, point.x], {title: obj.name, riseOnHover: true});
					
					let tooltipContent = '<div class="tooltip-content">';
					tooltipContent += '<div>Boss Name: ' + obj.name + '</div>';
					tooltipContent += '<div>Status: ' + (obj.respawn_time > 0 ? '<span style="color: red">DEAD</span>' : '<span style="color: green">ALIVE</span>') + '</div>';
					if (obj.respawn_time > 0)
					{
						marker.setIcon(redIcon);
						tooltipContent += '<div>Next Respawn At: ' + new Date(obj.respawn_time) + '</div>';
					}
					tooltipContent += '</div>';
					
					// Create marker tooltip and add both to map
					marker.bindTooltip(tooltipContent).addTo(pointGroup);
	 			}

	 			// Now that layer is completed, add it to map
				map.addLayer(pointGroup);

				// Finally, add control to search for raid bosses by name
				map.addControl(new L.Control.Search({layer: pointGroup, zoom: map.getZoom()}));
	 		}
		}
		else
		{
			alert("Connection failed!");
		}
	};
	xhttp.open("GET", "ajax.php", true);
	xhttp.send();
}

/**
 * Handles map resize in case map is larger than overlay.
 */
function resizeMapContent()
{
	// Reset minimum zoom to -100 for proper bounds zoom calculation
	map.setMinZoom(-100);
	let boundZoom = map.getBoundsZoom(BOUNDS, true);
	map.setMinZoom(boundZoom);
	map.setZoom(boundZoom);
}