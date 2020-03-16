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
  <md-speed-dial class="content"
                 md-direction="top"
                 md-event="click">
    <md-speed-dial-target class="md-fab md-mini md-primary">
      <md-icon class="md-morph-initial">menu</md-icon>
      <md-icon class="md-morph-final">menu_open</md-icon>
    </md-speed-dial-target>

    <md-speed-dial-content class="mdSpeedDialBtn">
      <md-button v-for="(btn, index) in buttons"
                 :key="index"
                 class="md-primary md-dense"
                 @click="btn.action">
        <md-icon>{{ btn.icon }}</md-icon>
        &nbsp;
        {{ btn.text }}
      </md-button>

      <!-- <create-attribute :show="showAttrTooltip"
                            @open='openCreateAttrTooltips'
                            :itemFiltered="itemsSelected"
                            @validate="createAttribute"></create-attribute> -->
    </md-speed-dial-content>
  </md-speed-dial>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

export default {
  name: "fabComponent",
  props: {
    itemsSelected: {
      default: []
    }
  },
  data() {
    this.buttons = [
      {
        icon: "settings_applications",
        text: "Tasks Configuration",
        action: this.openConfigurationDialogs
      },
      {
        icon: "notifications",
        text: "Generate Events",
        action: this.generateEvent
      }
    ];
    return {};
  },
  methods: {
    generateEvent() {
      if (this.itemsSelected && this.itemsSelected.length > 0) {
        spinalPanelManagerService.openPanel(
          "generateEventDialog",
          this.itemsSelected
        );
      } else {
        alert("no item selected !!");
      }
    },

    openConfigurationDialogs() {
      spinalPanelManagerService.openPanel("configTaskDialog", {});
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>