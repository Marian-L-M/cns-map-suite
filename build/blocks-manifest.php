<?php
// This file is generated. Do not modify it manually.
return array(
	'map' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'cns-map-suite/map',
		'version' => '0.1.0',
		'title' => 'CNS Map',
		'category' => 'widgets',
		'icon' => 'location-alt',
		'description' => 'Embed an interactive canvas map created in the Maps admin.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'mapId' => array(
				'type' => 'integer',
				'default' => 0
			)
		),
		'textdomain' => 'cns-map-suite',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
