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
    <md-content class="visits md-scrollbar"
                v-if="types">

      <div v-if="types.length === 0"
           class="empty">
        <div>No Type Found !!! </div>
      </div>

      <type-component v-for="(type,index) in types"
                      :key="index"
                      :type="type"
                      @select="selectType">
      </type-component>

    </md-content>
  </div>
</template>

<script>
import TypeComponent from "./type.vue";

export default {
  name: "typesComponent",
  props: ["types"],
  components: {
    "type-component": TypeComponent
  },
  data() {
    return {};
  },
  methods: {
    selectType(type) {
      this.$emit("select", type);
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}

.content .visits {
  width: calc(100% - 40px);
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  background: transparent;
  overflow-x: hidden;
  overflow-y: auto;
}

.content .visits .empty {
  width: 100%;
  height: 100%;
  font-size: 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content .visits .empty div {
  margin-bottom: 10px;
}
</style>