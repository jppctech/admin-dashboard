import { Schema, model, models, Document } from 'mongoose';

interface IProduct extends Document {
    first_name: string;
    last_name: string;
    email: string;
    // phone: string;
    password: string;
    isAdmin: boolean;
    isVerified: boolean,
    emailOTP: number,
    emailOTPExpiry: Date,
    // phoneOTP: number,
    // phoneOTPExpiry: Date
  }
  
  const ServiceUserSchema = new Schema<IProduct>({
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    // phone: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     index: true,
    // },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailOTP: {
        type: Number,
    },
    emailOTPExpiry: {
        type: Date
    },
    // phoneOTP: {
    //     type: Number,
    // },
    // phoneOTPExpiry: {
    //     type: Date
    // }
  }, {
    timestamps: true,
  });
  
const ServiceUser = models.ServiceUser || model<IProduct>('ServiceUser', ServiceUserSchema);
export default ServiceUser;