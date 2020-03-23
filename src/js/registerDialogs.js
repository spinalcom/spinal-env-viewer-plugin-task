const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");

import vue from "vue";


//////////////////////////////////////////////////////////////////////////////
//                              Dialogs                                     //
//////////////////////////////////////////////////////////////////////////////


import CreateTaskConfigurationDialog from "../vue/configComponents/dialogs/createConfiguration.vue";
import CreateTaskDialog from '../vue/configComponents/dialogs/createTaskDialog.vue';
import ConfirmDialog from "../vue/configComponents/dialogs/confirmDialog.vue";
import ConfigTaskDialog from '../vue/tasksComponents/components/fabs/dialogs/configTasks.vue'
import GenerateEventDialog from '../vue/tasksComponents/components/fabs/dialogs/generateEventDialog.vue';
import ManageEventsDialog from '../vue/tasksComponents/components/fabs/dialogs/manageEvents.vue';
import EventDetail from '../vue/tasksComponents/components/fabs/dialogs/events/eventDetail.vue';


const dialogs = [{
    name: "createTaskConfigurationDialog",
    vueMountComponent: vue.extend(CreateTaskConfigurationDialog),
    parentContainer: document.body
  },
  {
    name: "createTaskDialog",
    vueMountComponent: vue.extend(CreateTaskDialog),
    parentContainer: document.body
  }, {
    name: "confirmDialog",
    vueMountComponent: vue.extend(ConfirmDialog),
    parentContainer: document.body
  }, {
    name: "generateEventDialog",
    vueMountComponent: vue.extend(GenerateEventDialog),
    parentContainer: document.body
  },
  {
    name: "configTaskDialog",
    vueMountComponent: vue.extend(ConfigTaskDialog),
    parentContainer: document.body
  }, {
    name: "ManageEventsDialog",
    vueMountComponent: vue.extend(ManageEventsDialog),
    parentContainer: document.body
  }, {
    name: "EventDetail",
    vueMountComponent: vue.extend(EventDetail),
    parentContainer: document.body
  }
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}