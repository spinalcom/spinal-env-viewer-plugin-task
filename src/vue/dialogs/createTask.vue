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
    <md-dialog-title class="_dialogTitle">Add Event</md-dialog-title>

    <md-dialog-content class="_dialogContainer"
                       :class="{'created' : pageSelected === PAGES.creation}">
      <select-task-group v-show="pageSelected === PAGES.selection"
                         ref="select-task-group"
                         @selectContext="selectContext"
                         @selectCategory="selectCategory"
                         @selectGroup="selectGroup">
      </select-task-group>

      <!-- <task-form v-else-if="pageSelected === PAGES.creation"
                 @back="goToBack"></task-form> -->
      <div class="taskForm"
           v-show="pageSelected === PAGES.creation">
        <md-toolbar md-elevation="0"
                    class="toolbarHeader">
          <md-button class="md-dense md-primary"
                     @click="goToBack">
            <md-icon>keyboard_backspace</md-icon>
            BACK
          </md-button>
        </md-toolbar>

        <md-content class="container md-scrollbar">
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

          <div class="md-layout md-gutter periodicity">
            <div class="md-layout-item md-size-1000 radios">
              <md-radio v-model="event.repeat"
                        class="md-primary"
                        :value="false">Repeat Once</md-radio>
              <md-radio v-model="event.repeat"
                        class="md-primary"
                        :value="true">Repeat every</md-radio>
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
                  <!-- <md-option :value="undefined"
                             selected
                             disabled>None</md-option> -->

                  <md-option v-for="(period,index) of Object.keys(PERIODS)"
                             :key="index"
                             :value="PERIODS[period]"
                             selected>{{period}}</md-option>

                </md-select>
              </md-field>
            </div>

            <div class="repeatEnd md-layout-item md-size-100"
                 v-if="event.repeat">
              <datetime v-model="event.repeatEnd"
                        :min-datetime="repeatEndMin"
                        :title="'repeat until'"
                        :type="'datetime'"
                        :input-id="'endDate'"
                        :input-style="beginInputStyle">
                <label for="endDate"
                       slot="before">repeat until</label>
              </datetime>
            </div>

          </div>

          <div class="description">
            <md-field>
              <label>Description</label>
              <md-textarea v-model="event.description"></md-textarea>
            </md-field>
          </div>

        </md-content>
      </div>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Cancel</md-button>

      <md-button class="md-primary"
                 v-if="pageSelected === PAGES.selection"
                 :disabled="disableNextBtn()"
                 @click="goToNext">NEXT</md-button>

      <md-button class="md-primary"
                 v-else-if="pageSelected === PAGES.creation"
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

import EventBus, { EVENT_TYPES } from "../../js/event";

// import { SpinalForgeViewer } from "spinal-env-viewer-plugin-forge";
// import "vue-datetime/dist/vue-datetime.css";

