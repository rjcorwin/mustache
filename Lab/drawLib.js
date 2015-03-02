var drawLib = {
	drawLine : function(context, v1, v2, lineWidth, strokeStyle_) {
		if (!strokeStyle_)
			strokeStyle_ = '#ae7200';

		var len = VecOp.distanceV2(v1, v2);
		if (len < 10)
			return;

		context.beginPath();
		context.lineWidth = 90;
		context.strokeStyle = '#ae7200';
		context.moveTo(v1.x, v1.y);
		context.lineTo(v2.x, v2.y);
		context.stroke();
	},

	drawCircle : function(context, x, y, r, strokeStyle_) {
		if (!strokeStyle_)
			strokeStyle_ = '#ae7200';

		context.beginPath();
		context.arc(x, y, 1, 0, 2 * Math.PI, false);
		context.fillStyle = '#ae7200';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = "#ae7200";
		context.stroke();
	}
}
