<template>
  <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)"
             v-if="item"
             style="min-width : 627px; min-height : 430px">

    <md-dialog-title style="text-align : center">
      Remove "{{item.name}}"
    </md-dialog-title>

    <md-dialog-content class="dialogContainer">

      <!-- <div class="md-subheading">
        Do you want remove <b>"{{item.name}}"</b> ?
      </div> -->

      <div>
        <md-checkbox v-model="removeVisit">Remove Visit
          <small class="descriptionSpan">(It will remove The Visit.)</small>
        </md-checkbox>
      </div>

      <div>
        <md-checkbox v-model="removeRelatedEvent">Remove related events
        </md-checkbox>
      </div>

      <div class="removeEvents"
           v-if="removeRelatedEvent">
        <div>
          <md-radio name="removeAll"
                    v-model="eventsToRemove.all"
                    :value="true">All
            <small class="descriptionSpan">(It will remove All events
              related.)</small>
          </md-radio>

        </div>

        <div>
          <md-radio name="removeAll"
                    v-model="eventsToRemove.all"
                    :value="false">personalize
            <small class="descriptionSpan">(It will remove All event between two
              dates.)</small>
          </md-radio>

        </div>

        <div v-if="!eventsToRemove.all">
          <div class="inputDiv">

            <div class="calendarInput">
              <md-datepicker :md-model-type="Number"
                             v-model="eventsToRemove.beginDate">
                <label>From</label>
              </md-datepicker>
            </div>

            <div class="calendarInput">
              <md-datepicker :md-model-type="Number"
                             v-model="eventsToRemove.endDate">
                <label>To</label>
              </md-datepicker>
            </div>

          </div>

          <div class="referenceDiv">
            <md-field>
              <label>Reference</label>
              <md-input v-model="eventsToRemove.reference"></md-input>
            </md-field>
          </div>

        </div>
      </div>

    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">Cancel</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="disableButton()">Yes</md-button>
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
      removeRelatedEvent: false,
      eventsToRemove: {
        all: true,
        beginDate: undefined,
        endDate: undefined,
        reference: ""
      },
      removeVisit: false,
      item: null,
      showDialog: true
    };
  },
  mounted() {
    this.$material.locale.dateFormat = "dd/MM/yyyy";
  },
  methods: {
    opened(option) {
      this.item = option;
    },

    removed(option) {
      if (option) {
        let dateToAdd = 1577847600000; // 50 ans en miliseconds

        if (this.eventsToRemove.all) {
          this.eventsToRemove.beginDate = 0;
          this.eventsToRemove.endDate = Date.now() + dateToAdd;
        } else {
          if (!this.eventsToRemove.beginDate) {
            this.eventsToRemove.beginDate = 0;
          }

          if (!this.eventsToRemove.endDate) {
            this.eventsToRemove.endDate = Date.now() + dateToAdd;
          }
        }

        taskService.deleteVisit(
          this.item.id,
          this.removeVisit,
          this.removeRelatedEvent,
          this.eventsToRemove.beginDate,
          this.eventsToRemove.endDate,
          this.eventsToRemove.reference
        );
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised(closeResult);
      }
    },

    disableButton() {
      if (!this.removeVisit && !this.removeRelatedEvent) {
        return true;
      } else if (
        this.removeRelatedEvent &&
        !this.eventsToRemove.all &&
        !this.eventsToRemove.beginDate &&
        !this.eventsToRemove.endDate
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>


<style scoped>
.dialogContainer {
  margin-left: 20px;
}

.removeEvents {
  margin-left: 25px;
}

.descriptionSpan {
  color: grey;
  font-size: 13px;
  /* font-weight: bold; */
}

.inputDiv {
  width: calc(100% - 25px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendarInput {
  width: 45%;
}

.referenceDiv {
  width: 95%;
}
</style>