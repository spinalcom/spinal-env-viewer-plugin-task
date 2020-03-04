const {
  SpinalMountExtention
} = require("spinal-env-viewer-panel-manager-service");

import vue from "vue";


//////////////////////////////////////////////////////////////////////////////
//                              Dialogs                                     //
//////////////////////////////////////////////////////////////////////////////


import CreateTaskConfigurationDialog from "../vue/configComponents/dialogs/createConfiguration.vue";


const dialogs = [{
  name: "createTaskConfigurationDialog",
  vueMountComponent: vue.extend(CreateTaskConfigurationDialog),
  parentContainer: document.body
}];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}