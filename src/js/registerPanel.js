import "./registerDialogs";

import vue from "vue";

const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");





//////////////////////////////////////////////////////////////////////////////
//                              Panels                                      //
//////////////////////////////////////////////////////////////////////////////

import ConfigPanelComponents from '../vue/configComponents/panel.vue'


let panels = [{
  name: "TaskConfigurationPanel",
  vueMountComponent: vue.extend(ConfigPanelComponents),
  panel: {
    title: "Task Maintenance",
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