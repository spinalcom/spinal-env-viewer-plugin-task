import "./src/js/registerPanel";
import {
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";


// import CalendarBtn from "./src/buttons/calendarBtn.js";
import TaskConfigurationBtn from "./src/buttons/configurationBtn.js"


const SIDEBAR = "GraphManagerSideBar";
const HEADERBAR = "GraphManagerTopBar";




// spinalContextMenuService.registerApp(SIDEBAR, new CalendarBtn(), [3]);
spinalContextMenuService.registerApp(HEADERBAR, new TaskConfigurationBtn(), [
  3
]);