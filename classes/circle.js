

class Circle {
  constructor(program, position, vertices_data, colors_data) {
    this.program = program;
    this.position = position;
    this.vertices_data = vertices_data
    this.colors_data = colors_data
  }
  

  init() {
    this.bufVertex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertex);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices_data), gl.STATIC_DRAW, 0, 4 * this.vertices_data.length);

    this.cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors_data), gl.STATIC_DRAW, 0, 3 * this.colors_data.length);


  }
  render(){
    var pos = gl.getAttribLocation(this.program, 'v_Pos');
    gl.vertexAttribPointer(pos, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos);

    var vColor = gl.getAttribLocation(this.program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

     gl.drawArrays( gl.TRIANGLE_FAN, 0,  vertices_data.length ); //gl Points size is 10.0  gl.TRIANGLES GL.TRIANGLES_FAN

  }

}
