
<template>
  <md-content class="myContent">
    <md-button class="md-fab md-fab-bottom-right md-mini md-primary"
               title="create visit"
               @click="createVisit">
      <md-icon>add</md-icon>
    </md-button>

    <md-list>
      <md-list-item @click="goBack">
        <md-icon>keyboard_backspace</md-icon>
        <span class="md-list-item-text">BACK</span>
      </md-list-item>
    </md-list>

    <div class="head md-layout">
      <md-button class="btn md-layout-item md-size-45"
                 @click="exportFile">
        <md-icon>file_download</md-icon>
        <span>Export</span>
      </md-button>

      <md-button class="btn md-layout-item md-size-45"
                 @click="importFile">
        <md-icon>file_download</md-icon>
        import
      </md-button>
    </div>

    <md-table class="mdTable"
              v-model="searched">
      <md-table-toolbar>

        <div class="md-toolbar-section-start">
          <h1 class="md-title">Visits</h1>
        </div>

        <div class="scheduleBtn md-toolbar-section-end">
          <md-button @click="scheduleVisit"
                     class="btn">
            <md-icon>calendar_today</md-icon>
            Schedule Visit
          </md-button>
        </div>

        <!-- <md-field md-clearable
                  class="md-toolbar-section-end">
          <md-input placeholder="Search by name..."
                    v-model="search"
                    @input="searchOnTable" />
        </md-field> -->

      </md-table-toolbar>

      <md-table-empty-state md-label="No Visits found"
                            :md-description="`No Data found. Create a new.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row"
                    slot-scope="{ item }">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>

        <md-table-cell md-label="Periodicity">
          {{`${item.periodicity.number} ${item.periodicity.mesure}`}}
        </md-table-cell>

        <md-table-cell md-label="Intervetion">
          {{displayInterventionTime(item.intervention.number,item.intervention.mesure)}}
        </md-table-cell>

        <md-table-cell md-label="Description">
          {{displayDescription(item.description)}}
        </md-table-cell>

      </md-table-row>

      <!-- <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Periodicity</md-table-head>
        <md-table-head>Intervention</md-table-head>
        <md-table-head>Description</md-table-head>

      </md-table-row>

      <md-table-row v-for="(item,index) in searched"
                    :key="index">
        <md-table-cell>{{item.name}}</md-table-cell>

        <md-table-cell>
          {{`${item.periodicity.number} ${item.periodicity.mesure}`}}
        </md-table-cell>

        <md-table-cell>
          {{`${item.intervention.number} ${item.intervention.mesure}`}}
        </md-table-cell>

        <md-table-cell>{{ item.description }}</md-table-cell>

      </md-table-row> -->

    </md-table>
  </md-content>
</template>


<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import taskService from "spinal-env-viewer-task-service";

import ExcelManager from "../../js/excelManager";

export default {
  name: "tableComponent",
  props: {
    nodeId: {
      type: String,
      required: true
    },
    visitSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    this.bindProcess;
    this.allData = [];
    return {
      search: "",
      searched: []
    };
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    createVisit() {
      spinalPanelManagerService.openPanel("createVisitDialog", {
        create: true,
        groupId: this.nodeId,
        visitId: this.visitSelected.type
      });
    },

    exportFile() {
      let data = [];
      for (let i = 0; i < this.allData.length; i++) {
        const element = this.allData[i].info.get();
        data.push(element);
      }
      ExcelManager.exportExcel(this.nodeId, this.visitSelected.type, data);
    },

    importFile() {
      ExcelManager.importFile()
        .then(res => {
          res.forEach(element => {
            element.rows.forEach(row => {
              this.createVisitWithImport(row);
            });
          });
        })
        .catch(err => {
          console.log(err);
          alert("error");
        });
    },

    createVisitWithImport(row) {
      let taskName = row[0];
      let periodicityNumber = row[1];
      let pMesure = this.getMesure(row[2]);
      let periodicityMesure = pMesure !== -1 ? pMesure - 1 : 0;
      let interventionNumber = row[3];
      let iMesure = this.getMesure(row[4]);
      let interventionMesure = iMesure !== -1 ? iMesure : 0;
      let description = row[6] ? row[6] : "";

      taskService.addTaskOnGroup(
        this.nodeId,
        taskName,
        Number(periodicityNumber),
        Number(periodicityMesure),
        this.visitSelected.type,
        interventionNumber.trim().length > 0
          ? Number(interventionNumber)
          : undefined,
        interventionMesure.trim().length > 0
          ? Number(interventionMesure)
          : undefined,
        description
      );
    },

    getAllData() {
      return taskService
        .getGroupTasks(this.nodeId, this.visitSelected.type)
        .then(res => {
          if (this.allData && this.bindProcess) {
            this.allData.unbind(this.bindProcess);
          }
          this.allData = res;

          this.bindProcess = this.allData.bind(() => {
            this.searched = [];

            for (let i = 0; i < this.allData.length; i++) {
              const info = this.allData[i].info;
              this.searched.push(info.get());
            }
          });

          // res = res.map(el => {
          //   return el.element.load();
          // });
          // Promise.all(res).then(el => {
          //   let result = el.map(r => r.get());
          //   this.allData = result;
          //   this.searched = result;
          // });
        });
    },

    goBack() {
      this.$emit("goBack");
    },

    getVisitId(visitName) {
      return taskService.getAllVisits().then(res => {
        let visits = res.map(el => el.get());
        let found = visits.find(el => {
          return el.type.toLowerCase() === visitName.toLowerCase();
        });

        if (found) return found.id;
        return undefined;
      });
    },

    getMesure(mesure) {
      return ["minute(s)", "day(s)", "month(s)", "year(s)"].indexOf(mesure);
    },

    displayInterventionTime(number, mesure) {
      return number !== "" && mesure !== "" ? `${number} ${mesure}` : "--";
    },
    displayDescription(description) {
      return description.trim().length > 0 ? description : "--";
    },

    scheduleVisit() {
      spinalPanelManagerService.openPanel("scheduleVisitDialog", {
        groupId: this.nodeId,
        visitId: this.visitSelected.type,
        data: this.searched
      });
    }
  }
};
</script>

<style scoped>
.myContent {
  width: 100%;
  height: 100%;
}

.myContent .head {
  flex-wrap: nowrap;
  height: 50px;
  justify-content: center;
}

.myContent .head .btn {
  border: 1px solid gray;
}

.myContent .mdTable {
  width: 100%;
  height: calc(100% - 130px);
  overflow: hidden;
}

.scheduleBtn {
  justify-content: center;
}

.scheduleBtn .btn {
  border: 1px solid gray;
}
</style>