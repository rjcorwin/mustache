

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
	var theDiv = document.getElementById('coordinates');
	theDiv.innerHTML = '<h2>' + 'x: ' + out.x + ' y: ' + out.y + '</h2>';
	return out
}

Array.prototype.clear = function() {
	this.splice(0, this.length);
};

function Game(canvas_, massDiv_, typeDiv_, stiffnessDiv_, helpDiv_) {

	var canvas = canvas_;
	var massDiv = massDiv_;
	var typeDiv = typeDiv_;
	var stiffnessDiv = stiffnessDiv_
	var helpDiv = helpDiv_;

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
		//helpVisible = true;

		nodeL = null;
		nodeR = null;

		springs.clear();
		nodes.clear();

		var pendulum = GeometryGenerator.createPendulum(30, 180, 100, 100, 260, 1, 50, -stiffness);
		var mesh = GeometryGenerator.createMesh(200, 20, 5, 5, 60, 60, 1, 50, 50, -stiffness);
		var circle = GeometryGenerator.createCircle(700, 300, 100, 6, 1, 1, 80, 60, -stiffness);

		nodes = nodes.concat(pendulum.Nodes, circle.Nodes, mesh.Nodes);
		springs = springs.concat(pendulum.Springs, circle.Springs, mesh.Springs);
	}

	initLab();

	var mouseL = false;
	var mouseR = false;

	var mass = 1;

	var clickPosR = null;
	var mousePos = new Vector2();

	var clickTimeL = 0;

	function clamp(val, min, max) {
		if (val < min)
			return min;
		if (val > max)
			return max;
		return val;
	}


	document.addEventListener("keypress", function(ev) {
		var key = ev.which;
		if (key == 32) {
			stringMode = !stringMode;
			for (var i = 0; i < springs.length; i++) {
				springs[i].setStringMode(stringMode);
			};
		} else if (key == 1581 || key == 112) {
			paused = !paused;
		}

	}, false);

	document.addEventListener("keydown", function(ev) {
		var key = ev.which;
		if (key == 38) {
			stiffness += 0.02;
			stiffness = clamp(stiffness, 0.5, 3);

			for (var i = 0; i < springs.length; i++) {
				springs[i].setStiffness(-stiffness);
			};
		} else if (key == 40) {
			stiffness -= 0.02;
			stiffness = clamp(stiffness, 0.5, 3);

			for (var i = 0; i < springs.length; i++) {
				springs[i].setStiffness(-stiffness);
			};
		} else if (key == 49 || key == 91) {
			if (!helpDiv)
				return;

			var d = helpDiv.style.display;
			if (d == 'none')
				d = 'block';
			else
				d = 'none';

			helpDiv.style.display = d;
		}
	}, true);

	function onweel(ev) {
		if (nodeL) {
			var rolled = 0;
			if ('wheelDelta' in ev)
				rolled = -event.wheelDelta / 50.0;
			else
				rolled = ev.detail / 1.5;

			nodeL.setMass(nodeL.getMass() + -rolled);
		}
	}


	window.addEventListener('mousewheel', onweel, false);
	window.addEventListener('DOMMouseScroll', onweel, false);

	var iStart = function(ev) {
		var e = canvas.relMouseCoords(ev);

		mousePos = new Vector2(e.x, e.y);
		var node_ = pickNode(e.x, e.y);

		if (ev.button == 0) {
			// double click-> remove node and attached springs
			if (node_ && currentTime() - clickTimeL < 500) {

				for (var i = 0; i < springs.length; i++) {
					s = springs[i];
					if (s.node1 == node_ || s.node2 == node_) {
						springs.remove(i);
						i--;
					}
				}

				nodes.remove(nodes.indexOf(node_));
				nodeL = null;

				return;
			}

			nodeL = node_;
			mouseL = true;
			clickTimeL = currentTime();
		} else if (ev.button == 2) {
			if (node_) {
				nodeR = node_;
				mouseR = true;
			}

			clickPosR = new Vector2(mousePos.x, mousePos.y);
		}
	}

	var iEnd = function(ev) {

		var e = canvas.relMouseCoords(ev);

		if (ev.button == 2) {
			var node_ = pickNode(e.x, e.y);

			if (!nodeR && !node_) {
				node_ = new Node2D(mousePos.x, mousePos.y, mass);
				nodes.push(node_);
			} else if (nodeR && nodeR != node_) {
				if (!node_)
					node_ = new Node2D(e.x, e.y, mass);

				nodes.push(node_);

				var dist = VecOp.distanceV2(node_.p, nodeR.p);

				var spr = new Spring2D(nodeR, node_, 0.80 * dist, -stiffness);
				spr.setStringMode(stringMode);
				springs.push(spr);
			}

			nodeR = null;
		}

		mouseL = false;
		mouseR = false;

		mousePos = null;
	}


	var iMove = function(ev) {
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

		if (massDiv) {
			if (nodeL)
				massDiv.innerHTML = "Mass: " + nodeL.getMass().toFixed(2);
			else
				massDiv.innerHTML = "Mass: -";
		}

		if (stiffnessDiv)
			stiffnessDiv.innerHTML = "Stiffness: " + stiffness.toFixed(2);

		if (typeDiv)
			typeDiv.innerHTML = "Type: " + ( stringMode ? "Strings" : "Springs");

	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < springs.length; i++) {
			var b1 = springs[i].node1;
			var b2 = springs[i].node2;

			drawLib.drawLine(context, b1.p, b2.p, 6.0 * springs[i].getRest(), ( paused ? "#888888" : "null"));
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

}
