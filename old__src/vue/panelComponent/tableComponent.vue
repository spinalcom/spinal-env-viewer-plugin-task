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

/* eslint-disable no-debugger */

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
        <md-icon>open_in_browser</md-icon>
        <span>Export</span>
      </md-button>

      <md-button class="btn md-layout-item md-size-45"
                 @click="importFile">
        <md-icon>file_download</md-icon>
        import
      </md-button>
    </div>

    <md-table class="mdTable visitAppTable"
              v-model="searched"
              @md-selected="onSelect">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{ visitSelected.name }}</h1>
        </div>

        <div class="scheduleBtn md-toolbar-section-end">
          <!-- <md-button @click="scheduleVisit"
                     class="btn">
            <md-icon>calendar_today</md-icon>
            Schedule Visit
          </md-button> -->

          <md-button class="md-icon-button md-primary md-raised"
                     @click="scheduleVisit"
                     title="Schedule Visit">
            <md-icon>calendar_today</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>

      <md-table-empty-state md-label="No Visits found"
                            :md-description="`No Data found. Create a new.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row"
                    slot-scope="{ item }"
                    md-selectable="multiple"
                    md-auto-select>
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>

        <md-table-cell md-label="Periodicity">
          {{ `${item.periodicity.number} ${item.periodicity.mesure}` }}
        </md-table-cell>

        <md-table-cell md-label="Intervetion">
          {{
            displayInterventionTime(
              item.intervention.number,
              item.intervention.mesure
            )
          }}
        </md-table-cell>

        <md-table-cell md-label="Description">
          {{ displayDescription(item.description) }}
        </md-table-cell>

        <md-table-cell md-label="">
          <md-menu md-size="small">
            <md-button class="md-icon-button"
                       md-menu-trigger
                       @click.stop="">
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content class="menuItem">
              <md-menu-item @click="ManageEvents(item)">
                <span>
                  <md-icon>notifications</md-icon>
                </span>
                &nbsp; &nbsp;
                <span>
                  Manage events
                </span>
              </md-menu-item>

              <md-menu-item @click="editItem(item)">
                <span>
                  <md-icon tiny>edit</md-icon>
                </span>
                &nbsp; &nbsp;
                <span>
                  Edit Visit
                </span>
              </md-menu-item>

              <md-menu-item @click="deleteItem(item)">
                <span>
                  <md-icon>delete</md-icon>
                </span>
                &nbsp; &nbsp;
                <span>
                  Delete
                </span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </md-content>
</template>

<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import taskService from "spinal-env-viewer-task-service";

import ExcelManager from "../../js/excelManager";

import FileSaver from "file-saver";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

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
      searched: [],
      dataToSchedule: []
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
        visitId: this.visitSelected.name
      });
    },

    onSelect(items) {
      this.dataToSchedule = items;
    },

    exportFile() {
      let data = [];
      for (let i = 0; i < this.allData.length; i++) {
        const element = this.allData[i].info.get();
        data.push(element);
      }

      ExcelManager.exportExcel(this.nodeId, this.visitSelected.name, data).then(
        workbook => {
          spinalPanelManagerService.openPanel("confirmDialog", {
            title: "Download",
            message: `<p>Download spinal_${this.visitSelected.name}.xlsx</p>`,
            validate: () => {
              workbook.xlsx
                .writeBuffer()
                .then(buffer => {
                  FileSaver.saveAs(
                    new Blob([buffer]),
                    `spinal_${this.visitSelected.name}.xlsx`
                  );
                })
                .catch(err => console.log(err));
            }
          });
        }
      );
    },

    importFile() {
      ExcelManager.importFile().then(res => {
        spinalPanelManagerService.openPanel("confirmDialog", {
          title: "Import",
          message: `
            <div> Do you want import in ${this.visitSelected.name} ?<div>

            <div> Number of valid items : ${res.valid.length} </div>
            <div> Number of invalid items : ${res.invalid.length} </div>

          `,
          validate: () => {
            res.valid.forEach(element => {
              taskService.addVisitOnGroup(
                this.nodeId,
                element.name,
                element.periodNumber,
                element.periodMesure,
                this.visitSelected.name,
                element.interventionNumber,
                element.interventionMesure,
                element.description
              );
            });
          }
        });
      });
    },

    getAllData() {
      return taskService
        .getGroupVisits(this.nodeId, this.visitSelected.name)
        .then(res => {
          if (this.allData && this.bindProcess) {
            this.allData.unbind(this.bindProcess);
          }
          this.allData = res;

          this.bindProcess = this.allData.bind(() => {
            this.searched = [];

            for (let i = 0; i < this.allData.length; i++) {
              SpinalGraphService._addNode(this.allData[i]);
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
      return ["minute(s)", "day(s)", "week(s)", "month(s)", "year(s)"].indexOf(
        mesure
      );
    },

    displayInterventionTime(number, mesure) {
      if (Number.isNaN(Number(number))) {
        return `--`;
      } else if (number === "" && mesure === "") {
        return "--";
      } else {
        return `${number} ${mesure}`;
      }
      // return Number(number) && number !== "" && Number(mesure) && mesure !== ""
      //   ? `${number} ${mesure}`
      //   : "--";
    },

    displayDescription(description) {
      return description.trim().length > 0 ? description : "--";
    },

    scheduleVisit() {
      if (this.dataToSchedule.length > 0) {
        spinalPanelManagerService.openPanel("scheduleVisitDialog", {
          groupId: this.nodeId,
          visitId: this.visitSelected.name,
          data: this.dataToSchedule
        });
      } else {
        alert("select at least one visit !!!");
      }
    },

    editItem(item) {
      spinalPanelManagerService.openPanel("createVisitDialog", {
        create: false,
        name: item.name,
        groupId: item.groupId,
        visitId: item.visitType,
        description: item.description,
        itemId: item.id,
        intervention: item.intervention,
        periodicity: item.periodicity
      });
    },

    ManageEvents(item) {
      spinalPanelManagerService.openPanel("eventsManagePanel", item);
    },

    deleteItem(item) {
      spinalPanelManagerService.openPanel("deleteItemDialog", item);
    }
  },
  watch: {
    nodeId() {
      this.getAllData();
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
  border: 1px solid #448aff;
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
  width: 200px;
  text-align: center;
}

.visitTableCell {
  max-height: 50px;
}
</style>

<style>
.md-table-cell-selection .md-table-cell-container,
.md-table-cell-selection .md-table-cell-label,
.md-table-cell-selection .md-table-head-container,
.md-table-cell-selection .md-table-head-label {
  margin: 5px;
}

.mdTable.visitAppTable .md-table-cell-container {
  padding: 6px 32px 6px 24px;
  height: 50px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.myContent .md-button .md-ripple {
  padding: 0px !important;
}

.menuItem .md-list-item-content {
  justify-content: flex-start;
}
</style>
