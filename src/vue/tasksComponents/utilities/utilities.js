import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";


export default {
  async getAllData(contextId, nodeId) {
    let context = SpinalGraphService.getRealNode(contextId);
    let realNode = SpinalGraphService.getRealNode(nodeId);
    let res = {
      types: [],
      data: {}
    };

    if (context && realNode) {
      await realNode.findInContext(context, async (node) => {
        SpinalGraphService._addNode(node);
        let type = node.getType().get();
        let info = node.info.get();

        if (res.types.indexOf(type) === -1) {
          res.types.push(type);
        }

        if (typeof res.data[type] === "undefined") res.data[
          type] = [];

        res.data[type].push(info);

      })
    }

    return res;
  }
}