export default {
  name: "createTaskDialog",
  components: {
    "select-task-group": SelectTaskGroup,
    datetime: Datetime,
    "task-form": TaskForm,
  },
  props: ["onFinised"],
  data() {
    this.PERIODS = Object.freeze(Period);

    this.PAGES = {
      selection: 0,
      creation: 1,
    };

    this.beginInputStyle = {
      "border-bottom": "1px solid white",
      width: "100%",
    };

    return {
      pageSelected: this.PAGES.selection,
      // periodicity: { count: 1, period: 86400000 },
      nodeInfo: undefined,
      // repeatOnce: true,
      startDateMin: moment().toISOString(),
      endDateMin: null,
      endDateMax: null,
      repeatEndMin: null,
      repeatEndMax: null,
      event: {
        contextId: "",
        groupId: "",
        categoryId: "",
        assignedTo: "",
        startDate: moment().toISOString(),
        endDate: moment().add(1, "h").toISOString(),
        repeatEnd: null,
        periodicity: { count: 1, period: 86400000 },
        name: "",
        description: "",
        repeat: false,
      },
      showDialog: true,
    };
  },
  mounted() {},
  methods: {
    opened(option) {
      this.nodeInfo = option;
    },

    async removed(option) {
      if (option) {
        const event = Object.assign({}, this.event);
        if (typeof this.nodeInfo.selectedNode === "undefined") {
          this.nodeInfo.selectedNode = await this.createBIMObject(
            this.nodeInfo.dbid,
            this.nodeInfo.model3d
          );
        }

        const userInfo = window.spinal.spinalSystem.getUser();
        let nodeId = this.nodeInfo.selectedNode.id.get();

        event.nodeId = nodeId;
        event.startDate = moment(event.startDate).valueOf();
        event.endDate = moment(event.endDate).valueOf();
        // event.periodicity = !this.repeatOnce
        //   ? this.periodicity.count * this.periodicity.period
        //   : undefined;

        // if (this.repeatOnce) {
        await SpinalEventService.createEvent(
          event.contextId,
          event.groupId,
          nodeId,
          event,
          userInfo
        );

        EventBus.$emit(EVENT_TYPES.CREATED);

        // } else {
        //   const periodicity =
        //     event.periodicity.count * event.periodicity.period;
        //   await SpinalEventService.createTaskBetween(
        //     event.startDate,
        //     event.endDate,
        //     periodicity,
        //     event.contextId,
        //     event.groupId,
        //     nodeId,
        //     event,
        //     userInfo
        //   );
        // }
      }

      this.showDialog = false;
    },

    createBIMObject(dbId, model) {
      return new Promise((resolve, reject) => {
        model.getBulkProperties(
          [dbId],
          { propFilter: ["name"] },
          async (el) => {
            const name = el[0].name;
            // const node = await SpinalForgeViewer.bimObjectService.createBIMObject(
            const node = await window.spinal.BimObjectService.createBIMObject(
              dbId,
              name,
              model
            );
            resolve(node);
          }
        );
      });
    },

    selectContext(id) {
      this.event.contextId = id;
      this.event.groupId = undefined;
      this.event.categoryId = undefined;
    },

    selectCategory(id) {
      this.event.groupId = undefined;
      this.event.categoryId = id;
    },

    selectGroup(id) {
      this.event.groupId = id;
    },

    goToNext() {
      this.pageSelected = this.PAGES.creation;
    },

    async goToBack() {
      let reference;
      this.pageSelected = this.PAGES.selection;

      // while (typeof reference === "undefined") {
      //   reference = this.$refs["select-task-group"];
      //   console.log("reference", reference);
      // }

      // await reference.selectContext(this.contextId);
      // await reference.selectCategory(this.categoryId);
      // await reference.selectGroup(this.groupId);
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    disableNextBtn() {
      return !(
        this.event.contextId &&
        this.event.contextId.trim().length > 0 &&
        this.event.groupId &&
        this.event.groupId.trim().length > 0 &&
        this.event.categoryId &&
        this.event.categoryId.trim().length > 0
      );
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

      // return !(
      //   this.event.startDate &&
      //   this.event.startDate.toString().trim().length > 0 &&
      //   this.event.endDate &&
      //   this.event.endDate.toString().trim().length > 0 &&
      //   this.event.periodicity &&
      //   this.event.periodicity.toString().trim().length > 0 &&
      //   this.event.name &&
      //   this.event.name.toString().trim().length > 0 &&
      //   this.event.periodicity.count >= 1
      // );
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
  width: 1000px;
  height: 450px;
}

._dialogContainer.created {
  width: 400px;
  height: 450px;
}

._dialogContainer .taskForm {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

._dialogContainer .taskForm .toolbarHeader {
  min-height: unset;
  height: 50px;
  background-color: transparent;
}

._dialogContainer .taskForm .container {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
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

.description {
  margin-top: 10px;
}
/* 
._dialogContainer .taskForm .container .periodicity .number {
}
._dialogContainer .taskForm .container .periodicity .period {
} */
</style>

<style>
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity 0.4s;
}
.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}
.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.5s;
}
.vdatetime-popup {
  box-sizing: border-box;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 340px;
  max-width: calc(100% - 30px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  color: #444;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  line-height: 1.18;
  background: #fff;
  -webkit-tap-highlight-color: transparent;
}
.vdatetime-popup * {
  box-sizing: border-box;
}
.vdatetime-popup__header {
  padding: 18px 30px;
  background: #3f51b5;
  color: #fff;
  font-size: 32px;
}
.vdatetime-popup__title {
  margin-bottom: 8px;
  font-size: 21px;
  font-weight: 300;
}
.vdatetime-popup__year {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.3s;
}
.vdatetime-popup__year:hover {
  opacity: 1;
}
.vdatetime-popup__date {
  line-height: 1;
  cursor: pointer;
}
.vdatetime-popup__actions {
  padding: 0 20px 10px 30px;
  text-align: right;
}
.vdatetime-popup__actions__button {
  display: inline-block;
  border: none;
  padding: 10px 20px;
  background: 0 0;
  font-size: 16px;
  color: #3f51b5;
  cursor: pointer;
  transition: color 0.3s;
}
.vdatetime-popup__actions__button:hover {
  color: #444;
}
.vdatetime-calendar__navigation--next:hover svg path,
.vdatetime-calendar__navigation--previous:hover svg path {
  stroke: #888;
}
.vdatetime-calendar__navigation,
.vdatetime-calendar__navigation * {
  box-sizing: border-box;
}
.vdatetime-calendar__navigation {
  position: relative;
  margin: 15px 0;
  padding: 0 30px;
  width: 100%;
}
.vdatetime-calendar__navigation--next,
.vdatetime-calendar__navigation--previous {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;
}
.vdatetime-calendar__navigation--next svg,
.vdatetime-calendar__navigation--previous svg {
  width: 8px;
  height: 13px;
}
.vdatetime-calendar__navigation--next svg path,
.vdatetime-calendar__navigation--previous svg path {
  transition: stroke 0.3s;
}
.vdatetime-calendar__navigation--previous {
  left: 25px;
}
.vdatetime-calendar__navigation--next {
  right: 25px;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
.vdatetime-calendar__current--month {
  text-align: center;
  text-transform: capitalize;
}
.vdatetime-calendar__month {
  padding: 0 20px;
  transition: height 0.2s;
}
.vdatetime-calendar__month__day,
.vdatetime-calendar__month__weekday {
  display: inline-block;
  width: 14.28571%;
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;
}
.vdatetime-calendar__month__day > span,
.vdatetime-calendar__month__weekday > span {
  display: block;
  width: 100%;
  position: relative;
  height: 0;
  padding: 0 0 100%;
  overflow: hidden;
}
.vdatetime-calendar__month__day > span > span,
.vdatetime-calendar__month__weekday > span > span {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;
}
.vdatetime-calendar__month__weekday {
  font-weight: 700;
}
.vdatetime-calendar__month__day:hover > span > span {
  background: #eee;
}
.vdatetime-calendar__month__day--selected:hover > span > span,
.vdatetime-calendar__month__day--selected > span > span {
  color: #fff;
  background: #3f51b5;
}
.vdatetime-calendar__month__day--disabled {
  opacity: 0.4;
  cursor: default;
}
.vdatetime-calendar__month__day--disabled:hover > span > span {
  color: inherit;
  background: 0 0;
}
.vdatetime-time-picker__list::-webkit-scrollbar-thumb {
  background: #ccc;
}
.vdatetime-time-picker__list::-webkit-scrollbar-track {
  background: #efefef;
}
.vdatetime-time-picker * {
  box-sizing: border-box;
}
.vdatetime-time-picker {
  box-sizing: border-box;
}
.vdatetime-time-picker::after {
  content: "";
  display: table;
  clear: both;
}
.vdatetime-time-picker__list {
  float: left;
  width: 50%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.vdatetime-time-picker__list::-webkit-scrollbar {
  width: 3px;
}
.vdatetime-time-picker__with-suffix .vdatetime-time-picker__list {
  width: 33.3%;
}
.vdatetime-time-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size 0.3s;
}
.vdatetime-time-picker__item:hover {
  font-size: 32px;
}
.vdatetime-time-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}
.vdatetime-time-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}
.vdatetime-year-picker__list::-webkit-scrollbar-thumb {
  background: #ccc;
}
.vdatetime-year-picker__list::-webkit-scrollbar-track {
  background: #efefef;
}
.vdatetime-year-picker * {
  box-sizing: border-box;
}
.vdatetime-year-picker {
  box-sizing: border-box;
}
.vdatetime-year-picker::after {
  content: "";
  display: table;
  clear: both;
}
.vdatetime-year-picker__list {
  float: left;
  width: 100%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.vdatetime-year-picker__list::-webkit-scrollbar {
  width: 3px;
}
.vdatetime-year-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size 0.3s;
}
.vdatetime-year-picker__item:hover {
  font-size: 32px;
}
.vdatetime-year-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}
.vdatetime-year-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
}
.vdatetime-year-picker__item--disabled:hover {
  color: inherit;
  background: 0 0;
}
.vdatetime-month-picker__list::-webkit-scrollbar-thumb {
  background: #ccc;
}
.vdatetime-month-picker__list::-webkit-scrollbar-track {
  background: #efefef;
}
.vdatetime-month-picker * {
  box-sizing: border-box;
}
.vdatetime-month-picker {
  box-sizing: border-box;
}
.vdatetime-month-picker::after {
  content: "";
  display: table;
  clear: both;
}
.vdatetime-month-picker__list {
  float: left;
  width: 100%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.vdatetime-month-picker__list::-webkit-scrollbar {
  width: 3px;
}
.vdatetime-month-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size 0.3s;
}
.vdatetime-month-picker__item:hover {
  font-size: 32px;
}
.vdatetime-month-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}
.vdatetime-month-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
}
.vdatetime-month-picker__item--disabled:hover {
  color: inherit;
  background: 0 0;
}
</style>