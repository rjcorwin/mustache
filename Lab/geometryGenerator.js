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
	}
	
}
