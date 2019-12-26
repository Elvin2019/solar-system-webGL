var canvas;
var gl;



window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas, {
		preserveDrawingBuffer: true
	});
	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);

	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//camera initialised need to navigate , eye, at, up
	camera = new Camera(program, vec3(4, 3.5, 4), vec3(0, 0, 0), vec3(0, 1, 0));
	light = new Light(program, vec4(1, 4.5, 1, 1), this.source_light);

	lightWithCamera = new Light(program, vec4(1, 4.5, 1, 1), this.spot_light)

	initPlanets(program, planets)

	this.planets.sun.object.material.ambient = vec3(2, 3, 3);
	this.planets.sun.object.material.diffuse = vec3(3, 3, 1)
	this.planets.sun.object.material.specular = vec3(1, 1, 1)
	this.planets.sun.object.material.shininess = 32.0;


	// this.planets.earth.object.material.ambient = vec3(1, 1, 1);


	var slider = document.getElementById("speedAroundItself");
	var slider2 = document.getElementById("speedAroundSun");
	// var slider3 = document.getElementById("radius");


	var output = document.getElementById("demo");
	var output2 = document.getElementById("demo2");
	// var output3 = document.getElementById("demo3");


	output.innerHTML = slider.value;
	output2.innerHTML = slider2.value;
	// output3.innerHTML = slider3.value


	slider.oninput = function () {
		output.innerHTML = this.value;
	}
	slider2.oninput = function () {
		output2.innerHTML = this.value;
	}
	// slider3.oninput = function () {
	// 	output3.innerHTML = this.value;
	// }

	document.getElementById("speedAroundItself").onchange = (event) => {

		speed = event.target.value

	};

	document.getElementById("speedAroundSun").onchange = (event) => {

		speed2 = event.target.value

	}
	//  document.getElementById("radius").onchange = (event) => {
	// 		radius = event.target.value
	// };


	/**
	 * @referenced https://learnopengl.com/Getting-started/Camera 
	 * @used readed
	 */


	//forward
	const arrowUpPressed = () => {
		const distance = multiplication(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = add(this.cameraNavigation.cameraPosition, distance)

	}

	//backward
	const arrowDownPressed = () => {
		const distance = multiplication(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = subtract(this.cameraNavigation.cameraPosition, distance)
	}

	//left
	const arrowLeftPressed = () => {
		const left = normalize(cross(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraUp))
		const distance = multiplication(left, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = subtract(this.cameraNavigation.cameraPosition, distance)
	}

	//right
	const arrowRightPressed = () => {
		const left = normalize(cross(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraUp))
		const distance = multiplication(left, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = add(this.cameraNavigation.cameraPosition, distance)
	}

	//up
	const pageUpPressed = () => {
		const left = cross(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraUp)
		const up = normalize(cross(left, this.cameraNavigation.cameraFront))
		const distance = multiplication(up, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = add(this.cameraNavigation.cameraPosition, distance)
	}

	//down
	const pageDownPressed = () => {
		const left = cross(this.cameraNavigation.cameraFront, this.cameraNavigation.cameraUp)
		const up = normalize(cross(left, this.cameraNavigation.cameraFront))
		const distance = multiplication(up, this.cameraNavigation.cameraSpeed)
		this.cameraNavigation.cameraPosition = subtract(this.cameraNavigation.cameraPosition, distance)
	}

	const pausePressed = () => {
		if (this.pauseStatus) {
			speed = 0 //around itself
			speed2 = 0 //around sun
			this.pauseStatus = false
		} else {
			this.pauseStatus = true
			speed = 1
			speed2 = 1 //around sun
		}
	}

	clickEvent('left', arrowLeftPressed)
	clickEvent('left1', arrowLeftPressed)


	clickEvent('forward', arrowUpPressed)
	clickEvent('forward1', arrowUpPressed)


	clickEvent('right', arrowRightPressed)
	clickEvent('right1', arrowRightPressed)


	clickEvent('backward', arrowDownPressed)
	clickEvent('backward1', arrowDownPressed)


	clickEvent('up', pageUpPressed)
	clickEvent('up1', pageUpPressed)

	clickEvent('down', pageDownPressed)
	clickEvent('down1', pageDownPressed)

	clickEvent('pause', pausePressed)


	document.onkeydown = (event) => {
		switch (event.key) {
			case ('ArrowUp'):
			case ('w'):
				arrowUpPressed();
				break;
			case 'ArrowDown':
			case 's':
				arrowDownPressed();
				break;
			case 'ArrowLeft':
			case 'a':
				arrowLeftPressed();
				break;
			case 'ArrowRight':
			case 'd':
				arrowRightPressed();
				break;
			case 'PageUp':
			case 'z':
				pageUpPressed();
				break;
			case 'PageDown':
			case 'x':
				pageDownPressed();
				break;
			case 'p':
				pausePressed();
				break;
		}
	}

	document.onwheel = (event) => {
		event.deltaY < 0 ? arrowUpPressed() : arrowDownPressed();
	}


	//trackball and camera direction is implemented 
	canvas.addEventListener('mousedown', (event) => {
		this.cameraNavigation.cameraPosition
		lastClientX = event.clientX
		lastClientY = event.clientY
		flag = true

		
		//normalization x an y coordinates
		var point = uiUtils.pixelInputToCanvasCoord(event, canvas);

		//that case sometimes can not read pixels correcty
		var x = event.clientX;
		var y = canvas.height - event.clientY;


		var pixels = new Uint8Array(4);
		gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);


		if (pixels[3] === 255 && this.selectedPlanet !== null) {
			this.trackBall.v = handleGetVector(event)
			this.trackBall.selected = true
			console.log("sphere selected!");
			// selectedPlanet = 'sun'
		} else {
			this.trackBall.selected = false
		}



	})
	canvas.addEventListener('mouseup', () => {
		flag = false
		this.trackBall.selected = false
	})
	canvas.addEventListener('mouseleave', () => {
		flag = false
		this.trackBall.selected = false
	})

	canvas.addEventListener('mousemove', (event) => {
		if (this.trackBall.selected && this.selectedPlanet !== null) {
			this.trackBall.radian = Math.acos(dot(this.trackBall.u, this.trackBall.v))
			this.trackBall.angle = this.trackBall.radian * (180 / Math.PI)
			this.trackBall.u = handleGetVector(event)
		} else {
			if (!this.flag) {
				return
			} else {

				var xOffset = event.clientX - lastClientX;
				var yOffset = event.clientY - lastClientY;
				this.lastClientX = event.clientX
				this.lastClientY = event.clientY

				var sensitivity = 0.1;

				xOffset *= sensitivity;
				yOffset *= sensitivity;


				yaw += xOffset;
				pitch += yOffset;

				if (pitch > 90.0) {
					pitch = 90.0;
				}
				if (pitch < -90.0) {
					pitch = -90.0;
				}

				this.cameraNavigation.cameraFront = normalize(vec3(Math.cos(radians(yaw)) * Math.cos(radians(pitch)), Math.sin(radians(pitch)), Math.sin(radians(yaw)) * Math.cos(radians(pitch))))
			}
		}
		// console.log(this.cameraNavigation)

	})




	render();
}

//all maoin things 
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	camera.render();
	light.render();
	camera.navigate(cameraNavigation.cameraPosition, add(cameraNavigation.cameraPosition, cameraNavigation.cameraFront), cameraNavigation.cameraUp)
	renderPlanets(this.planets, speed, speed2)
	requestAnimFrame(render);
}


