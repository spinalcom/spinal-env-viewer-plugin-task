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
             @md-closed="closeDialog(false)"
             v-if="event">
    <md-dialog-title class="dialogTitle">

      <div class="name">
        <md-icon style="color : gray">event_available</md-icon>
        <!-- &nbsp; -->
        {{event.name}}
      </div>

      <div class="date">{{event.date | formatDate}}</div>
    </md-dialog-title>

    <md-dialog-content class="dialogContainer">

      <div class="comments">
        <comment-component :itemSelected="event"></comment-component>
      </div>

      <div class="actions">
        <actions-component></actions-component>
      </div>

    </md-dialog-content>

    <md-dialog-actions class="actions">
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>

      <!-- <md-menu md-direction="bottom-end"
               :mdCloseOnClick="closeOnClick"
               :mdCloseOnSelect="closeOnSelect">
        <md-button class="md-primary"
                   md-menu-trigger>
          Actions
        </md-button>

        <md-menu-content>
          <md-menu-item disabled
                        @click="data = 'click disabled'">Disabled</md-menu-item>
          <md-menu-item @click="data = 'click 1'">Click Event 1</md-menu-item>
          <md-menu-item @click="data = 'click 2'">Click Event 2</md-menu-item>
          <md-menu-item>Plain text</md-menu-item>
        </md-menu-content>
      </md-menu> -->

      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Save</md-button> -->

    </md-dialog-actions>

  </md-dialog>

</template>

<script>
import CommentComponent from "./comments/comments.vue";
import ActionsComponent from "./actions.vue";

export default {
  name: "EventDetail",
  props: ["onFinised"],
  components: {
    "comment-component": CommentComponent,
    "actions-component": ActionsComponent
  },
  data() {
    return {
      showDialog: true,
      event: undefined
    };
  },
  methods: {
    async opened(option) {
      this.event = option;
    },

    removed(option) {
      if (option) {
        console.log("hello world !!");
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    }
  },
  filters: {
    formatDate: function(argDate) {
      const date = new Date(argDate);
      const day = date.getDate();

      const fakeMonth = "0" + (date.getMonth() + 1);

      const month = fakeMonth.length === 2 ? fakeMonth : date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
  }
};
</script>

<style>
.dialog {
  width: 100%;
  height: 700px;
}

.dialog .dialogTitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.dialog .dialogTitle .name {
  color: gray;
  text-transform: uppercase;
}

.dialog .dialogTitle .date {
  color: #448aff;
}

.dialog .dialogContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dialog .dialogContainer .comments {
  width: 60%;
  height: 100%;
}

.dialog .dialogContainer .actions {
  width: 39%;
  height: 100%;
}

/* .dialog .actions {
  display: flex;
  justify-content: space-between;
} */
</style>