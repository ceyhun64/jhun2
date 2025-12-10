// models/technology.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  icon: string;
  type: string;
  yoe: number;
  color: string;
  projects: mongoose.Types.ObjectId[]; // Project referansları
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    type: { type: String, required: true },
    yoe: { type: Number, required: true },
    color: { type: String, required: true },

    // Çoka Çok İlişki: Bir teknoloji birden fazla projede kullanılabilir
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        index: true, // Performans için index
      },
    ],
  },
  {
    timestamps: true,
    collection: "Technology",
  }
);

// Indexes for better query performance
TechnologySchema.index({ projects: 1 });
TechnologySchema.index({ name: 1 });

const Technology =
  models.Technology ||
  mongoose.model<ITechnology>("Technology", TechnologySchema);

export default Technology;
