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
    <div class="visits"
         v-if="!visitSelected">

      <div v-if="visits.length === 0"
           class="empty">
        <div>No Configuration Found !!! </div>
        <div>Create one</div>
      </div>
      <visit-component v-for="(visit,index) in visits"
                       :key="index"
                       :visit="visit"
                       @select="selectVisit"></visit-component>

      <md-button @click="createVisitContextDialog"
                 class="md-primary md-fab md-mini md-fab-bottom-right">
        <md-icon>add</md-icon>
      </md-button>
    </div>

    <div v-else
         class="tasks">
      <table-component :visitSelected="visitSelected"
                       @goBack="goBack"></table-component>
    </div>
  </div>

</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import VisitComponent from "./visit.vue";
import TableComponent from "./table.vue";

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
        callback: () => {
          this.$emit("refresh");
        }
      });
    },
    selectVisit(visit) {
      this.visitSelected = visit;
    },

    goBack() {
      this.visitSelected = undefined;
    }
  }
};
</script>

<style lang="">
.content,
.content .visits,
.content .tasks {
  width: 100%;
  height: 100%;
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