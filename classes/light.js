class Light {
	constructor(program, position, intensity) {
		this.program = program;
		this.position = position;
		this.intensity = intensity
	}

	render() {
		var pos = gl.getUniformLocation(this.program, "v_Light");
		gl.uniform4fv(pos, flatten(this.position));

		// sending light properties
		var ambient = gl.getUniformLocation(this.program, "light_Ambient");
		gl.uniform3fv(ambient, flatten(this.intensity.ambient));

		var diffuse = gl.getUniformLocation(this.program, "light_Diffuse");
		gl.uniform3fv(diffuse, flatten(this.intensity.diffuse));

		var specular = gl.getUniformLocation(this.program, "light_Specular");
		gl.uniform3fv(specular, flatten(this.intensity.specular));
	}

	rotate(angle) {
		this.position = mult_v(rotate(angle, vec3(0, 1, 0)), this.position);
	}
	navigate(position, intensity) {
		this.position = position; //Right vector
	}

}