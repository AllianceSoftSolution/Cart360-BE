// BACKEND/src/modules/countries/country.model.js

import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
      maxlength: [100, 'Country name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Country code is required'],
      uppercase: true,
      trim: true,
      minlength: [2, 'Country code must be at least 2 characters'],
      maxlength: [5, 'Country code cannot exceed 5 characters'],
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

// Compound unique: same name+code per academic year
countrySchema.index({ code: 1, academicYearId: 1 }, { unique: true });
countrySchema.index({ academicYearId: 1, status: 1 });

const Country = mongoose.model('Country', countrySchema);
export default Country;
