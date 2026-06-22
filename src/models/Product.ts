import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    stock: { type: Number, required: true, min: 0 },
    isFeatured: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
});
ProductSchema.index({ categoryId: 1, popularity: -1 });
ProductSchema.index({ categoryId: 1, createdAt: -1 });
ProductSchema.index({ categoryId: 1, price: 1 });
ProductSchema.index({ categoryId: 1, price: -1 });
ProductSchema.index({ isFeatured: 1, popularity: -1 });

export type ProductDoc = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product =
  (mongoose.models.Product as mongoose.Model<ProductDoc>) ||
  mongoose.model<ProductDoc>('Product', ProductSchema);
