var Util = {
	getPageWidth : function() {
		var x = 0;
		if (self.innerHeight) {
			x = self.innerWidth;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			x = document.documentElement.clientWidth;
		} else if (document.body) {
			x = document.body.clientWidth;
		}
		return x;
	},

	getPageHeight : function() {
		var y = 0;
		if (self.innerHeight) {
			y = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			y = document.documentElement.clientHeight;
		} else if (document.body) {
			y = document.body.clientHeight;
		}
		return y;
	}
}