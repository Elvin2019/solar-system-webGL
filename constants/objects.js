var cameraNavigation = {
	cameraPosition: vec3(-16, 4.0, 0.0), // right
	cameraFront: vec3(1.0, 0.0, 0.0), // target
	cameraUp: vec3(0.0, 1.0, 0.0), // direction
	cameraSpeed: 0.2,

}
const multiplication = (matrix, speed) => {
	return vec3(matrix[0] * speed, matrix[1] * speed, matrix[2] * speed)
}

var vertices_data = []
var colors_data = []
const handleAddVertices = (x, y) => {
	vertices_data.push(vec3(x, y, 0.0));
	var index = vertices_data.length % VERTEX_COLORS.length;
	colors_data.push(VERTEX_COLORS[index]);
};


var source_light = {
	ambient: vec3(1.0, 1.0, 1.0),
	diffuse: vec3(1.0, 1.0, 1.0),
	specular: vec3(1.0, 1.0, 1.0)
}

var spot_light = {
	ambient: vec3(0.1, 0.1, 0.1),
	diffuse: vec3(0.1, 0.1, 0.1),
	specular: vec3(2, 2, 2)
}
const ONE_DAY_SPEED = -0.5
const ONE_YEAR_SPEED = -0.1

var camera;
var light, lightWithCamera;
var cube;
var planets = {
	sun: {
		object: null,
		rotationSpeedAroundSun: -0.02,
		rotationSpeedItself: -0.02 * 2,
		currentPosition: vec3(0.0, 0.0, 0.0),
		texture_source: './texture-images/2k_sun.jpg',
		radius: 1.5,

	},
	mercury: {
		object: null,
		rotationSpeedAroundSun: ONE_DAY_SPEED / (88 / 365) / 10, //88 days 
		rotationSpeedItself: ONE_DAY_SPEED / 58, //58 days
		currentPosition: vec3(0.0, 0.0, -1.8),
		texture_source: './texture-images/2k_mercury.jpg',
		radius: 0.25,
	},
	venus: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / (225 / 365), //225 days
		rotationSpeedItself: ONE_DAY_SPEED / 243, //243 days
		currentPosition: vec3(0.0, 0.4, -2.6),
		texture_source: './texture-images/2k_venus_surface.jpg',
		radius: 0.4

	},
	earth: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED, //365 days
		rotationSpeedItself: ONE_DAY_SPEED, //1 day
		currentPosition: vec3(0.0, 0.0, -3.7),
		texture_source: './texture-images/2k_earth_daymap.jpg',
		radius: 0.5

	},
	moon: {
		object: null,
		rotationSpeedAroundSun: -0.06,
		rotationSpeedItself: ONE_DAY_SPEED / 27.32, //27.32 days
		currentPosition: vec3(0.0, 1.0, -4.0),
		texture_source: './texture-images/2k_moon.jpg',
		radius: 0.2,

	},
	mars: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / (687 / 365), //687 days
		rotationSpeedItself: ONE_DAY_SPEED / 1.03, //1.03 days	
		currentPosition: vec3(0.0, 1.0, -4.0),
		texture_source: './texture-images/2k_mars.jpg',
		radius: 0.45,

	},
	jupiter: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / 12, //(12 * 365 ) days
		rotationSpeedItself: ONE_DAY_SPEED / 0.41, //0.41 days	
		currentPosition: vec3(0.0, 0.3, 6.2),
		texture_source: './texture-images/2k_jupiter.jpg',
		radius: 1,

	},
	saturn: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / 29, //(29 * 365) days
		rotationSpeedItself: ONE_DAY_SPEED / 0.45, //0.45 days	
		currentPosition: vec3(10.0, 1.5, 1.2),
		texture_source: './texture-images/2k_saturn.jpg',
		radius: 0.9

	},
	uranus: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / 84, //(84 * 365) days
		rotationSpeedItself: ONE_DAY_SPEED / 0.72, //0.72 days	
		currentPosition: vec3(0.0, -0.2, -10.0),
		texture_source: './texture-images/2k_uranus.jpg',
		radius: 0.7

	},
	neptune: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / 164, //164 years
		rotationSpeedItself: ONE_DAY_SPEED / 0.67, //0.67 days	
		currentPosition: vec3(-11.0, 1, -0.8),
		texture_source: './texture-images/2k_neptune.jpg',
		radius: 0.68

	},
	pluto: {
		object: null,
		rotationSpeedAroundSun: ONE_YEAR_SPEED / 248, //248 years
		rotationSpeedItself: ONE_DAY_SPEED / 6.39, //6.39 days	
		currentPosition: vec3(0.0, -0.2, -13.0),
		texture_source: './texture-images/2k_pluto.jpg',
		radius: 0.6
	},
}


var belt;
var flag = false
var pitch = 0.0 // pitch is the angle that depicts how much we're looking up or down
var yaw = 0.0 //the yaw value which represents the magnitude we're looking to the left or to the right
var lastClientX;
var lastClientY;
var selectedPlanet = 'default - All';
var speed = 1,
	speed2 = 1;
var pauseStatus = true;

var trackBall = {
	u: vec3(1, 1, 1),
	v: vec3(1, 1, 1),
	selected: false,
	angle: 0,
	radian: 0
}