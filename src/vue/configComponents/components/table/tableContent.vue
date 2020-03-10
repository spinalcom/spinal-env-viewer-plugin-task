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
  <div class="content">
    <md-table class="mdTable visitAppTable"
              v-model="searched">

      <md-table-toolbar>
        <div class="md-toolbar-section-start"></div>
        <md-field md-clearable
                  class="md-toolbar-section-end">
          <md-input placeholder="Search by name..."
                    v-model="search"
                    @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state md-label="No Task found"
                            :md-description="`No Data found. Create a new.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row"
                    slot-scope="{ item }">
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>

        <md-table-cell md-label="Periodicity">
          {{ `${item.periodicity.number} ${item.periodicity.mesure}` }}
        </md-table-cell>

        <md-table-cell md-label="Intervention">
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
          <md-menu>
            <md-button class="md-icon-button"
                       md-menu-trigger
                       @click.stop="">
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content class="menuItem">
              <!-- <md-menu-item @click="ManageEvents(item)">
                <span>
                  <md-icon>notifications</md-icon>
                </span>
                &nbsp; &nbsp;
                <span>
                  Manage events
                </span>
              </md-menu-item> -->

              <md-menu-item @click="editItem(item)">
                <md-icon>edit</md-icon>
                <span>Edit Visit</span>
              </md-menu-item>

              <md-menu-item @click="deleteItem(item)">
                <md-icon>delete</md-icon>
                <span>Delete</span>
              </md-menu-item>

              <!-- <md-menu-item @click="deleteItem(item)">
                <span>
                  <md-icon>delete</md-icon>
                </span>
                &nbsp; &nbsp;
                <span>
                  Delete
                </span>
              </md-menu-item> -->
            </md-menu-content>
          </md-menu>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export default {
  name: "tableContentComponent",
  props: {
    visits: {}
  },
  data() {
    return {
      search: "",
      searched: []
    };
  },
  mounted() {
    this.searched = this.visits;
  },
  methods: {
    displayInterventionTime(number, mesure) {
      if (Number.isNaN(Number(number))) {
        return `--`;
      } else if (number === "" && mesure === "") {
        return "--";
      } else {
        return `${number} ${mesure}`;
      }
    },

    displayDescription(description) {
      return description.trim().length > 0 ? description : "--";
    },

    editItem(item) {
      spinalPanelManagerService.openPanel("createTaskDialog", {
        create: false,
        name: item.name,
        configId: item.configurationId,
        description: item.description,
        itemId: item.id,
        intervention: item.intervention,
        periodicity: item.periodicity,
        callback: this.refresh
      });
    },

    deleteItem(item) {
      spinalPanelManagerService.openPanel("confirmDialog", {
        nodeId: item.id,
        title: "Delete",
        message: "Are you sure to remove this task ? It can't be undo.",
        callback: this.refresh
      });
    },

    searchOnTable() {
      if (this.search.trim().length === 0) this.searched = this.visits;
      else {
        this.searched = this.visits.filter(visit => {
          return visit.name
            .toLowerCase()
            .includes(this.search.trim().toLowerCase());
        });
      }
    },

    refresh() {
      this.$emit("refresh");
    }
  },
  watch: {
    visits() {
      console.log("hello");
      console.log("visits", this.visits);
      this.searchOnTable();
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content .mdTable {
  width: 100%;
  height: calc(100% - 15px);
  overflow: hidden;
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