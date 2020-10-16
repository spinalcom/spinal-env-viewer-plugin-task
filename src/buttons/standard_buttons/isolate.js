import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";


import {
  CONTEXT_TYPE,
  SpinalEvent
} from "spinal-env-viewer-task-service";

import {
  Standard_buttons_service
} from "spinal-env-viewer-plugin-note-standard-buttons-service";

const SIDEBAR = "GraphManagerSideBar";

class IsolateElementOnMaquette extends SpinalContextApp {
  constructor() {
    super("Isolate Object on Maquette", "Isolate object on maquette", {
      icon: "settings_overscan",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#ffffff",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    // const nodeType = option.selectedNode.type.get();

    if (contextType === CONTEXT_TYPE)
      return Promise.resolve(true);

    return Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const contextId = option.context.id.get();

    const parents = await Standard_buttons_service.getNodesParents(nodeId,
      contextId, SpinalEvent.EVENT_TYPE);

    if (!parents || (parents && parents.length === 0)) {
      window.alert("No parent on bimMaquette");
      return;
    }

    parents.forEach((el) => {
      window.spinal.ForgeViewer.viewer.impl.visibilityManager.isolate(el
        .ids, el.model)
    })

  }
}

const isolateElementOnMaquette = new IsolateElementOnMaquette();

spinalContextMenuService.registerApp(SIDEBAR, isolateElementOnMaquette, [
  3
]);

export default isolateElementOnMaquette;