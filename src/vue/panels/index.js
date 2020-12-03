import Vue from "vue";
import {
  SpinalForgeExtention,
} from "spinal-env-viewer-panel-manager-service_spinalforgeextention";

import TaskPanel from "./taskPanel.vue";
import SeeEventDetailPanel from "./seeEventDetail.vue";

const panels = [{
    name: "taskPanel",
    vueMountComponent: Vue.extend(TaskPanel),
    panel: {
      title: "Events Panel",
      closeBehaviour: "hide",
    },
    style: {
      height: "475px",
      left: "400px",
    },
  },
  {
    name: "seeEventDetail",
    vueMountComponent: Vue.extend(SeeEventDetailPanel),
    panel: {
      title: "Event Detail Panel",
      closeBehaviour: "hide",
    },
    style: {
      minWidth: "660px",
      height: "475px",
      left: "400px",
    },
  }
];


for (const element of panels) {
  const panelExtension = SpinalForgeExtention.createExtention(element);
  SpinalForgeExtention.registerExtention(element.name, panelExtension);
}