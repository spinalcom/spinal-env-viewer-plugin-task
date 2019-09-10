<template>
  <md-content class="mdContent">
    <visits-component v-if="!visitSelected"
                      :visitSelected="visitSelected"
                      @selectVisit="selectVisit"></visits-component>

    <table-component v-if="visitSelected"
                     :nodeId="nodeId"
                     :visitSelected="visitSelected"
                     @goBack="goBack"></table-component>
  </md-content>
</template>

<script>
import vistsComponent from "./panelComponent/vistsComponent.vue";
import tableComponent from "./panelComponent/tableComponent.vue";

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

export default {
  name: "TaskMaintenancePanel",
  components: {
    "visits-component": vistsComponent,
    "table-component": tableComponent
  },
  data() {
    return {
      visitSelected: null,
      nodeId: null,
      nodeName: ""
    };
  },
  methods: {
    opened(option) {
      this.setTitle(`Visit Manager : ${option.name.get()}`);
      this.nodeName = option.name.get();
      this.nodeId = option.id.get();
      // this.visitSelected = null;
    },
    setTitle(title) {
      spinalPanelManagerService.panels.TaskMaintenancePanel.panel.setTitle(
        title
      );
    },

    selectVisit(item) {
      this.visitSelected = item;
    },

    searchOnTable() {
      console.log("hello world");
    },

    goBack() {
      this.visitSelected = null;
    }

    // getAllData() {
    //   return taskService.getGroupTasks(this.nodeId,this.).then(res => {
    //     res = res.map(el => {
    //       return el.element.load();
    //     });

    //     Promise.all(res).then(el => {
    //       let result = el.map(r => r.get());

    //       this.allData = result;
    //       this.searched = result;
    //     });
    //   });
    // }
  }
};
</script>


<style scoped>
.mdContent {
  width: 100%;
  height: calc(100% - 15px);
}
</style>
