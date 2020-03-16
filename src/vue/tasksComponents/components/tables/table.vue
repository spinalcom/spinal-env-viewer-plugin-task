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
  <div class="_tableContent">

    <fab-component class="md-bottom-right"
                   :itemsSelected="itemsSelected"></fab-component>

    <md-toolbar class="mdToolbar md-layout"
                md-elevation="0">
      <div class="toolbar-start md-layout-item md-size-50">
        <!-- <md-radio v-model="searchBy"
                  class="md-primary"
                  :value="0">Search by name</md-radio>

        <md-radio v-model="searchBy"
                  class="md-primary"
                  :value="1">Search by value</md-radio> -->
      </div>

      <div class="toolbar-end md-layout-item md-size-50">
        <md-field>
          <input class="md-input"
                 placeholder="Search by name or value..."
                 v-model="searchValue" />
          <md-icon>search</md-icon>
        </md-field>
      </div>
    </md-toolbar>

    <div class="_tableContainer">
      <v-data-table v-model="itemsSelected"
                    :headers="headerDisplayed"
                    :items="searched"
                    :custom-sort="sortByName"
                    :pagination.sync="pagination"
                    :loading="true"
                    dark
                    hide-actions
                    class="elevation-1">

        <template v-slot:headers="props">
          <tr>
            <th style="text-align : left">

              <md-menu class="selectionMenu"
                       md-size="small">

                <md-button md-menu-trigger>
                  <md-icon>check_box</md-icon>
                  &nbsp;
                  Select
                </md-button>

                <md-menu-content>
                  <md-menu-item v-for="(m,index) in checkboxSelects"
                                :key="index"
                                @click="selectAll(m.value,items)">
                    {{m.text}}
                  </md-menu-item>
                </md-menu-content>
              </md-menu>

            </th>

            <th style="text-align : left"
                v-for="(head,index) in props.headers"
                :key="index">
              {{head.text}}
            </th>
          </tr>
        </template>

        <template v-slot:items="props">
          <td>
            <v-checkbox v-model="props.selected"
                        primary
                        hide-details></v-checkbox>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.type }}</td>
          <td>
            <v-icon class="mr-2"
                    @click="ManageEvents(props.item)"
                    title="manage Events">
              notifications
              <!-- date_range -->
            </v-icon>
          </td>

        </template>
      </v-data-table>

      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page"
                      :length="pages"
                      :total-visible="5"
                      color="blue"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import FabComponent from "../fabs/fab.vue";

const lodash = require("lodash");

export default {
  name: "tableContentComponent",
  components: {
    "fab-component": FabComponent
  },
  props: {
    data: {}
  },
  data() {
    this.checkboxSelects = [
      { text: "select All", value: true },
      { text: "select in this page", value: false }
    ];

    this.headerDisplayed = [
      {
        text: "Name",
        value: "name"
      },
      {
        text: "Type",
        value: "type"
      },
      {
        text: "Action",
        value: "action"
      }
    ];

    return {
      itemsSelected: [],
      searched: [],
      searchValue: "",
      pagination: {
        page: 1,
        rowsPerPage: 20
      }
    };
  },
  created() {
    this.searchAndFilterTable = lodash.debounce(this.searchOnTable, 500);
  },
  mounted() {
    this.searched = this.data;
  },
  methods: {
    sortByName(items) {
      return items.sort((a, b) => {
        const name1 = a.name.toUpperCase();
        const name2 = b.name.toUpperCase();

        let comparison = 0;
        if (name1 > name2) {
          comparison = 1;
        } else if (name1 < name2) {
          comparison = -1;
        }
        return comparison;
      });
    },

    ////////////////////////////////////////////////////////////////
    //                     SELECT FUNCTIONS
    ///////////////////////////////////////////////////////////////
    allItemsIsSelected(liste) {
      for (const element of liste) {
        let found = this.itemsSelected.find(el => el.id === element.id);
        if (typeof found === "undefined") return false;
      }

      return true;
    },

    selectAll(value) {
      // console.log(value, this.sortByName(this.searched));

      if (value) {
        if (this.itemsSelected.length === this.searched.length)
          this.itemsSelected = [];
        else this.itemsSelected = this.searched;
      } else {
        const pageNumber = this.pagination.page;
        const itemByPage = this.pagination.rowsPerPage;

        const begin = (pageNumber - 1) * itemByPage;
        const end = begin + itemByPage;

        const sortedList = Object.assign([], this.sortByName(this.searched));
        const pageItems = sortedList.slice(begin, end);
        const allItemsIsSelected = this.allItemsIsSelected(pageItems);

        for (const element of pageItems) {
          if (allItemsIsSelected) {
            this.itemsSelected = this.itemsSelected.filter(
              el => el.id !== element.id
            );
          } else {
            this.itemsSelected.push(element);
          }
        }
      }
    },

    ////////////////////////////////////////////////////////////////
    //                     FILTER FUNCTIONS
    ///////////////////////////////////////////////////////////////
    filterByName(liste, name) {
      if (name.trim().length > 0) {
        return liste.filter(item => {
          return item.name.toLowerCase().includes(name.trim().toLowerCase());
        });
      }

      return liste;
    },

    filterByValue(liste, value) {
      if (value.trim().length > 0) {
        return liste.filter(el => {
          let found = el.attributes.find(attr => {
            return attr.value
              .toString()
              .toLowerCase()
              .includes(value.trim().toLowerCase());
          });

          return found ? true : false;
        });
      }

      return liste;
    },

    searchOnTable() {
      //   switch (this.searchBy) {
      //     case 0:
      this.searched = this.filterByName(this.data, this.searchValue);
      //       break;

      //     case 1:
      //       this.searched = this.filterByValue(
      //         this.tableContent,
      //         this.searchValue
      //       );

      //       break;
      //   }
    },

    ManageEvents(item) {
      console.log("item", item);
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.searched.length / this.pagination.rowsPerPage);
    }
  },
  watch: {
    searchValue() {
      this.searchAndFilterTable();
    }
    //   data() {
    //     console.log("data", this.data);
    //   }
  }
};
</script>

<style scoped>
._tableContent {
  width: 100%;
  height: 100%;
}

._tableContent .mdToolbar {
  width: 100%;
  height: 50px;
  padding: 0px;
  margin-bottom: 10px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

._tableContent .mdToolbar .toolbar-start {
  display: flex;
  justify-content: center;
  align-items: center;
}

._tableContent .md-content.md-theme-default {
  background: transparent !important;
}

._tableContent ._tableContainer {
  width: 100%;
  height: calc(100% - 68px);
}
</style>

<style>
._tableContent ._tableContainer .elevation-1 {
  width: 100%;
  height: calc(100% - 60px);
}

._tableContent ._tableContainer .elevation-1 .v-table__overflow {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow
  .theme--dark.v-table {
  background-color: transparent;
}

.selectionMenu .md-button .md-ripple {
  padding: 0px;
}

._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar {
  background-color: #fff;
  width: 10px;
}

/* background of the scrollbar except button or resizer */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-track {
  /* background-color: #fff; */
  background-color: #424242;
}

/* scrollbar itself */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  /* border: 5px solid #fff; */
}

/* set button(top and bottom of the scrollbar) */
._tableContent
  ._tableContainer
  .elevation-1
  .v-table__overflow::-webkit-scrollbar-button {
  display: none;
}

.mdSpeedDialBtn .md-button .md-ripple {
  width: 170px;
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  /* color: #448aff; */
}
</style>