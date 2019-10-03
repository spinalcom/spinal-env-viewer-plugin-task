import vue from "vue";
import TaskMaintenancePanel from '../vue/panelVue.vue';
import EventsManagePanel from "../vue/events/panel.vue";

import CreateVisitDialog from "../vue/dialogs/createVisitDialog.vue"
import ScheduleVisitDialog from "../vue/dialogs/scheduleVisit.vue"
import ConfirmDialog from "../vue/dialogs/confirmDialog.vue";
import deleteItemDialog from "../vue/dialogs/deleteItemDialog.vue"
import EditEventDialog from "../vue/events/dialog.vue";


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
    left: "400px"
  }
}, {
  name: "eventsManagePanel",
  vueMountComponent: vue.extend(EventsManagePanel),
  panel: {
    title: "Manage Events",
    closeBehaviour: "hide"
  },
  style: {
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
  },
  {
    name: "scheduleVisitDialog",
    vueMountComponent: vue.extend(ScheduleVisitDialog),
    parentContainer: document.body
  },
  {
    name: "confirmDialog",
    vueMountComponent: vue.extend(ConfirmDialog),
    parentContainer: document.body
  },
  {
    name: "deleteItemDialog",
    vueMountComponent: vue.extend(deleteItemDialog),
    parentContainer: document.body
  }, {
    name: "editEventDialog",
    vueMountComponent: vue.extend(EditEventDialog),
    parentContainer: document.body
  }
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}