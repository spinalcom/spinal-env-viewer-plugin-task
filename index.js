import "./src/js/registerPanel";
import {
  spinalContextMenuService
} from "spinal-env-viewer-context-menu-service";


import CalendarBtn from "./src/buttons/calendarBtn.js";


const SIDEBAR = "GraphManagerSideBar";





spinalContextMenuService.registerApp(SIDEBAR, new CalendarBtn(), [3]);