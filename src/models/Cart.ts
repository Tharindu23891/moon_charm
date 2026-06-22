import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const CartItemSchema = new Schema(
  {
    itemType: { type: String, enum: ['product', 'package'], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

export type CartDoc = InferSchemaType<typeof CartSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Cart =
  (mongoose.models.Cart as mongoose.Model<CartDoc>) ||
  mongoose.model<CartDoc>('Cart', CartSchema);
