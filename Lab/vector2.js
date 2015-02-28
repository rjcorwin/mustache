var VecOp = {

	distanceV2 : function(v1, v2) {
		num2 = v1.x - v2.x;
		num = v1.y - v2.y;
		num3 = (num2 * num2) + (num * num);
		return Math.sqrt(num3);
	},

	subV2 : function(v1, v2) {
		var x = v1.x - v2.x;
		var y = v1.y - v2.y;
		return new Vector2(x, y);
	}
}

function Vector2(x_, y_) {
	if (x_)
		this.x = x_;
	else
		this.x = 0;

	if (y_)
		this.y = y_;
	else
		this.y = 1.0 * this.x;

	this.normalize = function() {
		var num2 = (this.x * this.x) + (this.y * this.y);
		var num = 1.0 / Math.sqrt(num2);
		this.x *= num;
		this.y *= num;

		return this;
	}

	this.getNormalized = function() {
		var temp = new Vector2(this.x, this.y);
		return temp.normalize();
	}

	this.invert = function() {
		this.x *= -1;
		this.y *= -1;

		return this;
	}

	this.mult = function(val) {
		this.x *= val;
		this.y *= val;

		return this;
	}

	this.divide = function(val) {
		this.x /= val;
		this.y /= val;

		return this;
	}

	this.add = function(v) {
		this.x += v.x;
		this.y += v.y;
	}

	this.zero = function() {
		return new Vector3(0, 0);
	}
}