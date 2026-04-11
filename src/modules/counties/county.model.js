// BACKEND/src/modules/counties/county.model.js

import mongoose from 'mongoose';

const countySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'County name is required'],
      trim: true,
      maxlength: [100, 'County name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'County code is required'],
      uppercase: true,
      trim: true,
      maxlength: [10, 'County code cannot exceed 10 characters'],
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State is required'],
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: [true, 'Academic year is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

countySchema.index({ code: 1, stateId: 1, academicYearId: 1 }, { unique: true });
countySchema.index({ stateId: 1, status: 1 });
countySchema.index({ countryId: 1 });
countySchema.index({ academicYearId: 1 });

const County = mongoose.model('County', countySchema);
export default County;
