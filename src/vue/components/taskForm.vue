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
  <div class="taskForm">
    <md-toolbar md-elevation="0"
                class="toolbarHeader">
      <md-button class="md-dense md-primary"
                 @click="goBack">
        <md-icon>keyboard_backspace</md-icon>
        BACK
      </md-button>
    </md-toolbar>

    <div class="container">
      <md-field>
        <label>Name</label>
        <md-input @blur="setName"></md-input>
      </md-field>
    </div>
  </div>
</template>


<script>
export default {
  name: "taskForm",
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$emit("back");
    },
  },
};
</script>

<style scoped>
.taskForm {
  width: 100%;
  height: 100%;
}

.taskForm .toolbarHeader {
  min-height: unset;
  height: 50px;
  background-color: transparent;
}

.taskForm .container {
  width: 100%;
  height: calc(100% - 50px);
}
</style>