import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
    },
    reps: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    caloriesBurned: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add compound index for user, workoutName, and date
WorkoutSchema.index({ 
  user: 1, 
  workoutName: 1,
  date: 1
}, { 
  unique: true,
  partialFilterExpression: {
    // Only apply uniqueness when all fields exist
    user: { $exists: true },
    workoutName: { $exists: true },
    date: { $exists: true }
  }
});

export default mongoose.model("Workout", WorkoutSchema);
