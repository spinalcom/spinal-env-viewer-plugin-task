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
    <md-dialog-title>Create task Configuration</md-dialog-title>

    <md-dialog-content>
      <md-field>
        <label>Configuration Name</label>
        <md-input v-model="name"
                  required></md-input>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { spinalTaskConfigurationService } from "spinal-env-viewer-task-service";

export default {
  name: "createTaskConfigurationDialog",
  props: ["onFinised"],
  data() {
    this.edit = false;
    return {
      name: "",
      callback: null,
      id: null,
      showDialog: true
    };
  },
  mounted() {
    // this.getAllVisitType().then(res => {
    //   this.visits = res;
    // });
  },
  methods: {
    opened(option) {
      this.name = option.name ? option.name : "";
      this.id = option.id;
      this.edit = option.edit ? option.edit : false;
      this.callback = option.callback;
    },

    async removed(option) {
      if (option) {
        if (this.edit) {
          await spinalTaskConfigurationService.editConfiguration(
            this.id,
            this.name.trim()
          );
        } else {
          await spinalTaskConfigurationService.addConfiguration(
            this.name.trim()
          );
        }

        if (this.callback) this.callback();
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    disabled() {
      return !this.name || this.name.trim().length === 0;
    }
  }
};
</script>
