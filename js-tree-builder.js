function TreeBuild(list, options){
	var processed_count = 0, node_count = list.length;
	this.options = options || {};
	this.options.node_key = this.options.node_key || 'id';
	this.options.parent_key = this.options.parent_key || 'parent_id';

	this.getRootNodes = function(){
		return list.filter(function(nodeItem){
			if ( !nodeItem[this.options.parent_key] || nodeItem[this.options.parent_key] === -1 ){
				processed_count++;
				return true;
			}else{
				return false;
			}
		}.bind(this));
	};

	this.getChildren = function(parentNode){
		if( processed_count === node_count ){
			return false;
		}
		return list.filter(function(nodeItem){
			if( nodeItem[this.options.parent_key] === parentNode[this.options.node_key] ){
				processed_count++;
				nodeItem.parentNode = parentNode;
				this.appendChildren(nodeItem, this.getChildren(nodeItem));
				return true;
			}else{
				return false;
			}
		}.bind(this));
	};

	this.compute();
}

TreeBuild.prototype.getAllNodes = function(){
	return this.nodes ? this.nodes : this.compute();
};


TreeBuild.prototype.getParentNode = function(nodeItem){
	return nodeItem.parentNode || null;
};

TreeBuild.prototype.getSiblings = function(nodeItem){
	return (nodeItem.parentNode && Array.isArray(nodeItem.parentNode.children)) || [];
};

TreeBuild.prototype.compute = function(){
	this.nodes = this.getRootNodes();
	this.decorateNodeItemList(this.nodes);
	this.nodes.forEach(function(rootNode){
		this.appendChildren(rootNode, this.getChildren(rootNode));
	}.bind(this));

	return this.nodes;
};

TreeBuild.prototype.appendChildren = function(nodeItem, foundChildren){
	if( !Array.isArray(foundChildren) || !foundChildren.length ){
		return false;
	}

	if( Array.isArray(nodeItem.children) ){
		nodeItem.children = nodeItem.children.concat(foundChildren);
	}else{
		nodeItem.children = foundChildren;
	}
	this.decorateNodeItemList(nodeItem.children);
	return nodeItem.children;
};

TreeBuild.prototype.decorateNodeItemList = function(nodeItemList){
	nodeItemList.forEach(function(nodeItem){
		nodeItem.is_first = false;
		nodeItem.is_last = false;
	});
	nodeItemList[0].is_first = true;
	nodeItemList[nodeItemList.length - 1].is_last = true;
}
TreeBuild.prototype.isRoot = function(nodeItem){
	return !nodeItem[this.options.parent_key] || nodeItem[this.options.parent_key] === -1
};
