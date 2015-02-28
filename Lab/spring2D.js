function Spring2D(node1_, node2_, restDistance, k) {
	this.b = 0.03;

	this.node1 = node1_;
	this.node2 = node2_;

	this.isString = false;

	if (!k)
		this.k = -1;
	else
		this.k = k;

	// If rest distance isn't defined then use the real distance between two the nodes
	if (restDistance)
		this.d = restDistance;
	else
		this.d = VecOp.distanceV2(node1_.p, node2_.p);

	this.update = function() {
		//     F = -k(|x|-d)(x/|x|) - bv

		// Vector2 F1 = -k * (xAbs - d) * (Vector2.Normalize(node2.p - node1.p) / xAbs) - b * (node1.v - node2.v);
		// Vector2 F2 = -k * (xAbs - d) * (Vector2.Normalize(node1.p - node2.p) / xAbs) - b * (node2.v - node1.v);

		//var F1 = sub(sub(node1.p, node2.p).normalize().divide(xAbs).mult(-k * (xAbs - d)), sub(node1.v, node2.v).mult(-b));
		//var F1 = sub(sub(node2.p, node1.p).normalize().divide(xAbs).mult(-k * (xAbs - d)), sub(node2.v, node1.v).mult(-b));

		var node1 = this.node1;
		var node2 = this.node2;
		var k = this.k;
		var d = this.d;
		var b = this.b;

		var xAbs = VecOp.distanceV2(node1.p, node2.p);

		if (this.isString && xAbs < this.d)
			return;

		var norm1 = VecOp.subV2(node2.p, node1.p).normalize();
		var norm2 = VecOp.subV2(node1.p, node2.p).normalize();
		var v1 = VecOp.subV2(node1.v, node2.v);
		var v2 = VecOp.subV2(node2.v, node1.v);

		var F1x = -k * (xAbs - d ) * (norm1.x / xAbs) - b * v1.x;
		var F1y = -k * (xAbs - d ) * (norm1.y / xAbs) - b * v1.y;

		var F2x = -k * (xAbs - d ) * (norm2.x / xAbs) - b * v2.x;
		var F2y = -k * (xAbs - d ) * (norm2.y / xAbs) - b * v2.y;

		// Add acceleration. Updating velocity\positions should happen after all springs are updated
		node1.a.x += F1x / node1.m;
		node1.a.y += F1y / node1.m;

		node2.a.x += F2x / node2.m;
		node2.a.y += F2y / node2.m;
	}

	this.toggleString = function() {
		this.isString = !this.isString;
	}

	this.setStringMode = function(mode) {
		this.isString = mode;
	}

	this.getStiffness = function() {
		return this.k;
	}

	this.setStiffness = function(val) {
		this.k = val;
	}

	this.getRest = function() {

		var node1 = this.node1;
		var node2 = this.node2;
		var xAbs = VecOp.distanceV2(node1.p, node2.p);

		return this.d / xAbs;
	}
}