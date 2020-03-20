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
    <md-dialog-title style="text-align : center">Manage Events
    </md-dialog-title>

    <md-dialog-content class="dialoContainer">
      <md-app md-waterfall
              md-mode="fixed"
              class="app-div">
        <!-- <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
      </md-app-toolbar> -->

        <md-app-drawer class="app-drawer-div"
                       md-permanent="full">
          <!-- <md-toolbar class="md-transparent"
                      md-elevation="0">
            Items selected
          </md-toolbar> -->

          <md-list>
            <md-list-item v-for="(item,index) in allItemsSelected"
                          :key="index"
                          @click="selectItem(item)"
                          :class="{'isSelect' : isSelected(item.id)}"
                          class="sidebar-item">
              <span class="md-list-item-text">{{item.name}}</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content class="app-content">

          <div class="content empty"
               v-if="!itemSelected">
            No Item Selected !
          </div>

          <div v-else
               class="content">
            <md-toolbar class="toolbar"
                        md-elevation="0">
              <div class="toolbar-item">
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

              <div class="toolbar-item">
                <md-field>
                  <label for="tasks">Task</label>
                  <md-select v-model="taskSelected"
                             @md-closed="SeeEvent"
                             name="tasks"
                             id="tasks"
                             multiple>
                    <md-option v-if="!tasksDiplayed || tasksDiplayed.length === 0"
                               :value="''"
                               disabled>No Task</md-option>

                    <md-option class="taskOption"
                               v-for="(task,index) in tasksDiplayed"
                               :key="index"
                               :value="task.id">
                      {{task.name}}
                    </md-option>
                  </md-select>
                </md-field>

              </div>

              <!-- <div class="toolbar-item">
                <md-button class="md-primary"
                           @click="SeeEvent">See events</md-button>
              </div> -->

            </md-toolbar>

            <div class="calendar">
              <calendar-component ref="calendarRef"
                                  :events="events"></calendar-component>
            </div>

          </div>

        </md-app-content>
      </md-app>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>
      <!-- <md-button class="md-primary"
                 @click="closeDialog(true)">Submit</md-button> -->
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import controllers from "../controllers/controllers.js";
import CalendarComponent from "./calendar.vue";

export default {
  name: "ManageEventsDialog",
  props: ["onFinised"],
  components: {
    "calendar-component": CalendarComponent
  },
  data() {
    this.tasks = {};
    return {
      allItemsSelected: [],
      itemSelected: undefined,
      showDialog: true,
      configurations: [],
      configurationSelected: "",
      taskSelected: [],
      tasksDiplayed: [],
      events: []
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
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    selectItem(item) {
      this.itemSelected = item.id;
    },

    async SeeEvent() {
      this.events = [];
      let calendarComponent = this.$refs["calendarRef"];
      let eventsPromise = this.taskSelected.map(taskId => {
        console.log("taskId", taskId);

        return calendarComponent.getEvents(this.itemSelected, taskId);
      });

      let res = await Promise.all(eventsPromise);
      // console.log(res);
      let events = [];
      for (const data of res) {
        // console.log("data", data);
        events.push(...this.formatEvent(data));
      }

      this.events = events;
    },
    isSelected(itemId) {
      return this.itemSelected === itemId;
    },
    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    formatEvent(data) {
      let res = [];
      for (const key of Object.keys(data)) {
        const events = data[key].map(el => {
          el["title"] = el.name;
          el["class"] = el.state;
          el["start"] = this._formatDate(el.date);
          el["end"] = this._formatDate(el.date);

          return el;

          // return {
          //   id : el.id,
          // visitId: el.visitId,
          // groupId: el.groupId,
          // contextId: this.itemSelected.visitId,
          // color: color,
          // start: this.formatDate(el.date),
          // end: this.formatDate(el.date),
          // title: el.name,
          // //content: '<i class="v-icon material-icons">calendar_today</i>',
          // class: el.state
          // }
        });

        res.push(...events);
      }

      return res;
    }
  },
  watch: {
    configurationSelected() {
      this.taskSelected = [];
      this.tasksDiplayed = this.tasks[this.configurationSelected];
    },
    itemSelected() {
      this.SeeEvent();
    }
  }
};
</script>

<style scoped>
.dialog {
  width: 100%;
  height: 700px;
}

.dialog .dialoContainer {
  width: 100%;
  height: 100%;
  padding-bottom: 0px;
}

.dialog .dialoContainer .app-div {
  width: 100%;
  height: 100%;
}

.dialog .dialoContainer .app-div .app-drawer-div {
  width: 20%;
  height: 100%;
}

.sidebar-item {
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
}

.dialog .dialoContainer .app-div .app-drawer-div .sidebar-item.isSelect {
  background: #448aff;
}

.dialog .dialoContainer .app-div .app-content {
  width: 100%;
  height: 100%;
}

.dialog .dialoContainer .app-div .app-content .content {
  width: 100%;
  height: 100%;
}

.dialog .dialoContainer .app-div .app-content .empty.content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
}

.dialog .dialoContainer .app-div .app-content .content .toolbar {
  width: 100%;
  height: 50px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  /* border: 1px dashed grey; */
  margin-bottom: 10px;
}

.dialog .dialoContainer .app-div .app-content .content .calendar {
  width: 100%;
  height: calc(100% - 60px);
}
</style>