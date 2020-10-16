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
  <div class="select_container">
    <!-- <div class="dialogTitle">Select Ticket Process</div> -->
    <div class="content">
      <div class="section">
        <link-template :title="'Contexts'"
                       :data="data"
                       :itemSelected="contextId"
                       @create="createContext"
                       @select="selectContext"
                       :showBtn="true"></link-template>
      </div>

      <div class="section">
        <link-template :title="'Categories'"
                       :data="categories"
                       :itemSelected="categoryId"
                       @create="createCategory"
                       @select="selectCategory"
                       :showBtn="contextId && contextId.length > 0">
        </link-template>

      </div>

      <div class="section">
        <link-template :title="'Groups'"
                       :data="groups"
                       :itemSelected="groupId"
                       @select="selectGroup"
                       @create="createGroup"
                       :showBtn="showCreatBtn()"></link-template>

      </div>
    </div>

  </div>
</template>

<script>
import { SpinalEventService } from "spinal-env-viewer-task-service";
import linkerTemplateVue from "./linkerTemplate.vue";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export default {
  name: "selectCategory",
  props: {
    contextIdSelected: {},
    categoryIdSelected: {},
    groupIdSelected: {},
  },
  data() {
    return {
      data: [],
      contextId: "",
      categories: [],
      categoryId: "",
      groups: [],
      groupId: "",
    };
  },
  components: {
    "link-template": linkerTemplateVue,
  },
  async mounted() {
    this.data = await this.getAllData();
    // if (this.contextIdSelected && this.contextIdSelected.trim().length > 0) {
    //   this.selectContext(this.contextIdSelected);
    // }
    // if (this.categoryIdSelected && this.categoryIdSelected.trim().length > 0) {
    //   this.selectCategory(this.categoryIdSelected);
    // }
    // if (this.groupIdSelected && this.groupIdSelected.trim().length > 0) {
    //   this.selectGroup(this.groupIdSelected);
    // }
  },
  methods: {
    showCreatBtn() {
      return (
        this.contextId &&
        this.contextId.length > 0 &&
        this.categoryId &&
        this.categoryId.length > 0
      );
    },

    selectContext(id) {
      this.contextId = id;
      this.$emit("selectContext", id);
    },

    selectCategory(id) {
      this.categoryId = id;
      this.$emit("selectCategory", id);
    },

    selectGroup(id) {
      this.groupId = id;
      this.$emit("selectGroup", id);
    },

    createContext() {
      spinalPanelManagerService.openPanel("createTaskContextDialog", {
        callback: (info) => {
          console.log("info", info);
          info.categories = [];
          this.data = [...this.data, info];
          this.selectContext(info.id);
        },
      });
      // this.$emit("createContext");
    },

    createCategory() {
      spinalPanelManagerService.openPanel("createCategoryDialog", {
        title: "add Category",
        contextId: this.contextId,
        selectedNode: SpinalGraphService.getInfo(this.contextId),
        callback: (id) => {
          const info = SpinalGraphService.getInfo(id).get();
          info.groups = [];
          const contextFound = this.data.find((el) => el.id == this.contextId);

          if (contextFound) {
            contextFound.categories.push(info);
            this.categories = contextFound.categories;
            this.selectCategory(id);
          }
        },
      });
      // this.$emit("createCategory");
    },

    createGroup() {
      spinalPanelManagerService.openPanel("createGroupDialog", {
        title: "add Group",
        contextId: this.contextId,
        selectedNode: SpinalGraphService.getInfo(this.categoryId),
        callback: (id) => {
          const info = SpinalGraphService.getInfo(id).get();

          const contextFound = this.data.find((el) => el.id == this.contextId);

          if (contextFound) {
            const categoryFound = contextFound.categories.find(
              (el) => el.id == this.categoryId
            );
            if (categoryFound) {
              categoryFound.groups.push(info);
              this.groups = categoryFound.groups;
              this.selectGroup(id);
            }
            // contextFound.categories.push(info);
            // this.categories = contextFound.categories;
            // this.selectCategory(id);
          }
        },
      });
      // this.$emit("createGroup");
    },

    async getAllData() {
      let contexts = await SpinalEventService.getEventContexts();

      let promises = contexts.map(async (el) => {
        const context = el.get();
        context.categories = await this.getCategories(context.id);
        return context;
      });

      return Promise.all(promises);
    },

    async getCategories(contextId) {
      const categories = await SpinalEventService.getEventsCategories(
        contextId
      );
      const groupsPromises = categories.map(async (el) => {
        const category = el.get();
        category.groups = await this.getGroups(category.id);
        return category;
      });
      return Promise.all(groupsPromises);
    },

    getGroups(nodeId) {
      return SpinalEventService.getEventsGroups(nodeId).then((groups) => {
        return groups.map((el) => el.get());
      });
    },

    updateCategories() {
      // this.categorySelected = undefined;
      this.categories = [];
      if (this.contextId) {
        let val = this.data.find((el) => el.id === this.contextId);
        if (val) this.categories = val.categories;
      }
    },

    updateGroups() {
      this.groups = [];
      if (this.contextId && this.categoryId) {
        let context = this.data.find((el) => el.id === this.contextId);
        if (context) {
          let category = context.categories.find(
            (el) => el.id == this.categoryId
          );
          if (category) this.groups = category.groups;
        }
      }
    },
  },
  watch: {
    contextId() {
      this.categoryId = undefined;
      this.groupId = undefined;
      this.updateCategories();
      // this.updateProcesses();
    },

    categoryId() {
      this.groupId = undefined;
      this.updateGroups();
    },
  },
};
</script>

<style scoped>
.select_container {
  width: 100%;
  height: 100%;
}
/* .select_container .dialogTitle {
  height: 50px;
  text-align: center;
} */
.select_container .content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.select_container .content .section {
  width: 33%;
  border: 1px solid grey;
  border-radius: 4% 4% 0 0;
  padding: 15px;
}
</style>