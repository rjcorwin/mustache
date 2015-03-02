

onerror = function(msg, url, l) {
	alert(msg + "\n" + url + "\n" + l);
	return true;
}

// Gets mouse event coordinates relative to the canvas
HTMLCanvasElement.prototype.relMouseCoords = function(e) {
	var out = {x:0, y:0};
	if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
		var touch = e.touches[0] || e.changedTouches[0];
		out.x = touch.pageX;
		out.y = touch.pageY;
	} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
		out.x = e.pageX;
		out.y = e.pageY;
	}
		return out
}

Array.prototype.clear = function() {
	this.splice(0, this.length);
};

function Game(canvas_) {
	var canvas = canvas_;
	var context = canvas.getContext('2d');
	var nodes = new Array();
	var springs = new Array();
	var nodeL;
	var nodeR;
	var stiffness = 3;
	var stringMode = false;
	var paused = false;
	function initLab() {
		stiffness = 3.0;
		stringMode = false;
		paused = false;
		helpVisible = false;
		nodeL = null;
		nodeR = null;
		springs.clear();
		nodes.clear();
		var mass = 10
		var items = [
			[30, 150, mass],
			[80, 180, mass],
			[130, 185, mass],
			[180, 150, mass],
			[230, 120, mass],
			[280, 100, mass],
			[330, 95, 4000],
			[380, 100, mass],
			[430, 120, mass],
			[480, 150, mass],
			[530, 185, mass],
			[580, 180, mass],
			[630, 150, mass],
		]
		items.forEach(function(item, i) {
			item[1] = item[1] - 50
			items[i] = item
		})
		var string = GeometryGenerator.createString(items, 50, -stiffness);
		nodes = nodes.concat(string.Nodes);
		springs = springs.concat(string.Springs);
	}


	var mouseL = false;
	var mouseR = false;
	var mass = 1;
	var clickPosR = null;
	var mousePos = new Vector2();
	var clickTimeL = 0;

	var iStart = function(ev) {
		ev.preventDefault()
		var e = canvas.relMouseCoords(ev);
		mousePos = new Vector2(e.x, e.y);
		var node_ = pickNode(e.x, e.y);
		nodeL = node_;
		mouseL = true;
		clickTimeL = currentTime();
	}

	var iEnd = function(ev) {
		ev.preventDefault()
		var e = canvas.relMouseCoords(ev);
		mouseL = false;
		mouseR = false;
		mousePos = null;
	}

	var iMove = function(ev) {
		ev.preventDefault()
		var e = canvas.relMouseCoords(ev);
		mousePos = new Vector2(e.x, e.y);
	}
	function pickNode(x, y) {
		for (var i = 0; i < nodes.length; i++) {
			var dis = VecOp.distanceV2(nodes[i].p, new Vector2(x, y));
			if (dis < 20)
				return nodes[i];
		}
		return null;
	}

	// setInterval(function() {
	//
	// update();
	// draw();
	//
	// }, 20);

	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	(function mainLoop()
	{
		requestAnimFrame(mainLoop);
		update();
		draw();
	})()

	function currentTime() {
		var d = new Date();
		return d.getTime();
	}

	function update() {
		if (!paused) {
			for (var i = 0; i < springs.length; i++) {
				springs[i].update();
			};

			for (var i = 0; i < nodes.length; i++) {
				nodes[i].update();
			};
		}

		if (mousePos && nodeL && mouseL) {
			nodeL.p.x = mousePos.x;
			nodeL.p.y = mousePos.y;
		}

	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < springs.length; i++) {
			var b1 = springs[i].node1;
			var b2 = springs[i].node2;

			drawLib.drawLine(context, b1.p, b2.p, 6.0 * springs[i].getRest(), ( paused ? "#914600" : "null"));
		};

		for (var i = 0; i < nodes.length; i++) {
			var pos = nodes[i].p;
			drawLib.drawCircle(context, pos.x, pos.y, 10);
		}

		if (nodeL)
			drawLib.drawCircle(context, nodeL.p.x, nodeL.p.y, 15);

		if (nodeR) {
			drawLib.drawLine(context, nodeR.p, mousePos, 3, "#FFFF00")
			drawLib.drawCircle(context, mousePos.x, mousePos.y, 10);
		}
	}

	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};

	//Events
	canvas.onmousedown = iStart
	canvas.onmousemove = iMove
	canvas.onmouseup = iEnd
	canvas.addEventListener('touchstart', function (event) {
		event.preventDefault()
		iStart(event)
	})
	canvas.addEventListener('touchmove', function (event) {
		event.preventDefault()
		iMove(event)
	})
	canvas.addEventListener('touchend', function (event) {
		event.preventDefault()
		iEnd(event)
	})

	initLab();

}
