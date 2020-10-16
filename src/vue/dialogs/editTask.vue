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
    <md-dialog-title class="_dialogTitle">Edit Event</md-dialog-title>

    <md-dialog-content class="_dialogContainer">

      <div class="taskForm">

        <div class="container">
          <md-field>
            <label>Name</label>
            <md-input v-model="event.name"></md-input>
          </md-field>

          <div class="dates">
            <div class="begin">
              <datetime v-model="event.startDate"
                        :min-datetime="startDateMin"
                        :title="'Start date'"
                        :type="'datetime'"
                        :input-id="'startDate'"
                        :input-style="beginInputStyle">
                <label for="startDate"
                       slot="before">Start date</label>
              </datetime>
            </div>

            <div class="end">
              <datetime v-model="event.endDate"
                        :min-datetime="endDateMin"
                        :max-datetime="endDateMax"
                        :title="'End date'"
                        :type="'datetime'"
                        :input-id="'endDate'"
                        :input-style="beginInputStyle">
                <label for="endDate"
                       slot="before">End date</label>
              </datetime>
            </div>
          </div>

          <!-- <div class="md-layout md-gutter periodicity">
            <div class="md-layout-item md-size-100 radios">
              <md-radio v-model="event.repeat"
                        class="md-primary"
                        :value="true">Repeat Once</md-radio>
              <md-radio v-model="event.repeat"
                        class="md-primary"
                        :value="false">Repeat every</md-radio>
            </div>

            <div class="md-layout-item md-size-50 number"
                 v-if="event.repeat">
              <md-field>
                <md-input v-model="event.periodicity.count"
                          type="number"
                          placeholder="A nice placeholder"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-50 period"
                 v-if="event.repeat">
              <md-field>
                <label for="Period">Period</label>
                <md-select v-model="event.periodicity.period"
                           name="Period"
                           id="Period">

                  <md-option v-for="(period,index) of Object.keys(PERIODS)"
                             :key="index"
                             :value="PERIODS[period]"
                             selected>{{period}}</md-option>

                </md-select>
              </md-field>
            </div>
          </div> -->

          <!-- <div class="description">
            <md-field>
              <label>Description</label>
              <md-textarea v-model="event.description"></md-textarea>
            </md-field>
          </div> -->

        </div>
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>

      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disableOkBtn()">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { SpinalEventService, Period } from "spinal-env-viewer-task-service";
import { Datetime } from "vue-datetime";
import SelectTaskGroup from "../components/selectTaskGroup.vue";
import TaskForm from "../components/taskForm.vue";
import moment from "moment";
import { SpinalForgeViewer } from "spinal-env-viewer-plugin-forge";
import EventBus, { EVENT_TYPES } from "../../js/event";

export default {
  name: "editTaskDialog",
  components: {
    datetime: Datetime,
  },
  props: ["onFinised"],
  data() {
    this.PERIODS = Object.freeze(Period);

    // this.PAGES = {
    //   selection: 0,
    //   creation: 1,
    // };

    this.beginInputStyle = {
      "border-bottom": "1px solid white",
      width: "100%",
    };

    return {
      //   periodicity: { count: 1, period: 86400000 },
      // event.repeat: true,
      endDateMin: null,
      endDateMax: null,
      startDateMin: null,
      event: {
        contextId: "",
        groupId: "",
        categoryId: "",
        assignedTo: "",
        startDate: "",
        endDate: "",
        // periodicity: { count: 1, period: 86400000 },
        name: "",
        // description: "",
        // repeat: false,
      },
      showDialog: true,
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.startDateMin = moment().toISOString();

      option.startDate = moment(option.startDate).toISOString();
      option.endDate = moment(option.endDate).toISOString();

      this.event = option;
      delete this.event.repeat;
    },

    async removed(option) {
      if (option) {
        SpinalEventService.updateEvent(this.event.id, this.event).then(
          (result) => {
            EventBus.$emit(EVENT_TYPES.UPDATED, this.event);
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

    disableOkBtn() {
      const condition =
        this.event.startDate &&
        this.event.startDate.toString().trim().length > 0 &&
        this.event.endDate &&
        this.event.endDate.toString().trim().length > 0 &&
        this.event.periodicity &&
        this.event.periodicity.toString().trim().length > 0 &&
        this.event.name &&
        this.event.name.toString().trim().length > 0;

      if (!this.event.repeat) return !condition;

      return !(condition && this.event.periodicity.count >= 1);
    },
  },

  watch: {
    "event.startDate": function () {
      this.endDateMin = this.event.startDate;
      this.endDateMax = moment(
        new Date(this.event.startDate).setHours(23, 59, 59, 999)
      ).toISOString();

      this.event.endDate = moment(this.event.startDate)
        .add(1, "h")
        .toISOString();
    },
  },
};
</script>

<style scoped>
._dialogTitle {
  text-align: center;
}

._dialogContainer {
  width: 400px;
  height: 450px;
}

._dialogContainer .taskForm {
  width: 100%;
  height: 100%;
}

/* ._dialogContainer .taskForm .toolbarHeader {
  min-height: unset;
  height: 50px;
  background-color: transparent;
} */

._dialogContainer .taskForm .container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
}

._dialogContainer .taskForm .container .dates {
  display: flex;
  justify-content: space-between;
}

._dialogContainer .taskForm .container .dates .begin,
._dialogContainer .taskForm .container .dates .end {
  width: 49%;
}

._dialogContainer .taskForm .container .periodicity .radios {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>

