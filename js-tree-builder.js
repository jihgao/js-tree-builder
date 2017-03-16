		function TreeBuild(list, options){
			this.origin_list = list;
			this.options = options;
			this.options.primary_key = this.options.primary_key || 'id';
			this.options.parent_key = this.options.parent_key || 'parent_id';
		}

		TreeBuild.prototype.getAllNodes = function(){
			this.nodes = [].concat(this.getRootNodes());
			this.appendChildrenForRootNodes();
			return this.nodes;
		};

		TreeBuild.prototype.getRootNodes = function(){
			var rootNodes = [];
			for( var i = 0, m=this.origin_list.length; i < m; i++ ){
				if( this.isRoot(this.origin_list[i][this.options.parent_key]) ){
					rootNodes = rootNodes.concat(this.origin_list.splice(i, 1));
					m=this.origin_list.length;
				}
			}
			return rootNodes;
		};

		TreeBuild.prototype.isRoot = function(parent_id){
			if( !parent_id ) return true;
			for( var i = 0, n = this.origin_list.length; i < n; i++ ){
				if( this.origin_list[i][this.options.primary_key] === parent_id ){
					return false;
				}
			}
			return true;
		};
		TreeBuild.prototype.appendChildrenForRootNodes = function(){
			for( var j = 0, n = this.nodes.length; j < n; j++ ){
				this.appendChildrenForNodes(this.origin_list, this.nodes[j]);
			}
		};
		TreeBuild.prototype.appendChildrenForNodes = function(node_list, current_node){
			var children = node_list.filter(function(node_item){
				return node_item[this.options.parent_key] === current_node[this.options.primary_key];
			}.bind(this));
			var siblings = node_list.filter(function(node_item){
				return node_item[this.options.parent_key] !== current_node[this.options.primary_key];
			}.bind(this));

			if(children.length){
				current_node.children = current_node.children || [];
				current_node.children = current_node.children.concat(children);
				for( var i = 0, n = children.length; i<n; i++ ){
					this.appendChildrenForNodes(siblings, children[i]);
				}
			}
		};

		TreeBuild.prototype.getParent = function(list, parent_id){
			 var result;
			 for(var i = list.length - 1;i>-1;i--){
			 	if( list[i][this.options.primary_key] === parent_id){
			 		return list[i];
			 	}else {
			 		if(Array.isArray(list[i].children) && list[i].children.length ){
			 			result = hasParent(list[i].children, parent_id);
			 			if( result ){
			 				return result;
			 			}
			 		}
			 	}
			 }
			 return false;
		};