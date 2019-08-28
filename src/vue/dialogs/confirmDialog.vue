<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">

    <md-dialog-title style="text-align : center">
      {{title}}
    </md-dialog-title>

    <md-dialog-content>

      <div v-html="message">

      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)">Yes</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
export default {
  name: "confimDialog",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      title: "",
      message: "",
      successFunc: undefined,
      cancelFunc: undefined
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.title = option.title;
      this.message = option.message;
      this.successFunc = option.validate;
      this.cancelFunc = option.cancel;
    },

    removed(option) {
      if (option && typeof this.successFunc === "function") {
        this.successFunc();
      } else if (!option && typeof this.cancelFunc === "function") {
        this.cancelFunc();
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
