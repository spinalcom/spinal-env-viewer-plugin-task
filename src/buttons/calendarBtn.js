import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";


import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";


import {
  EQUIPMENTS_GROUP
} from "spinal-env-viewer-room-manager/js/service";


class LinkRooms extends SpinalContextApp {
  constructor() {
    super("Manage Task Maintenance",
      "This button allows to Manage Task", {
        icon: "calendar_today",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF"
      });
  }

  isShown(option) {
    return option.selectedNode.type.get() === EQUIPMENTS_GROUP ? Promise
      .resolve(true) :
      Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("TaskMaintenancePanel", option
      .selectedNode);
  }
}




export default LinkRooms;