import  mongoose, {Document, Model,  Schema} from "mongoose";

// interface 
export interface IOtp extends Document {
    email: string;
    phone_number?: string;
    otp: string;
    create_at: Date;
}

// define schema
const OtpSchema:Schema<IOtp> = new Schema({
    email: {type: String},
    phone_number: {type: String},
    otp: {type: String},
    create_at: {type: Date, default: Date.now, index: {expires: '10m'}}
})

OtpSchema.path("email").validate(function () {
    return this.email || this.phone_number;
  }, "Email or phone number is required");

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model('Otp', OtpSchema)

export default Otp;