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
  <div class="visits">
    <div
      class="visit"
      v-for="(visit, index) in allVisits"
      :key="index"
      @click="select(visit)"
    >
      {{ visit.name }}
    </div>

    <md-button
      @click="createVisitContextDialog"
      class="md-primary md-fab md-mini md-fab-bottom-right"
    >
      <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
import taskService from "spinal-env-viewer-task-service";

import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

export default {
  name: "visitComponent",
  props: ["visitSelected"],
  data() {
    return {
      allVisits: []
    };
  },
  mounted() {
    this.allVisits = taskService.getAllVisits();
  },
  methods: {
    select(item) {
      this.$emit("selectVisit", item);
    },
    createVisitContextDialog() {
      spinalPanelManagerService.openPanel("createVisitContextDialog", {
        callback: () => {
          this.allVisits = taskService.getAllVisits();
        }
      });
    }
  }
};
</script>

<style scoped>
.visits {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.visits .visit {
  width: 40%;
  height: 150px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  text-align: center;
}

.visits .visit:hover {
  background: gray;
  cursor: pointer;
}
</style>
