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
    <div class="header">
      <div class="backBtn">
        <md-button class="md-dense md-primary"
                   @click="goBack">
          <md-icon>arrow_back</md-icon>
          &nbsp;
          BACK
        </md-button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "tableComponent",
  props: ["data"],
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$emit("goBack");
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

.content .header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
}

.content .header .backBtn,
.content .header .configName {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content .header .configName {
  font-size: 1.5em;
  text-transform: uppercase;
}
</style>