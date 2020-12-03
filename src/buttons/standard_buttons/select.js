import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

import {
  Standard_buttons_service
} from "spinal-env-viewer-plugin-note-standard-buttons-service";

import {
  CONTEXT_TYPE,
  SpinalEvent
} from "spinal-env-viewer-task-service";

const SIDEBAR = "GraphManagerSideBar";

class SelectElementOnMaquette extends SpinalContextApp {
  constructor() {
    super("Select Object on Maquette", "select object on maquette", {
      icon: "find_in_page",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#ffffff",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const nodeType = option.selectedNode.type.get();

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
      el.model.selector.setSelection(el.ids, el.model, "selectOnly");
    })

  }
}

const selectElementOnMaquette = new SelectElementOnMaquette();

spinalContextMenuService.registerApp(SIDEBAR, selectElementOnMaquette, [
  3
]);

export default selectElementOnMaquette;