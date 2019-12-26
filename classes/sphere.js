class Sphere extends _3DObject {
	constructor(program, position, radius = 1, N = 50, M = 50) {
		super(program, position);
		this.position = position;
		this.radius = radius;
		this.N = N;
		this.M = M;
	}

	loadData() {
		var self = this;

		var generateVertices = function (N, M) {
			for (var i = 0; i < N; i++) {
				var alfa = i * Math.PI / (N - 1) - Math.PI / 2;
			
				for (var j = 0; j < M; j++) {
					var beta = j * 2 * Math.PI / M;

					var x = self.radius * Math.cos(alfa) * Math.cos(beta);
					var y = self.radius * Math.sin(alfa);
					var z = self.radius * Math.cos(alfa) * Math.sin(beta);
					var s = j/M;
					var t = i/M; 
					//bump map cords
					var x1 = Math.cos(beta + Math.PI / 2)
					var y1 = 0;
					var z1 = Math.sin(beta + Math.PI /2)
					self.vertices.push(vec4(x, y, z, 1.0));
					self.texCoordsArray.push(vec2(s, t)) //assiging texture coordinates to vertices

					self.colors_data.push(VERTEX_COLORS[3])
				}
			}
		};

		var generateNormals = function (N, M) {
			for (var i in self.vertices) {
				self.normals.push(vec4(normalize(vec3(self.vertices[i])), 0.0));
			}
		};

		var generateIndices = function (N, M) {
			const index = (i, j) => {
				return i * M + j;
			}

			for (var i = 0; i < N - 1; i++)
				for (var j = 0; j < M; j++) {
					self.indices.push(index(i, j));
					self.indices.push(index(i, (j + 1) % M));
					self.indices.push(index(i + 1, j));
					self.indices.push(index(i, (j + 1) % M));
					self.indices.push(index(i + 1, (j + 1) % M));
					self.indices.push(index(i + 1, j));
				}
		};

		generateVertices(this.N, this.M);
		generateNormals(this.N, this.M);
		generateIndices(this.N, this.M);

		

	}
}