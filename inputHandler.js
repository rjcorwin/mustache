// Not used

function InputHandler(onClick_, onDClick_, onDrag_, onDrop_) {

	var mousePos = new Vector2();
	var mousePosX = null;
	var clickTimeX = 0;
	var button = -1;

	this.onClick = onClick_;
	this.onDClick = onDClick_;
	this.onDrop = onDrop_;
	this.onDrag = onDrag_;

	this.onMouseDown = function(e) {
		var time = (new Date()).getTime();

		this.mousePos = new Vector2(e.clientX, e.clientY);
		this.mousePosX = new Vector2(this.mousePos.x, this.mousePos.y);

		// double click
		if (this.button == e.button && time - this.clickTimeX < 500) {
			if (this.onDClick)
				this.onDClick(e);

			this.mousePosX = null;
		}

		this.clickTimeX = time;
		this.button = e.button;
	}

	this.onMouseMove = function(e) {
		var p = new Vector2(e.clientX, e.clientY);

		if (this.mousePosX) {
			var dist = VecOp.distanceV2(p, this.mousePosX);
			if (dist > 10 && this.onDrag)
				this.onDrag(e, this.button);

		}
	}

	this.onMouseUp = function(e) {
		this.mousePos = new Vector2(e.clientX, e.clientY);

		if (this.mousePosX) {
			var dist = VecOp.distanceV2(this.mousePos, this.mousePosX);

			if (dist <= 5) {
				if (this.onClick)
					this.onClick(e);

			} else {
				if (this.onDrop)
					this.onDrop(e);
			}

		}

		this.mousePosX = null;
	}

	this.isDragging = function() {		
		return (this.mousePosX != null ? this.button : -1);
	}

	this.mousePosition = function() {
		if (!this.mousePos)
			return null;
		return {
			x : this.mousePos.x,
			y : this.mousePos.y
		};
	}
}