<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             style="max-width : 350px">

    <md-dialog-title style="text-align : center">
      Remove
    </md-dialog-title>

    <md-dialog-content v-if="item">

      <div class="md-subheading">
        Do you want remove <b>"{{item.name}}"</b> ?
      </div>

      <md-checkbox v-model="removeRelatedEvent">Remove related events <br />
        <span v-if="removeRelatedEvent"
              style="color : red">It will remove all related events.</span>
      </md-checkbox>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)">Yes</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
import taskService from "spinal-env-viewer-task-service";

export default {
  name: "removeItemDialog",
  props: ["onFinised"],
  data() {
    return {
      removeRelatedEvent: true,
      item: null,
      showDialog: true
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.item = option;
    },

    removed(option) {
      if (option) {
        taskService.deleteVisit(this.item.id, this.removeRelatedEvent);
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    }
  }
};
</script>
