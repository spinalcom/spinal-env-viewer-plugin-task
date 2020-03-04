import {
  SpinalContextApp
} from "spinal-env-viewer-context-menu-service";


import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";


import {
  groupService
} from "spinal-env-viewer-room-manager/services/service";


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
    const condition = (option.selectedNode.type.get() === groupService
        .constants.EQUIPMENTS_GROUP) ||
      (option.selectedNode.type.get() === groupService.constants.ROOMS_GROUP)


    return condition ? Promise.resolve(true) : Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("TaskMaintenancePanel", option
      .selectedNode);
  }
}




export default LinkRooms;