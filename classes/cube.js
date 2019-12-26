class Cube extends _3DObject {
	constructor(program, position, img, size = 1) {
		super(program, position);
		this.position = position;
		this.size = size;
		this.img = img;
	}

	loadData() {
		var self = this;

		var generateVertices = () => {
			for (var x = -0.5; x <= 0.5; x += 1)
				for (var y = -0.5; y <= 0.5; y += 1)
					for (var z = -0.5; z <= 0.5; z += 1)
						self.vertices.push(vec4(x * self.size, y * self.size, z * self.size, 1.0));
		            	self.colors_data.push(VERTEX_COLORS[7])

		};

		var generateNormals = () => {
			for (var i in self.vertices) {
				self.normals.push(vec4(normalize(vec3(self.vertices[i])), 0.0));
			}
		};

		var generateIndices = () => {
			self.indices = [0, 2, 1, 1, 2, 3,
				4, 6, 5, 5, 6, 7,
				0, 1, 4, 4, 1, 5,
				2, 3, 6, 6, 3, 7,
				0, 4, 6, 6, 2, 0,
				1, 7, 5, 7, 1, 3
			];
		};

		generateVertices();
		generateNormals();
		generateIndices();
		self.imageSource = this.img
	}
}