import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

const HEADERBAR = "GraphManagerTopBar";

export default class CreateTaskContextButton extends SpinalContextApp {

  constructor() {
    super("Create Task Context",
      "This button allows you to create task context", {
        icon: "calendar_today",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      })
  }

  isShown() {
    return Promise.resolve(true);
  }

  action() {
    spinalPanelManagerService.openPanel("createTaskContextDialog", {});
  }

}

spinalContextMenuService.registerApp(HEADERBAR, new CreateTaskContextButton(), [
  3
]);