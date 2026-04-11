// BACKEND/src/modules/states/state.model.js

import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'State name is required'],
      trim: true,
      maxlength: [100, 'State name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'State code is required'],
      uppercase: true,
      trim: true,
      maxlength: [10, 'State code cannot exceed 10 characters'],
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
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

stateSchema.index({ code: 1, countryId: 1, academicYearId: 1 }, { unique: true });
stateSchema.index({ countryId: 1, status: 1 });
stateSchema.index({ academicYearId: 1 });

const State = mongoose.model('State', stateSchema);
export default State;
