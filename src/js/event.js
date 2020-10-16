import Vue from "vue";


const EventBus = new Vue();


export const EVENT_TYPES = {
  CREATED: 'eventCreated',
  UPDATED: 'eventUpdated',
  DELETED: 'eventDeleted'
}

export default EventBus;