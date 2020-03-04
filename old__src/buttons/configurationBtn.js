import {
  SpinalContextApp
} from 'spinal-env-viewer-context-menu-service';

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

export default class TaskConfiguration extends SpinalContextApp {

  constructor() {
    super("Manage Task Configuration",
      "This button allows to manage task configuration", {
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
    spinalPanelManagerService.openPanel("TaskConfigurationPanel", {})
  }

}