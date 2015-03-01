var GeometryGenerator = {

	createString : function(items, restD, k) {
		var nodes = new Array();
		var springs = new Array();
		items.forEach(function(item) {
			nodes.push(new Node2D(item[0], item[1], item[2]));
		})
		nodes.forEach(function(node, i) {
			if(i !== nodes.length-1) {
				springs.push(new Spring2D(nodes[i], nodes[i+1], restD, k));
			}
		})
		return {
			Nodes : nodes,
			Springs : springs
		};
	},

	createPendulum : function(x1, y1, m1, x2, y2, m2, restD, k) {
		var nodes = new Array();
		var springs = new Array();

		var n1 = new Node2D(x1, y1, m1);
		var n2 = new Node2D(x2, y2, m2);
		nodes.push(n1);
		nodes.push(n2);

		springs.push(new Spring2D(n1, n2, restD, k));

		return {
			Nodes : nodes,
			Springs : springs
		};
	},

	createCircle : function(cx, cy, r, count, cm, m, restD1, restD2, k) {
		var circle = new Array();
		var springs = new Array();

		var c = new Node2D(cx, cy, cm);

		var step = (Math.PI * 2) / count;

		for (var i = 0; i < count; i++) {
			var t = i * step;
			var temp = new Node2D(cx + r * Math.sin(t), cy + r * Math.cos(t), m);
			circle.push(temp);
		}

		for (var i = 0; i < circle.length - 1; i++) {
			var spr = new Spring2D(circle[i], circle[i + 1], restD2, k);
			springs.push(spr);
		}

		for (var i = 0; i < circle.length; i++) {
			spr2 = new Spring2D(circle[i], c, restD1, k);
			springs.push(spr2);
		}

		var sprr = new Spring2D(circle[0], circle[circle.length - 1], restD2, k);
		springs.push(sprr);

		circle.push(c);

		return {
			Nodes : circle,
			Springs : springs
		};
	},

	createMesh : function(px, py, w, h, dx, dy, m, restD1, restD2, k) {
		var mesh = new Array();
		var springs = new Array();

		// Creating nodes
		for (var y = 1; y <= h; y++) {
			for (var x = 1; x <= w; x++) {
				var temp = new Node2D(px + x * dx, py + y * dy, m);
				mesh.push(temp);
			}
		}

		for (var i = 0; i < w - 1; i++) {
			for (var j = 0; j < h; j++) {
				var spr1 = new Spring2D(mesh[i + w * j], mesh[i + 1 + w * j], restD1, k);
				springs.push(spr1);
			}
		}

		for (var i = 0; i < h - 1; i++) {
			for (var j = 0; j < w; j++) {
				var spr2 = new Spring2D(mesh[i * w + j], mesh[(i + 1) * w + j], restD1, k);
				springs.push(spr2);
			}
		}

		// Diagonally

		//      \

		for (var y = 0; y < h - 1; y++) {
			for (var x = 0; x < w - 1; x++) {
				var spr = new Spring2D(mesh[x + y * w], mesh[x + (y + 1) * w + 1], restD2, k);
				springs.push(spr);
			}
		}

		//      /
		for (var y = 0; y < h - 1; y++) {
			for (var x = 1; x < w; x++) {
				var spr = new Spring2D(mesh[x + y * w], mesh[x + (y + 1) * w - 1], restD2, k);
				springs.push(spr);
			}
		}

		return {
			Nodes : mesh,
			Springs : springs
		};
	}
}
