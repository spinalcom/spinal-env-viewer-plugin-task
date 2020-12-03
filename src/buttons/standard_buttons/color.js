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

export class ColorElementButton extends SpinalContextApp {
  constructor() {
    super("Select Object on Maquette", "select object on maquette", {
      icon: "",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#ffffff",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const nodeType = option.selectedNode.type.get();

    if (contextType !== CONTEXT_TYPE || nodeType === SpinalEvent.EVENT_TYPE)
      return Promise.resolve(-1);

    return Standard_buttons_service.getIcon(option.selectedNode.get(), option
        .context
        .get(), `${SpinalEvent.EVENT_TYPE}Group`)
      .then(
        (isColored) => {
          this.buttonCfg["isColored"] = isColored;
          this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
          return true;
        })

  }

  async action(option) {
    const selected = option.selectedNode.get();
    const context = option.context.get();

    if (this.isColored) {
      this.icon = "visibility";
      this.isColored = false;
      Standard_buttons_service.restoreItem(selected, context, SpinalEvent
        .EVENT_TYPE, `${SpinalEvent.EVENT_TYPE}Group`);
    } else {
      this.icon = "visibility_off";
      this.isColored = true;
      Standard_buttons_service.colorItem(selected, context, SpinalEvent
        .EVENT_TYPE, `${SpinalEvent.EVENT_TYPE}Group`);
    }

    window.NOP_VIEWER.impl.invalidate(0, 1, 0);
  }
}


const colorElementButton = new ColorElementButton();

spinalContextMenuService.registerApp(SIDEBAR, colorElementButton, [
  3
]);

export default colorElementButton;