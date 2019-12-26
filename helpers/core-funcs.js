/** @description create texture 
 * @param gl
 * @param {image} img
 */

const loadTexture = (gl, img) => {
	const texture = gl.createTexture(); //specify texture
	const image = new Image();

	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); //assigning image to texture
		// gl.generateMipmap(gl.TEXTURE_2D); //use texture at multiple resolutions


		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		// gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);


	};

	image.src = img;
	image.crossOrigin = ''
	return texture;
}


/** @description normalize color to number that webgl understand
 * @param {number} color 
 */

const normalizeColor = (color) => {
	return color / 255
}
const nomralizeColorArray = (matrix) => {
	return vec4(matrix[0]/255, matrix[1]/255, matrix[2]/255, matrix[3]/255)
}


/** @description just reduce the size of hard copied code
 * @param {sphere} sphere object that created
 * @param {number} rotateSpeed rotation speed  
 */

// const renderSphere = (sphere, rotateSpeed) => {
// 	sphere.render()
// 	sphere.rotate(rotateSpeed)
// }


/** @description normalization canvas coordinates between -1 to 1 to webgl coordinates
 * @param {number} val selected coordinate that should be normalized
 * @param {number} max canvas witdth height max number
 * @param {number} min canvas starting point
 */


const handleNormalize = (val, max, min) => {
	res = 2 * ((val - min) / (max - min)) - 1;
	//  res = (val - ((min + max)/ 2)) / ((max - min) / 2) 
	return res
}

/** @description take mouse event arrange array
 * @param {MouseEvent} e
 * @return {vec3} arr [x,y,z]
 */


const handleGetVector = (e) => {
	var x = handleNormalize(e.clientX, this.canvas.width, 0)
	var y = handleNormalize(e.clientY, this.canvas.height, 0)
	var z = Math.sqrt(1 - Math.pow(x, 2) - Math.pow(y, 2))

	return normalize(vec3(-x, y, z))
}


/** @description makes click event simpler just function and id.
 * @param {string} id The id name of listener.
 * @param {void} func function what you want call
 */


const clickEvent = (id, func) => {
	return document.getElementById(id).onclick = () => {
		func()
	}
}


const mult_v = (m, v) => {
    if (!m.matrix) {
      return "trying to multiply by non matrix";
    }
  
    var result;
    if (v.length == 2) result = vec2();
    else if (v.length == 3) result = vec3();
    else if (v.length == 4) result = vec4();
  
    for (var i = 0; i < m.length; i++) {
      if (m[i].length != v.length)
        return "dimensions do not match";
  
      result[i] = 0;
      for (var j = 0; j < m[i].length; j++)
        result[i] += m[i][j] * v[j];
    }
    return result;
  }

  handleChangeSelect = () => {
	var x = document.getElementById("mySelect").selectedIndex;
	var y = document.getElementById("mySelect").options;
	var value = y[x].text;
	selectedPlanet = value

}



/** @description  rendering all planets taked values from planets object, it was declared as a constant, in objects page
 * @param {object} planets object, all main paramaters that used for initialising sphere class to create planet object
 * @param {number} speed speed foor planet rotataton itself
 * @param {number} speed2 speed for rotation around sun
 */

const renderPlanets = (planets, speed, speed2) => {
	Object.entries(planets).forEach(([key, value]) => {
		renderOnePlanet(value.object, value.rotationSpeedItself, value.rotationSpeedAroundSun, speed, speed2, key)
	});
}


/** @description takes each planet and updadding some values like speed of rotataions, and trackball only specified planet first need select then rotate, in addition highlighting selected planet
 *@param {number} planet speed for rotation around sun
 * @param {number} speedAroundItself speed for rotation around sun takes own rotation speed from object
 * @param {number} speedAroundSun speed for rotation around sun takes own rotation speed from objec
 *  @param {number} speed speed foor planet rotataton itself to increase decrease
 * @param {number} speed2 speed for rotation around sun to increase decrease
 */

const renderOnePlanet = (planet, speedAroundItself, speedAroundSun, speed, speed2, key) => {
	var currentPosition = planet.getCurrentPos();
	planet.translate(multiplication(currentPosition, -1));
	if (key === selectedPlanet) {
		planet.rotate(speed * speedAroundItself)

	} else {
		if (!pauseStatus || selectedPlanet === 'default - All') {
			planet.rotate(speed * speedAroundItself)
		} else {
			planet.rotate(speedAroundItself)
		}

	}
	if (key === selectedPlanet) {
		planet.trackBall(this.trackBall.u, this.trackBall.v, speed * this.trackBall.angle, this.trackBall.selected)
		if (key !== 'sun') {
			planet.material.diffuse = vec3(0.5, 0.5, 0.5),
				planet.material.ambient = vec3(1.5, 1.5, 1.5),
				planet.material.specular = vec3(4, 4, 4)
		}
		
	} else if (key !== 'sun') {
		planet.material.diffuse = vec3(0.3, 0.6, 0.5)
		planet.material.ambient = vec3(1.0, 1.0, 1.0)
		planet.material.specular = vec3(0.0, 0.0, 0.0)
	}
	planet.translate(currentPosition)
	if (key === selectedPlanet) {
		planet.rotate(speed2 * speedAroundSun)
	} else {
		if (!pauseStatus || selectedPlanet === 'default - All') {
			planet.rotate(speed2 * speedAroundSun)

		} else {
			planet.rotate(speedAroundSun)

		}

	}
	planet.render()
}


/** @description  initialising all planets (sphere)
 * @param {program} id progam
 * @param {object} planets function what you want call
 * texture images sources are sended from there to 3d object class
 */
const initPlanets = (program, planets) => {
	Object.entries(planets).forEach(([key, value]) => {
		planets[key].object = new Sphere(program, value.currentPosition, value.radius)
		planets[key].object.img = value.texture_source;
		planets[key].object.init()
	});
}