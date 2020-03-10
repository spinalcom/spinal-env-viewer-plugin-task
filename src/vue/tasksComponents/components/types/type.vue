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
  <md-content @click="selectType">
    <md-tooltip md-direction="top">{{type}}</md-tooltip>
    <div class="text">
      {{type}}
    </div>

  </md-content>
</template>


<script>
export default {
  name: "typeComponent",
  props: ["type"],
  data() {
    return {};
  },
  methods: {
    selectType() {
      this.$emit("select", this.type);
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