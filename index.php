<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<title>C4 World Map</title>
		
		<link href="leaflet/leaflet.css" rel="stylesheet">
		<link href="leaflet/leaflet-search/leaflet-search.min.css" rel="stylesheet">
		<link href="leaflet/leaflet-search/leaflet-search.mobile.min.css" rel="stylesheet">
		<style type="text/css">
			html, body
			{
				height: 100%;
				margin: 0;
			}
			
			#map
			{
				width: 100%;
				height: 100%;
			}
			
			.tooltip-content
			{
				font-size: 13px;
				font-weight: bold;
				white-space: normal;
				width: 300px;
			}
		</style>
	</head>
	<body>
		<div id="map">
		</div>
		
		<!-- Load scripts after page content loaded -->
		<script src="leaflet/leaflet.js"></script>
		<script src="leaflet/leaflet-search/leaflet-search.src.js"></script>
		<script src="l2raid-map.js"></script>
	</body>
</html>
	