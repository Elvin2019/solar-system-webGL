class Camera {
	constructor(program, position, target, up) {
		this.program = program;
		this.position = position; //Right vector
		this.target = target; // Direction vector
		this.up = up; //  Up vector
		
	}

	render() {
		var pos = gl.getUniformLocation(this.program, "v_Camera");
		gl.uniform4fv(pos, flatten(vec4(this.position, 1.0)));


		var view = gl.getUniformLocation(this.program, "m_View");
		var matView = lookAt(this.position, this.target, this.up);
		gl.uniformMatrix4fv(view, false, flatten(matView));

		var proj = gl.getUniformLocation(this.program, "m_Proj");
		var matProj = perspective(90, 1.0, 0.0001, 1000);
		gl.uniformMatrix4fv(proj, false, flatten(matProj));
	}

	rotate(angle) {
		this.position = vec3(mult_v(rotate(angle, vec3(0, 1, 0)), vec4(this.position)));
	}
	navigate(position, target, up) {
		this.position = position; //Right vector
		this.target = target; // Direction vector
		this.up = up; // up vector
		// console.log(this.target)
	}
}