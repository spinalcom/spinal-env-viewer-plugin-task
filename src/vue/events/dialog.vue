<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             v-if="eventSelected"
             class="editEventDialog">

    <md-dialog-title>
      Edit Events
    </md-dialog-title>

    <md-dialog-content>
      <!-- <md-tabs :md-active-tab="tabActivated"
               @md-changed="tabsChanged">
        <md-tab :id="tabs.edit"
                md-label="Edit"></md-tab>

        <md-tab :id="tabs.comments"
                md-label="Comments"></md-tab>
      </md-tabs>

      <div class="_content">
        <div class="edit"
             v-if="tabActivated === tabs.edit">
          Edit
        </div>

        <div class="comments"
             v-if="tabActivated === tabs.comments">
          Comments
        </div>
      </div>-->

      <md-list>
        <md-list-item>
          <div class="_title">
            Name
          </div>
          <div class="value">
            {{eventSelected.title}}
          </div>
        </md-list-item>

        <md-list-item>
          <md-datepicker :md-model-type="Number"
                         v-model="date">
            <label>Date</label>
          </md-datepicker>
        </md-list-item>

      </md-list>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export default {
  name: "editEventDialog",
  props: ["onFinised"],
  data() {
    // this.tabs = Object.freeze({
    //   edit: "1",
    //   comments: "2"
    // });
    return {
      showDialog: true,
      eventSelected: null,
      date: null,
      callback: null
      // tabActivated: this.tabs.edit
    };
  },
  mounted() {
    this.$material.locale.dateFormat = "dd/MM/yyyy";
  },

  methods: {
    opened(option) {
      this.eventSelected = option.data;
      this.callback = option.callback;
      this.date = new Date(option.data.endDate).getTime();
    },

    removed(option) {
      if (option) {
        let eventRealNode = SpinalGraphService.getRealNode(
          this.eventSelected.eventId
        );

        eventRealNode.info.date.set(this.date);
        if (this.callback) this.callback();
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    }

    // tabsChanged(evt) {
    //   this.tabActivated = evt;
    // }
  }
};
</script>

<style scoped>
.editEventDialog {
  width: 450px;
  height: 600px;
}

.editEventDialog ._dialogContent {
  height: 100%;
}

.editEventDialog ._content {
  width: 100%;
  height: calc(100% - 60px);
  margin-top: 10px;
  padding: 5px;
}

.editEventDialog ._content .edit,
.editEventDialog ._content .comments {
  width: 100%;
  height: 100%;
}
</style>

<style>
.editEventDialog .md-tabs.md-theme-default .md-tabs-navigation .md-button {
  width: 50%;
}
</style>