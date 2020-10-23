import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";


import {
  CONTEXT_TYPE,
  SpinalEvent
} from 'spinal-env-viewer-task-service'

const SIDEBAR = "GraphManagerSideBar";


export default class SeeDetailBtn extends SpinalContextApp {

  constructor() {
    super("see event detail Task",
      "This button allows you to see event detail", {
        icon: "info",
        icon_type: "in",
        backgroundColor: "#356BAB",
        fontColor: "#FFFFFF"
      })
  }

  isShown(option) {
    if (option.selectedNode.type.get() === SpinalEvent.EVENT_TYPE)
      return Promise.resolve(true);

    return Promise.resolve(-1);

  }

  action(option) {
    const params = option.selectedNode.get();

    spinalPanelManagerService.openPanel("seeEventDetail", params);
  }

}

spinalContextMenuService.registerApp(SIDEBAR, new SeeDetailBtn(), [
  3
]);