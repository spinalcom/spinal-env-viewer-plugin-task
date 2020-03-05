const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");

import vue from "vue";


//////////////////////////////////////////////////////////////////////////////
//                              Dialogs                                     //
//////////////////////////////////////////////////////////////////////////////


import CreateTaskConfigurationDialog from "../vue/configComponents/dialogs/createConfiguration.vue";
import CreateTaskDialog from '../vue/configComponents/dialogs/createTaskDialog.vue'

const dialogs = [{
    name: "createTaskConfigurationDialog",
    vueMountComponent: vue.extend(CreateTaskConfigurationDialog),
    parentContainer: document.body
  },
  {
    name: "createTaskDialog",
    vueMountComponent: vue.extend(CreateTaskDialog),
    parentContainer: document.body
  }
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}