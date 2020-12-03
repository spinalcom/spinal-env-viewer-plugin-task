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
    <md-dialog-title class="_dialogTitle">Delete event(s)</md-dialog-title>

    <md-dialog-content>
      <div v-if="event && event.reference">
        <div v-for="choice of choices"
             :key="choice.value">
          <md-radio v-model="userChoice"
                    :value="choice.value"
                    class="md-primary">{{choice.message}}</md-radio>
        </div>

      </div>
      <div v-else>
        Do you want to remove this event ?
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>

      <md-button class="md-primary"
                 @click="closeDialog(true)">YES</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { SpinalEventService } from "spinal-env-viewer-task-service";
import EventBus, { EVENT_TYPES } from "../../js/event";
export default {
  name: "confirmDialog",
  props: ["onFinised"],
  data() {
    this.choices = [
      {
        message: "Remove only this event",
        value: 1,
      },
      {
        message: "Remove this event and all previous events of the same type",
        value: 2,
      },
      {
        message: "Remove this event and all next events of the same type",
        value: 3,
      },
      {
        message: "Remove this event and all events of the same type",
        value: 4,
      },
    ];

    this.events = [];

    return {
      // title: "",
      // message: "",
      event: undefined,
      userChoice: 1,
      callback: undefined,
      showDialog: true,
    };
  },
  mounted() {},
  methods: {
    async opened(option) {
      this.event = option.event;
      this.callback = option.callback;

      // this.message = option.message;
      // this.title = option.title;
      if (this.event.reference) {
        this.events = await this.getEvents(
          this.event.nodeId,
          this.event.reference
        );
      }
    },

    async removed(option) {
      if (option) {
        const eventTodelete = this.getEventToDelete(this.events, this.event);
        const promises = eventTodelete.map(async (el) => {
          const id = el.id;
          await SpinalEventService.removeEvent(id);
          EventBus.$emit(EVENT_TYPES.DELETED, id);
        });

        await Promise.all(promises);
      }

      typeof this.callback === "function" && this.callback(option);

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    getEvents(nodeId, reference) {
      if (!nodeId) return [];
      return SpinalEventService.getEvents(nodeId).then((result) => {
        const events = result.filter((el) => {
          return el.reference && el.reference.get() == reference;
        });

        return events.map((el) => el.get());
      });
    },

    getEventToDelete(events, event) {
      switch (this.userChoice) {
        case 1:
          //only event
          return events.filter((el) => el.id === event.id);
        case 2:
          //event && previous
          return events.filter((el) => el.startDate <= event.startDate);
        case 3:
          //event && next
          return events.filter((el) => el.startDate >= event.startDate);
        case 4:
          //all events

          return events;
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

