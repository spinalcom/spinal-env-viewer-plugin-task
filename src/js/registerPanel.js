import vue from "vue";
import TaskMaintenancePanel from '../vue/panelVue.vue';

import CreateVisitDialog from "../vue/createVisitDialog.vue"

const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");



let panels = [{
  name: "TaskMaintenancePanel",
  vueMountComponent: vue.extend(TaskMaintenancePanel),
  panel: {
    title: "Task Maintenance",
    closeBehaviour: "hide"
  },
  style: {
    height: "475px",
    left: "400px"
  }
}]


for (let index = 0; index < panels.length; index++) {
  const element = panels[index];
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}


//////////////////////////////////////////////////////////////////////////////
//                              Dialogs                                     //
//////////////////////////////////////////////////////////////////////////////

const dialogs = [{
  name: "createVisitDialog",
  vueMountComponent: vue.extend(CreateVisitDialog),
  parentContainer: document.body
}];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}