import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const OrderItemSchema = new Schema(
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

// Stored as a base64 data URL on the order (same approach as product images).
// Marked select:false on the order so the blob never loads in list queries.
const ReceiptSchema = new Schema(
  {
    data: { type: String, required: true },
    filename: { type: String, default: '' },
    contentType: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const AddressSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], default: [] },
    address: { type: AddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'bank'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'under_review', 'paid', 'rejected', 'refunded'],
      default: 'unpaid',
    },
    // Cheap existence flag so list/admin views can show "receipt uploaded"
    // without loading the (select:false) blob.
    receiptUploaded: { type: Boolean, default: false },
    receipt: { type: ReceiptSchema, select: false, default: null },
    // Optional note from admin, e.g. why a receipt was rejected.
    paymentNote: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Order =
  (mongoose.models.Order as mongoose.Model<OrderDoc>) ||
  mongoose.model<OrderDoc>('Order', OrderSchema);
