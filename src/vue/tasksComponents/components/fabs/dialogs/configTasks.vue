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
  <md-dialog class="dialog"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Managetasks
    </md-dialog-title>

    <md-dialog-content class="dialoContainer">
      <visit-component :visits="allVists"
                       @refresh="getAllVisits"></visit-component>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Submit</md-button> -->
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import VisitsComponent from "../../../../configComponents/components/visits/visitsComponent.vue";
import spinalTaskConfigurationService from "spinal-env-viewer-task-service/build/classes/Configuration";

export default {
  name: "configTaskDialog",
  props: ["onFinised"],
  components: {
    "visit-component": VisitsComponent
  },
  data() {
    return {
      showDialog: true,
      allVists: []
    };
  },
  methods: {
    async opened(option) {
      this.getAllVisits();
    },
    removed(option) {
      this.showDialog = false;
    },
    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    async getAllVisits() {
      this.allVists = await spinalTaskConfigurationService.getConfigurations();
    }
  }
};
</script>

<style scoped>
.dialog {
  width: 800px;
  height: 700px;
}

.dialog .dialoContainer {
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
}
</style>