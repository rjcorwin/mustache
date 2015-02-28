function Node2D(posX, posY, mass) {
	// Mass
	this.m = mass;

	// Position
	this.p = new Vector2(posX, posY);

	// Acceleration
	this.a = new Vector2(0, 0);

	// Velocity
	this.v = new Vector2(0, 0);

	this.update = function() {

		// Add gravity here?

		this.v.add(this.a);
		this.p.add(this.v);

		this.v.mult(0.97);
		this.a.mult(0.3);
	}

	this.getMass = function() {
		return this.m;
	}

	this.setMass = function(val) {
		if (val <= 0)
			return;

		this.m = val;
	}
}