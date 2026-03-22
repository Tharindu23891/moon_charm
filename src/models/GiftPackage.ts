import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const PackageItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const GiftPackageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: '' },
    items: { type: [PackageItemSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    isFeatured: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type GiftPackageDoc = InferSchemaType<typeof GiftPackageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GiftPackage =
  (mongoose.models.GiftPackage as mongoose.Model<GiftPackageDoc>) ||
  mongoose.model<GiftPackageDoc>('GiftPackage', GiftPackageSchema);
