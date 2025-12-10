// models/project.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IProject extends Document {
  title: string;
  summary: string;
  description: string;
  titleEng?: string;
  summaryEng?: string;
  descriptionEng?: string;
  url: string;
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  subImage1?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  subImage5?: string;
  technologies: mongoose.Types.ObjectId[]; // Technology referansları
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },

    titleEng: { type: String },
    summaryEng: { type: String },
    descriptionEng: { type: String },

    url: { type: String, required: true },
    image: { type: String, required: true },
    demoUrl: { type: String },
    githubUrl: { type: String },
    subImage1: { type: String },
    subImage2: { type: String },
    subImage3: { type: String },
    subImage4: { type: String },
    subImage5: { type: String },

    // Çoka Çok İlişki: Bir proje birden fazla teknolojiye sahip olabilir
    technologies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Technology",
        index: true, // Performans için index
      },
    ],
  },
  {
    timestamps: true,
    collection: "Project",
  }
);

// Indexes for better query performance
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project =
  models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
