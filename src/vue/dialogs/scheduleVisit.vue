<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">

    <md-dialog-title>Schedule Visit</md-dialog-title>

    <md-dialog-content>

      <span class="md-subheading">Schedule Visit</span>

      <div>

        <md-datepicker :md-model-type="Number"
                       v-model="beginDate">
          <label>To</label>
        </md-datepicker>

      </div>

      <div>
        <md-datepicker :md-model-type="Number"
                       v-model="endDate"
                       :disabled="typeof beginDate !== 'undefined'">
          <label>At</label>
        </md-datepicker>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="!isDiabled()">Save</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
import taskService from "spinal-env-viewer-task-service";

export default {
  name: "scheduleVisitDialog",
  props: ["onFinised", ""],
  data() {
    return {
      beginDate: undefined,
      endDate: undefined,
      showDialog: true,
      groupId: "",
      visitType: "",
      data: []
    };
  },
  mounted() {
    this.$material.locale.dateFormat = "dd/MM/yyyy";
  },

  methods: {
    opened(option) {
      this.groupId = option.groupId;
      this.visitType = option.visitId;
      this.data = option.data.map(el => {
        return {
          id: el.id,
          name: el.name,
          periodNumber: el.periodicity.number,
          periodMesure: ["day(s)", "week(s)", "month(s)", "year(s)"].indexOf(
            el.periodicity.mesure
          )
        };
      });
    },

    removed(option) {
      if (option) {
        taskService.generateEvent(
          this.visitType,
          this.groupId,
          this.beginDate,
          this.endDate,
          this.data
        );
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    isDiabled() {
      return (
        typeof this.beginDate !== "undefined" &&
        typeof this.endDate !== "undefined" &&
        new Date(this.endDate).getTime() > new Date(this.beginDate).getTime()
      );
    }
  }
};
</script>

<style scoped>
</style>
