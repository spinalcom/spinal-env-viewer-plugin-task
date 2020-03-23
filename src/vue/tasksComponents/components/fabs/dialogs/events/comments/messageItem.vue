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
  <div class="messageContainer">
    <div class="header">
      <div class="userName">{{owner}}</div>
      <div class="time"> {{time | dateFilter}}</div>
    </div>
    <div class="content">
      {{content}}
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "messageItem",
  props: ["time", "content", "owner"],
  filters: {
    dateFilter: function(value) {
      if (!value) return "11h30";

      return moment(value).format("MMMM Do YYYY, h:mm:ss a");
    }
  }
};
</script>

<style  scoped>
.messageContainer {
  width: 95%;
  min-height: 50px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  padding: 15px;
  font-size: 1.2em;
  margin-bottom: 20px;
  /* background: #ddd; */
}

.messageContainer .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.messageContainer .header .userName {
  font-weight: bold;
}

.messageContainer .header .time {
  color: #999;
  font-size: 0.8em;
}

.messageContainer .content {
  text-align: justify;
}
</style>
