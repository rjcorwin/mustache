var drawLib = {
	drawLine : function(context, v1, v2, lineWidth, strokeStyle_) {
		if (!strokeStyle_)
			strokeStyle_ = 'green';

		var len = VecOp.distanceV2(v1, v2);
		if (len < 10)
			return;

		context.beginPath();
		context.lineWidth = lineWidth;		
		context.strokeStyle = strokeStyle_;
		context.moveTo(v1.x, v1.y);
		context.lineTo(v2.x, v2.y);
		context.stroke();
	},

	drawCircle : function(context, x, y, r, strokeStyle_) {
		if (!strokeStyle_)
			strokeStyle_ = '#007700';

		context.beginPath();
		context.arc(x, y, r, 0, 2 * Math.PI, false);
		context.fillStyle = '#33AA00';
		context.fill();
		context.lineWidth = 5;
		context.strokeStyle = strokeStyle_;
		context.stroke();
	}
}
