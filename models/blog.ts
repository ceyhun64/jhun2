// models/blog.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  summary: string;
  description: string;
  titleEng?: string;
  summaryEng?: string;
  descriptionEng?: string;
  url: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    
    titleEng: { type: String },
    summaryEng: { type: String },
    descriptionEng: { type: String },
    
    url: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'Blog',
  }
);

const Blog = models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;