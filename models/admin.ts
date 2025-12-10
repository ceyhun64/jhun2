// models/Admin.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'admin',
  }
);

const Admin = models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;