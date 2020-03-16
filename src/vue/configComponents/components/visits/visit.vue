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
  <md-content @click="onClickEvent"
              @mouseover="mouseOver"
              @mouseleave="mouseLeave">
    <md-tooltip md-direction="top">{{visit.name}}</md-tooltip>
    <div class="text"
         v-if="!mouseIsOver">
      {{visit.name}}
    </div>

    <div class="text"
         v-else>
      <md-button class="md-icon-button"
                 @click="editConfig">
        <md-tooltip md-direction="top">edit</md-tooltip>
        <md-icon>edit</md-icon>
      </md-button>

      <md-button class="md-icon-button"
                 @click="selectVisit">
        <md-tooltip md-direction="top">configure</md-tooltip>
        <md-icon>settings</md-icon>
      </md-button>

      <md-button class="md-icon-button"
                 @click="removeConfig">
        <md-tooltip md-direction="top">remove</md-tooltip>
        <md-icon>delete</md-icon>
      </md-button>
    </div>

  </md-content>
</template>


<script>
export default {
  name: "visit",
  props: ["visit"],
  data() {
    return {
      mouseIsOver: false
    };
  },
  methods: {
    selectVisit() {
      this.$emit("select", this.visit);
    },
    mouseOver() {
      this.mouseIsOver = true;
    },

    mouseLeave() {
      this.mouseIsOver = false;
    },

    onClickEvent() {
      this.mouseIsOver = !this.mouseIsOver;
    },

    editConfig() {
      this.$emit("edit", this.visit);
    },

    removeConfig() {
      this.$emit("remove", this.visit);
    }
  }
};
</script>

<style lang="scss" scoped>
.md-content {
  width: 150px;
  height: 150px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  padding: 10px;
  margin: 10px;
  border: 1px dashed grey;
}

.md-content:hover {
  background-color: #448aff;
  cursor: pointer;
}

.text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>