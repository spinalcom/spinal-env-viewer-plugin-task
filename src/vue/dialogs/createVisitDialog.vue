<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">

    <md-dialog-title>{{title}}</md-dialog-title>

    <md-dialog-content>

      <md-field>
        <label>Task Name</label>
        <md-input v-model="taskName"
                  required></md-input>
      </md-field>

      <div class="md-layout periodicity">
        <md-field class="md-layout-item md-size-45">
          <label>Periodicity</label>
          <md-input v-model="periodicity.number"
                    type="number"
                    required></md-input>
        </md-field>

        <md-field class="md-layout-item md-size-45">
          <md-select required
                     v-model="periodicity.mesure"
                     name="periodicity"
                     id="periodicity"
                     placeholder="Mesure">
            <!-- <md-option value="0">Day(s)</md-option>
            <md-option value="1">Week(s)</md-option>
            <md-option value="2">Month(s)</md-option>
            <md-option value="3">Year(s)</md-option> -->

            <md-option v-for="(option,index) in periodicityMesures"
                       :value="index"
                       :key="index">
              {{option}}
            </md-option>

          </md-select>
        </md-field>

      </div>

      <div class="md-layout periodicity">
        <span class="md-error md-layout-item md-size-100"
              v-if="!interventionValid()">Intervention is not valid</span>
        <md-field class="md-layout-item md-size-45">
          <label>Intervention Time</label>
          <md-input v-model="intervention.number"
                    type="number"></md-input>
        </md-field>

        <md-field class="md-layout-item md-size-45">
          <md-select v-model="intervention.mesure"
                     name="intervention"
                     id="intervention"
                     placeholder="Mesure">
            <!--
            <md-option value="0">Minute(s)</md-option>
            <md-option value="1">Day(s)</md-option>
            <md-option value="2">Week(s)</md-option>
            <md-option value="3">Month(s)</md-option>
            <md-option value="4">Year(s)</md-option> -->

            <md-option value="">None</md-option>
            <md-option v-for="(option,index) in interventionMesures"
                       :value="index"
                       :key="index">
              {{option}}
            </md-option>

          </md-select>
        </md-field>

      </div>

      <md-field>
        <label>Description</label>
        <md-textarea v-model="description"></md-textarea>
      </md-field>

      <!-- <md-field>
        <md-select v-model="type"
                   name="visitType"
                   id="visitType"
                   placeholder="Visit Type">
          <md-option v-for="(visit,index) in visits"
                     :key="index"
                     :value="visit.id">{{visit.name}}</md-option>
        </md-select>
      </md-field> -->

      <!-- <div>
        <span class="md-subheading">Begin Date</span>
        <md-datepicker v-model="beginDate"
                       :md-override-native="false"
                       :md-disabled-dates="disablePassDate" />
      </div> -->

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disabled()">Save</md-button>
    </md-dialog-actions>

  </md-dialog>
</template>

<script>
import taskService from "spinal-env-viewer-task-service";

export default {
  name: "createVisitDialog",
  props: ["onFinised", ""],
  data() {
    this.periodicityMesures = ["day(s)", "week(s)", "month(s)", "year(s)"];
    this.interventionMesures = [
      "minute(s)",
      "day(s)",
      "week(s)",
      "month(s)",
      "year(s)"
    ];
    this.visitToEditId;
    return {
      // visits: [],
      title: "",
      taskName: "",
      periodicity: { number: "1", mesure: "0" },
      intervention: { number: "", mesure: "" },
      description: "",
      visitId: "",
      // type: "",
      // beginDate: null,
      groupId: null,
      showDialog: true,
      create: false
    };
  },
  mounted() {
    // this.getAllVisitType().then(res => {
    //   this.visits = res;
    // });
  },
  methods: {
    opened(option) {
      this.create = option.create;
      this.groupId = option.groupId;
      this.visitId = option.visitId;
      this.visitToEditId = option.itemId;

      if (option.create) {
        this.title = "Create Visit";
      } else {
        this.title = "Edit Visit";
        this.description = option.description;
        this.taskName = option.name;
        this.intervention.number = option.intervention.number + "";

        this.periodicity.number = option.periodicity.number + "";

        let periodMesure = this.periodicityMesures.indexOf(
          option.periodicity.mesure
        );

        let interventionMesure = this.interventionMesures.indexOf(
          option.intervention.mesure
        );

        this.periodicity.mesure = periodMesure != -1 ? periodMesure + "" : "";

        this.intervention.mesure =
          interventionMesure != -1 ? interventionMesure + "" : "";
      }
    },

    removed(option) {
      if (option && this.create) {
        taskService.addVisitOnGroup(
          this.groupId,
          this.taskName,
          Number(this.periodicity.number),
          Number(this.periodicity.mesure),
          this.visitId,
          this.intervention.number !== ""
            ? Number(this.intervention.number)
            : undefined,
          this.intervention.mesure !== ""
            ? Number(this.intervention.mesure)
            : undefined,
          this.description
        );
      } else if (option && !this.create) {
        let valueObj = {
          name: this.taskName,
          description: this.description,
          periodicity: {
            number: Number(this.periodicity.number),
            mesure: Number(this.periodicity.mesure)
          },
          intervention: {
            number:
              this.intervention.number !== ""
                ? Number(this.intervention.number)
                : undefined,
            mesure:
              this.intervention.mesure !== ""
                ? Number(this.intervention.mesure)
                : undefined
          }
        };

        console.log(valueObj.intervention);

        taskService.editVisit(this.visitToEditId, valueObj);
      }

      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },
    // getAllVisitType() {
    //   return taskService.getAllVisits().then(res => {
    //     return res.map(el => el.get());
    //   });
    // },

    disabled() {
      return (
        this.taskName.trim().length === 0 ||
        this.periodicity.number.trim().length === 0 ||
        !this.interventionValid()
      );
    },

    interventionValid() {
      return (
        (this.intervention.number !== "" && this.intervention.mesure !== "") ||
        (this.intervention.number === "" && this.intervention.mesure === "")
      );
    }

    // disablePassDate(argDate) {
    //   let date = new Date(argDate);
    //   let now = new Date();

    //   if (
    //     date.getFullYear() === now.getFullYear() &&
    //     date.getMonth() === now.getMonth() &&
    //     date.getDay() === now.getDay()
    //   ) {
    //     return false;
    //   }

    //   return date.getTime() <= now.getTime();
    // }
  }
};
</script>

<style scoped>
.periodicity {
  justify-content: space-between;
}
</style>
