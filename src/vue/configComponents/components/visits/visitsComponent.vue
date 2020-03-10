<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="content">
    <md-content class="visits md-scrollbar"
                v-if="!visitSelected">

      <div v-if="visits.length === 0"
           class="empty">
        <div>No Configuration Found !!! </div>
        <div>Create one</div>
      </div>
      <visit-component v-for="(visit,index) in visits"
                       :key="index"
                       :visit="visit"
                       @select="selectVisit"
                       @edit="editVisit"
                       @remove="removeVisit"></visit-component>

      <md-button @click="createVisitContextDialog"
                 class="md-primary md-fab md-mini md-fab-bottom-right">
        <md-icon>add</md-icon>
      </md-button>
    </md-content>

    <div v-else
         class="tasks">
      <table-component :visitSelected="visitSelected"
                       @goBack="goBack"></table-component>
    </div>
  </div>

</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import VisitComponent from "./visit.vue";
import TableComponent from "../table/table.vue";

export default {
  name: "visitsComponents",
  components: {
    "visit-component": VisitComponent,
    "table-component": TableComponent
  },
  props: {
    visits: {}
  },
  data() {
    return {
      visitSelected: undefined
    };
  },
  methods: {
    createVisitContextDialog() {
      spinalPanelManagerService.openPanel("createTaskConfigurationDialog", {
        callback: this.refresh
      });
    },

    selectVisit(visit) {
      this.visitSelected = visit;
    },
    editVisit(visit) {
      spinalPanelManagerService.openPanel("createTaskConfigurationDialog", {
        id: visit.id,
        name: visit.name,
        callback: this.refresh,
        edit: true
      });
    },

    removeVisit(visit) {
      spinalPanelManagerService.openPanel("confirmDialog", {
        nodeId: visit.id,
        title: "Delete",
        message:
          "Are you sure to remove this configuration ? It can't be undo.",
        callback: this.refresh
      });
    },

    goBack() {
      this.visitSelected = undefined;
    },

    refresh() {
      this.$emit("refresh");
    }
  }
};
</script>

<style scoped>
.content,
.content .visits,
.content .tasks {
  width: 100%;
  height: 100%;
}

.content .visits {
  background: transparent;
  overflow-x: hidden;
  overflow-y: auto;
}

.content .visits .empty {
  width: 100%;
  height: 100%;
  font-size: 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content .visits .empty div {
  margin-bottom: 10px;
}
</style>