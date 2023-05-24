"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Utils = require("../../helpers/utils");

//product schema
var Schema = new Schema(
  {
    productName: { type: String, required: true },
    cost: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

//product find by id
Schema.statics.findById = function (id) {
  return this.findOne({ _id: id, isActive: true });
};

// // product find all
// Schema.statics.findAll = function () {
//   return this.find({ isActive: true });
// };

// find all products by authenticated user
Schema.statics.findAll = function (paginationFilter) {
    return this.find({ isActive: true }).skip(paginationFilter.skip).limit(paginationFilter.limit);
  };

//product update by id
Schema.statics.update = function (data) {
  return this.findOneAndUpdate(
    {
      _id: data._id,
    },
    {
      $set: data,
    },
    { new: true } // returns updated record
  );
};

//product delete by id
Schema.statics.delete = function (id) {
  return this.findOneAndUpdate(
    {
      _id: id,
      isActive: { $ne: false },
    },
    {
      $set: { isActive: false },
    },
    { new: true } // returns updated record
  );
};

module.exports = mongoose.model("Product", Schema);
