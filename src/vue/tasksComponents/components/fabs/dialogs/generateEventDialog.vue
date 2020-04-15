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
             @md-closed="closeDialog(false)">
    <md-dialog-title style="text-align : center">Generate Events
    </md-dialog-title>

    <md-dialog-content class="dialoContainer">
      <div class="configurationSelect">
        <md-field>
          <label for="configurations">Configuration</label>
          <md-select v-model="configurationSelected"
                     name="configurations"
                     id="configurations">
            <md-option v-if="!configurations || configurations.length === 0"
                       :value="''"
                       disabled>No Configuration</md-option>
            <md-option v-for="(config,index) in configurations"
                       :key="index"
                       :value="config.id">
              {{config.name}}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="taskSelect">
        <md-field>
          <label for="tasks">Task</label>
          <md-select v-model="taskSelected"
                     name="tasks"
                     id="tasks"
                     @md-selected="selectAll"
                     multiple>
            <md-option v-if="!tasksDiplayed || tasksDiplayed.length === 0"
                       :value="''"
                       disabled>No Task</md-option>
            <!-- 
            <md-option class="selectAll"
                       v-if="tasksDiplayed && tasksDiplayed.length > 0">
              All
            </md-option> -->

            <md-option class="taskOption"
                       v-for="(task,index) in tasksDiplayed"
                       :key="index"
                       :value="task.id">
              {{task.name}}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="calendar">

        <div class="beginCalendar">
          <md-datepicker v-model="beginDate">
            <label>Select date</label>
          </md-datepicker>
        </div>

        <div class="repeat">
          <md-checkbox v-model="repeatEvent"
                       class="md-primary">Repeat Event</md-checkbox>
        </div>

        <div class="endCalendar"
             v-if="repeatEvent">
          <md-datepicker v-model="endDate">
            <label>End date</label>
          </md-datepicker>
        </div>

      </div>

      <!-- <div class="md-layout md-gutter calendar">
        <div class="beginCalendar">
          <div class="title font-weight-thin">
            Begin date
          </div>
          <v-date-picker class="vCalendar"
                         dark
                         color="#448aff"
                         v-model="beginDate"
                         :landscape="false"
                         :reactive="true"></v-date-picker>
        </div>

        <div class="endCalendar">
          <div class="title font-weight-thin">
            End date
          </div>
          <v-date-picker class="vCalendar"
                         dark
                         color="#448aff"
                         v-model="endDate"
                         :landscape="false"
                         :reactive="true"></v-date-picker>
        </div>
      </div> -->

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 :disabled="disabled()"
                 @click="closeDialog(true)">Submit</md-button>
    </md-dialog-actions>
  </md-dialog>

</template>

<script>
import controllers from "../controllers/controllers.js";
import { spinalTaskService } from "spinal-env-viewer-task-service";

export default {
  name: "generateEventsDialog",
  props: ["onFinised"],
  data() {
    this.allItemsSelected = [];
    this.tasks = {};
    return {
      showDialog: true,
      configurations: [],
      configurationSelected: "",
      tasksDiplayed: [],
      taskSelected: [],
      repeatEvent: false,
      beginDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
    async opened(option) {
      this.allItemsSelected = option;
      this.configurations = await controllers.getAllConfigurations();
      this.configurations.forEach(async config => {
        this.tasks[config.id] = await controllers.getTasks(config.id);
      });
    },

    removed(option) {
      if (option) {
        const argBegin = new Date(this.beginDate).getTime();
        let argEnd = new Date(this.endDate).getTime();

        if (!this.repeatEvent) argEnd = argBegin;

        for (const item of this.allItemsSelected) {
          for (const task of this.taskSelected) {
            spinalTaskService.generateEvents(
              this.configurationSelected,
              task,
              item.id,
              argBegin,
              argEnd
            );
          }
        }
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    selectAll(event) {
      // const index = event.indexOf(false);
      // if (index !== -1) {
      //   console.log(index);
      //   this.taskSelected = this.tasksDiplayed.map(el => el.id);
      //   this.taskSelected.push(false);
      // }
    },
    disabled() {
      const argBegin = new Date(this.beginDate).getTime();
      const argEnd = new Date(this.endDate).getTime();

      if (!this.repeatEvent) {
        return this.beginDate !== undefined;
      }

      return argBegin > argEnd;
    }
  },
  watch: {
    configurationSelected() {
      this.taskSelected = [];
      this.tasksDiplayed = this.tasks[this.configurationSelected];
    }
  }
};
</script>

<style scoped>
.dialog {
  width: 400px;
  height: 500px;
}

.dialog .dialoContainer {
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
}

.dialog .dialoContainer .configurationSelect,
.dialog .dialoContainer .taskSelect {
  width: 100%;
  height: 60px;
}

.dialog .dialoContainer .taskSelect .selectAll {
  border-bottom: 1px dashed grey;
  background: grey;
}

.dialog .dialoContainer .calendar {
  width: 100%;
  height: calc(100% - 144px);
  margin: 0px;
  padding: 0px;
  /* display: flex; */
  /* justify-content: space-between; */
}

.dialog .dialoContainer .calendar .beginCalendar,
.dialog .dialoContainer .calendar .endCalendar,
.dialog .dialoContainer .calendar .repeat {
  width: 100%;
  height: 60px;
  margin-top: 15px;
  /* display: flex;
  justify-content: space-between; */
  /* padding-left: 20px; */
}

.dialog .dialoContainer .calendar .beginCalendar .taskOption,
.dialog .dialoContainer .calendar .endCalendar .taskOption {
  display: flex;
  flex-direction: row;
}

/* .dialog .dialoContainer .calendar .beginCalendar .title,
.dialog .dialoContainer .calendar .endCalendar .title {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog .dialoContainer .calendar .beginCalendar .vCalendar,
.dialog .dialoContainer .calendar .endCalendar .vCalendar {
  width: 98% !important;
  height: 90%;
} */
</style>

<style>
.dialog .dialoContainer .calendar .md-icon {
  display: none;
}

.dialog .dialoContainer .calendar .md-input {
  padding-left: 0px;
  margin-left: 0px;
}

.dialog .dialoContainer .calendar .md-field > .md-icon ~ label {
  left: 0px;
}

.dialog .dialoContainer .calendar .v-card {
  box-shadow: none !important;
  border: 1px dashed grey;
}

.dialog .dialoContainer .calendar .v-card .v-picker__body {
  width: 100% !important;
}
</style>