"use strict";

class IndentDataService {
  constructor(indents) {
    this.indents = indents;
  }

  hasTrackingNumber() {
    return this.indents.filter(item => item.trackingnumber !== null);
  }

  getVelocity() {
    return this.indents.map(function (item) {
      var velocity = null;

      if (item.created && item.finished) {
        velocity = new Date(Date.parse(item.finished) - Date.parse(item.created));
      }

      return {
        id: item.id,
        velocity: velocity,
        status: item.indentstatus_name
      };
    });
  }

  // frequenzy
  getIpFrequency() {
    return this.indents.reduce(function (ranking, item) {
      var key = item.ip;
      ranking[key] = (key in ranking ? ranking[key] + 1 : 1);

      return ranking;
    }, {});
  }

  getIndentStatusFrequency() {
    return this.indents.reduce(function (ranking, item) {
      var key = item.indentstatus_name;
      ranking[key] = (key in ranking ? ranking[key] + 1 : 1);

      return ranking;
    }, {});
  }

  getPaymentMethodFrequency() {
    return this.indents.reduce(function (ranking, item) {
      var key = item.paymentmethod_name;
      ranking[key] = (key in ranking ? ranking[key] + 1 : 1);

      return ranking;
    }, {});
  }

  // indents
  getFailedIndents() {
    return this.indents.filter(function (item) {
      return item.indentstatus_id == 98;
    });
  }

  getIndentsByPaymentMethod(paymentMethod) {
    return this.indents.filter(function (item) {
      return item.paymentmethod_name == paymentMethod;
    });
  }
}

module.exports = IndentDataService;
