# js-tree-builder
根据父子节点关系生成树状数据结构的工具

## 例子
```javascript
        var list = [
            {
              parent_id:-1,
              name: "root1",
              id:1
            },
            {
              parent_id: 1,
              id:2,
              name: "node1"
            },
            {
              parent_id: 1,
              id:3,
              name: "node2"
            },
            {
              parent_id:-1,
              name: "root2",
              id:4
            },
            {
              parent_id:4,
              name: "node3",
              id:5
            }
        ];
        var tree = new TreeBuild(list, {node_key:"id", {parent_key: "parent_id"}});
```
