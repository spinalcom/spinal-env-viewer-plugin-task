
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

    <div class="header md-layout">
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

        <md-field md-clearable
                  class="md-toolbar-section-end">
          <md-input placeholder="Search by name..."
                    v-model="search"
                    @input="searchOnTable" />
        </md-field>

      </md-table-toolbar>

      <md-table-empty-state md-label="No Visits found"
                            :md-description="`No Visits found. Create a new visits.`">
      </md-table-empty-state>

      <!-- <md-table-row slot="md-table-row"
                    slot-scope="{ item }">
        <md-table-cell md-label="Task Name"
                       md-numeric>{{ item.name }}</md-table-cell>

        <md-table-cell md-label="Periodicity">
          {{`${item.periodicity.number} ${item.periodicity.mesure}`}}
        </md-table-cell>

        <md-table-cell md-label="Type">{{ item.visitType.name }}</md-table-cell>

      </md-table-row> -->

      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Periodicity</md-table-head>
        <md-table-head>Intervention</md-table-head>
        <md-table-head>Description</md-table-head>
        <md-table-head></md-table-head>
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

        <md-table-cell>
          <md-menu md-direction="bottom-start">
            <md-button class="md-icon-button"
                       md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item>My Item 1</md-menu-item>
              <md-menu-item>My Item 2</md-menu-item>
              <md-menu-item>My Item 3</md-menu-item>
            </md-menu-content>

          </md-menu>
        </md-table-cell>

        <!-- <md-table-cell>
          <md-button class="md-icon-button">
            <md-icon>edit</md-icon>
          </md-button>
        </md-table-cell>

        <md-table-cell>
          <md-button class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell> -->

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
        visitId: this.visitSelected.id
      });
    },

    exportFile() {
      ExcelManager.exportExcel(
        this.nodeId,
        this.visitSelected.type,
        this.allData.get()
      );
    },

    importFile() {
      ExcelManager.importFile();
    },

    getAllData() {
      return taskService
        .getGroupTasks(this.nodeId, this.visitSelected.type)
        .then(res => {
          if (this.allData && this.bindProcess) {
            console.log("unbind");
            this.allData.unbind(this.bindProcess);
          }
          this.allData = res;

          this.bindProcess = this.allData.bind(() => {
            this.searched = this.allData.get();
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
    }
  }
};
</script>

<style scoped>
.myContent {
  width: 100%;
  height: 100%;
}

.myContent .header {
  flex-wrap: nowrap;
  height: 50px;
  justify-content: center;
}

.myContent .header .btn {
  border: 1px solid gray;
}

.myContent .mdTable {
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
}
</style>