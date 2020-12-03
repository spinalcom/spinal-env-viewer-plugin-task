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
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title class="_dialogTitle">Create Task Context</md-dialog-title>

    <md-dialog-content>
      <md-field>
        <label>Context name</label>
        <md-input v-model="name"></md-input>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { SpinalEventService } from "spinal-env-viewer-task-service";

export default {
  name: "createTaskContextDialog",
  props: ["onFinised"],
  data() {
    return {
      name: "",
      showDialog: true,
      callback: undefined,
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      if (option.callback) {
        this.callback = option.callback;
      }
    },

    async removed(option) {
      if (option) {
        SpinalEventService.createEventContext(this.name.trim(), []).then(
          (el) => {
            if (this.callback && typeof this.callback === "function") {
              this.callback(el.get());
            }
          }
        );
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    disabled() {
      return !(this.name && this.name.trim().length > 0);
    },
  },
};
</script>

<style scoped>
._dialogTitle {
  text-align: center;
}
</style>