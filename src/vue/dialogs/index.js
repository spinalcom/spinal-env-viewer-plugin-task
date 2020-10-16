import {
  SpinalMountExtention
} from "spinal-env-viewer-panel-manager-service";

import Vue from "vue";


import CreateTaskContextDialog from "./createContext.vue";
import CreateTaskDialog from "./createTask.vue";
import EditTaskDialog from "./editTask.vue";
import ConfirmDialog from "./confirm-dialog.vue";

const dialogs = [{
    name: "createTaskContextDialog",
    vueMountComponent: Vue.extend(CreateTaskContextDialog),
    parentContainer: document.body
  },
  {
    name: "createTaskDialog",
    vueMountComponent: Vue.extend(CreateTaskDialog),
    parentContainer: document.body
  },
  {
    name: "editTaskDialog",
    vueMountComponent: Vue.extend(EditTaskDialog),
    parentContainer: document.body
  },
  {
    name: "confirmDialog",
    vueMountComponent: Vue.extend(ConfirmDialog),
    parentContainer: document.body
  }
]

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}