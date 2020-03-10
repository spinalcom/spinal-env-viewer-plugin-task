import {
  SpinalContextApp
} from 'spinal-env-viewer-context-menu-service';

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

export default class TaskManager extends SpinalContextApp {

  constructor() {
    super("Manage Task",
      "This button allows to create, delete, update task configuration", {
        icon: "calendar_today",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      })
  }

  isShown() {
    return Promise.resolve(true);
  }

  action(option) {
    spinalPanelManagerService.openPanel("TaskManagementPanel", option);
  }

}