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
  <md-content class="event_container"
              v-if="event">
    <div class="details_container">

      <md-content class="details md-scrollbar">
        <div class="detail">
          <div class="label">Name</div>
          <div class="value">{{event.name}}</div>
        </div>

        <div class="detail"
             v-if="event.user">
          <div class="label">Created By</div>
          <div class="value">{{event.user.username}}</div>
        </div>

        <div class="detail">
          <div class="label">Sart Date</div>
          <div class="value">{{event.startDate | formatDate}}</div>
        </div>

        <div class="detail">
          <div class="label">End Date</div>
          <div class="value">{{event.endDate | formatDate}}</div>
        </div>

        <!-- <div class="detail">
          <div class="label">Periodicty</div>
          <div class="value">{{event.periodicity | periodicityFilter}}</div>
        </div> -->

      </md-content>

      <div class="actions">

        <div class="standard_buttons action">
          <md-button class="md-icon-button md-primary"
                     title="select on 3D model"
                     @click="selectOnMaquette">
            <md-icon>find_in_page</md-icon>
          </md-button>

          <md-button class="md-icon-button md-primary"
                     title="isolate on 3D model"
                     @click="isolateOnMaquette">
            <md-icon>settings_overscan</md-icon>
          </md-button>

          <md-button class="md-icon-button md-primary"
                     title="zoom on 3D model"
                     @click="zoomOnMaquette">
            <md-icon>zoom_in</md-icon>
          </md-button>
        </div>

        <md-button class="md-dense md-primary action"
                   @click="editEvent">
          <md-icon>edit</md-icon>
          Edit Event
        </md-button>

        <md-button class="md-dense md-accent cancel-action"
                   @click="cancelEvent">
          <md-icon>event_busy</md-icon>
          Cancel Event
        </md-button>

      </div>

    </div>

    <div class="notes_logs">
      <md-content class="notes md-scrollbar">
        <message-component :nodeInfo="nodeInfo"></message-component>
      </md-content>
      <div class="logs"></div>
    </div>

  </md-content>
  <md-content class="event_container"
              v-else>
    Event not found
  </md-content>
</template>

<script>
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalEventService, Period } from "spinal-env-viewer-task-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import TasksCalendar from "../components/tasksCalendar.vue";
import moment from "moment";
import messageComponentVue from "spinal-env-viewer-plugin-documentation/view/notes/components/messageComponent.vue";

import isolateBtn from "../../buttons/standard_buttons/isolate";
import selectBtn from "../../buttons/standard_buttons/select";
import zoomBtn from "../../buttons/standard_buttons/zoom";
import EventBus, { EVENT_TYPES } from "../../js/event";

export default {
  name: "seeEventDetail",
  components: {
    "message-component": messageComponentVue,
  },
  data() {
    this.DETAILS = ["name"];
    return {
      event: {},
      nodeInfo: {},
    };
  },
  mounted() {
    EventBus.$on(EVENT_TYPES.UPDATED, (event) => {
      if (this.event.id === event.id) {
        this.event = event;
      }
    });

    EventBus.$on(EVENT_TYPES.DELETED, (id) => {
      if (this.event.id === id) {
        this.event = undefined;
      }
    });
  },
  methods: {
    async opened(event) {
      const realNode = SpinalGraphService.getRealNode(event.id);
      this.event = realNode.info.get();
      this.nodeInfo = { selectedNode: realNode };

      const name = event.name;
      this.setTitle(name);
    },
    closed() {},

    editEvent() {
      spinalPanelManagerService.openPanel(
        "editTaskDialog",
        Object.assign({}, this.event)
      );
    },

    setTitle(title) {
      spinalPanelManagerService.panels.seeEventDetail.panel.setTitle(
        `Event Detail Panel : ${title}`
      );
    },

    selectOnMaquette() {
      const params = {
        selectedNode: this.nodeInfo.selectedNode.info,
        context: SpinalGraphService.getInfo(this.event.contextId),
      };
      selectBtn.action(params);
    },

    isolateOnMaquette() {
      const params = {
        selectedNode: this.nodeInfo.selectedNode.info,
        context: SpinalGraphService.getInfo(this.event.contextId),
      };
      isolateBtn.action(params);
    },

    zoomOnMaquette() {
      const params = {
        selectedNode: this.nodeInfo.selectedNode.info,
        context: SpinalGraphService.getInfo(this.event.contextId),
      };
      zoomBtn.action(params);
    },

    cancelEvent() {
      spinalPanelManagerService.openPanel("confirmDialog", {
        title: "Delete",
        message: "Do you want to remove this event ?",
        callback: (res) => {
          if (res) {
            SpinalEventService.removeEvent(this.event.id).then((result) => {
              EventBus.$emit(EVENT_TYPES.DELETED, this.event.id);
              this.event = undefined;
            });
          }
        },
      });
    },
  },
  filters: {
    formatDate: (date) => {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    // periodicityFilter: (periodicity) => {
    //   if (periodicity >= Period.day && periodicity < Period.week) {
    //     return `${periodicity / Period.day} day(s)`;

    //   } else if(periodicity >= Period.week && periodicity < Period.month) {
    //     return `${periodicity / Period.week} week(s)`;
    //   }
    //   else {
    //     return "once";
    //   }
    // },
  },
};
</script>

<style scoped>
.event_container {
  width: 98%;
  height: calc(100% - 15px);
  background-color: transparent;
  margin: auto;
}

.event_container .details_container {
  width: 100%;
  height: 49%;
  display: flex;
  justify-content: space-between;
}

.event_container .details_container .details {
  width: 49%;
  height: 100%;
  background-color: transparent;
  overflow: auto;
}

.event_container .details_container .details .detail {
  width: 98%;
  height: 49px;
  margin: auto;
  display: flex;
  justify-content: space-between;
}

.event_container .details_container .details .detail div {
  display: flex;
  align-items: center;
}

.event_container .details_container .actions {
  width: 49%;
  height: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
  /* justify-content: center; */
  /* flex-wrap: wrap; */
}

.event_container .details_container .actions .action {
  /* width: 90%; */
  /* min-width: 195px; */
  /* height: 60px; */
  width: 50%;
  border: 1px solid #448aff;
  margin-bottom: 5px;
  display: flex;
}

.event_container .details_container .actions .action .standard_buttons {
  justify-content: space-between;
}

.event_container .details_container .actions .cancel-action {
  border: 1px solid #ff5252;
  width: 50%;
  margin-bottom: 5px;
  display: flex;
}

.event_container .notes_logs {
  width: 100%;
  height: 48%;
  display: flex;
  justify-content: space-between;
}

.event_container .notes_logs .notes {
  width: 50%;
  height: 100%;
  overflow: auto;
  background-color: transparent;
  border: 1px solid gray;
}

.event_container .notes_logs .logs {
  width: 49%;
  height: 100%;
  border: 1px solid gray;
}
</style>

<style>
.event_container .details_container .actions .action .md-ripple {
  padding: 0px;
}
</style>