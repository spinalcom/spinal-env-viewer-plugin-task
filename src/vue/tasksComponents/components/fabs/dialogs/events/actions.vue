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
    <md-list>

      <md-list-item>
        <md-datepicker class="md-primary"
                       v-model="selectedDate"
                       :md-model-type="Number"
                       :md-disabled-dates="disablePastDate">
          <label>Report to</label>
        </md-datepicker>
      </md-list-item>

      <md-list-item>
        <md-button class="md-accent">
          <md-icon>close</md-icon>
          Cancel this event
        </md-button>
      </md-list-item>

    </md-list>

  </div>
</template>

<script>
export default {
  name: "actionsComponent",
  props: {
    itemSelected: {}
  },
  data() {
    return {
      selectedDate: null
    };
  },
  methods: {
    disablePastDate(date) {
      return date <= Date.now();
    }
  },
  watch: {
    itemSelected() {
      this.selectedDate = this.itemSelected.date;
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>