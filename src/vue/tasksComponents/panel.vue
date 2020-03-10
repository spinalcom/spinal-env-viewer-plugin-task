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
  <md-content class="_mdContent">
    <types-component v-if="data && data.types && appState === STATES.normal && visiblePage === pages.types"
                     :types="data.types"
                     @select="selectType">
    </types-component>

    <table-component v-if="itemDisplayed && appState === STATES.normal && visiblePage === pages.table"
                     :data="[]"
                     @goBack="goBack">
    </table-component>

    <!--
          /////////////////////////////////
          Loading
          ////////////////////////////////
        -->
    <div v-if="appState === STATES.loading"
         class="loading">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

  </md-content>
</template>

<script>
import utilities from "./utilities/utilities";

import TypesComponent from "./components/types/index.vue";
import TableComponent from "./components/tables/index.vue";

export default {
  name: "taskPanelComponents",
  components: {
    "types-component": TypesComponent,
    "table-component": TableComponent
  },
  data() {
    this.STATES = Object.freeze({
      normal: 0,
      loading: 1,
      error: 2
    });

    this.pages = Object.freeze({
      types: 0,
      table: 1
    });

    this.data = {};
    return {
      appState: this.STATES.normal,
      visiblePage: this.pages.types,
      contextId: null,
      nodeId: null,
      itemDisplayed: []
    };
  },
  methods: {
    opened(option) {
      this.contextId = option.context.id.get();
      this.nodeId = option.selectedNode.id.get();
    },
    getAllData() {
      this.appState = this.STATES.loading;

      utilities
        .getAllData(this.contextId, this.nodeId)
        .then(res => {
          this.data = res;

          const typeFound = this.data.types.find(
            el => el === this.typeSelected
          );

          this.typeSelected = typeFound ? typeFound : null;

          if (this.typeSelected) {
            this.selectType(this.typeSelected);
          } else {
            this.visiblePage = this.pages.types;
          }
          this.appState = this.STATES.normal;
        })
        .catch(err => {
          this.appState = this.STATES.normal;
          console.error(err);
        });
    },
    selectType(type) {
      this.typeSelected = type;
      this.itemDisplayed = this.data.data[type];
      this.visiblePage = this.pages.table;
    },
    goBack() {
      this.typeSelected = null;
      this.visiblePage = this.pages.types;
    }
  },
  watch: {
    contextId() {
      this.getAllData();
    },
    nodeId() {
      this.getAllData();
    }
  }
};
</script>

<style scoped>
._mdContent {
  width: 100%;
  height: calc(100% - 15px);
  overflow: hidden;
  background: transparent;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>