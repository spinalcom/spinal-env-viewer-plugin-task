import {
  SpinalContextApp,
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";

import {
  spinalPanelManagerService
} from "spinal-env-viewer-panel-manager-service";

// import {
//   groupManagerService
// } from "spinal-env-viewer-plugin-group-manager-service";

import {
  CONTEXT_TYPE,
  SpinalEvent
} from 'spinal-env-viewer-task-service'

const SIDEBAR = "GraphManagerSideBar";
const CIRCULAR_MENU_HOOK = "circularMenu";

export default class CreateTaskButton extends SpinalContextApp {

  constructor() {
    super("Create Task",
      "This button allows you to create task", {
        icon: "calendar_today",
        icon_type: "in",
        backgroundColor: "#356BAB",
        fontColor: "#FFFFFF"
      })
  }

  isShown(option) {
    if (option.selectedNode && option.selectedNode.type.get() === SpinalEvent
      .EVENT_TYPE)
      return Promise.resolve(-1);

    return Promise.resolve(true);
    // if (typeof option === "undefined") return Promise.resolve(true);

    // const isContextGroup = option.context.type.get() === CONTEXT_TYPE;
    // const isGroup = groupManagerService.isGroup(type);

    // return Promise.resolve(isContextGroup && isGroup ? true : -1)

  }

  action(option) {
    const params = Object.assign({}, option);

    params.isEventContext = option.context ? option.context.type.get() ===
      CONTEXT_TYPE : false;

    spinalPanelManagerService.openPanel("taskPanel", params);
  }

}

spinalContextMenuService.registerApp(SIDEBAR, new CreateTaskButton(), [
  3
]);

spinalContextMenuService.registerApp(CIRCULAR_MENU_HOOK,
  new CreateTaskButton(), [
    3
  ]);