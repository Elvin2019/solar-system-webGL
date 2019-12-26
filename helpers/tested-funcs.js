const getHeightData = (img) => {
	var canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 128;
	var context = canvas.getContext('2d');

	var size = 128 * 128,
		data = new Float32Array(size);

	context.drawImage(img, 0, 0);

	for (var i = 0; i < size; i++) {
		data[i] = 0
	}

	var imgd = context.getImageData(0, 0, 128, 128);
	var pix = imgd.data;

	var j = 0;
	for (var i = 0, n = pix.length; i < n; i += (4)) {
		var all = pix[i] + pix[i + 1] + pix[i + 2];
		data[j++] = all / 30;
	}

	return data;
}


const drawObject = (object) => { // this is general drawing part for each object

	//setup Buffers of this object
	gl.bindBuffer(gl.ARRAY_BUFFER, object.vBuffer);
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, object.tBuffer);
	gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, object.nBuffer);
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(vNormal);

	if (object.position) { // we can translate object by change model matrix
		object.modelMatrix = translate(object.position);
	}

	gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(object.modelMatrix)); //and store model matrix to shader

	object.material.bind(); // in this function, we pass current material to shader

	gl.drawArrays(gl.TRIANGLES, 0, object.vertexCount); //draw all triangles
}