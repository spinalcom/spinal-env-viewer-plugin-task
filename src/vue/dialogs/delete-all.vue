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
    <md-dialog-title class="_dialogTitle">Delete</md-dialog-title>

    <md-dialog-content>
      <!-- <md-list>
        <md-subheader>Select to remove</md-subheader>
        <md-list-item v-for="event of events"
                      :key="event.id">
          <md-checkbox class="md-primary"
                       v-model="event.selected" />
          <span class="md-list-item-text">{{event.title}}</span>
        </md-list-item>
      </md-list> -->
      Do you want delete all events ?
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>

      <md-button class="md-accent"
                 @click="closeDialog(true)">DELETE</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { SpinalEventService } from "spinal-env-viewer-task-service";
import EventBus, { EVENT_TYPES } from "../../js/event";

export default {
  name: "deleteAllDialog",
  props: ["onFinised"],
  data() {
    return {
      callback: undefined,
      events: [],
      showDialog: true,
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.callback = option.callback;
      this.events = option.events;
      // this.events = option.events.map((el) => {
      //   return el;
      // });
    },

    async removed(option) {
      if (option) {
        const promises = this.events.map(async (el) => {
          await SpinalEventService.removeEvent(el.id);
          EventBus.$emit(EVENT_TYPES.DELETED, el.id);
          return;
        });
        await Promise.all(promises);
        // typeof this.callback === "function" && this.callback(option);
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
  },
};
</script>

<style scoped>
._dialogTitle {
  text-align: center;
}
</style>