function TreeBuild(list, options){
	this.origin_list = JSON.parse(JSON.stringify(list));
	this.options = options || {};
	this.options.primary_key = (this.options && this.options.primary_key) || 'id';
	this.options.parent_key = (this.options && this.options.parent_key) || 'parent_id';
	this.processed_count = 0;
	this.node_count = list.length;
	this.compute();
}

TreeBuild.prototype.getAllNodes = function(){
	return this.nodes ? this.nodes : this.compute();
};

TreeBuild.prototype.compute = function(){
	this.nodes = this.getRootNodes();
	this.decorateNodeItemList(this.nodes);
	this.nodes.forEach(function(rootNode){
		this.appendChildren(rootNode, this.getChildren(rootNode));
	}.bind(this));

	return this.nodes;
};

TreeBuild.prototype.getRootNodes = function(){
	return this.origin_list.filter(function(nodeItem){
		if ( !nodeItem[this.options.parent_key] || nodeItem[this.options.parent_key] === -1 ){
			this.processed_count++;
			return true;
		}else{
			return false;
		}
	}.bind(this));
};

TreeBuild.prototype.getChildren = function(parentNode){
	if( this.processed_count === this.node_count ){
		return false;
	}
	return this.origin_list.filter(function(nodeItem){
		if( nodeItem[this.options.parent_key] === parentNode[this.options.primary_key] ){
			this.processed_count++;
			nodeItem.parentNode = parentNode;
			this.appendChildren(nodeItem, this.getChildren(nodeItem));
			return true;
		}else{
			return false;
		}
	}.bind(this));
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
