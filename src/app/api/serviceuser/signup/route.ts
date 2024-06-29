import dbConnect from '@/lib/dbConnect';
import ServiceUser from '@/models/userSchema';
import { userSchema } from '@/schemas/serviceUserSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import bcrypt from "bcrypt"
import { sendEmail } from '@/utils/mailer';
import { sendSMS } from '@/utils/sms';

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const reqBody = await req.json();
    const validatedData = userSchema.parse(reqBody);

    const {
        first_name,
        last_name,
        email,
        // phone,
        password,
    } = validatedData;

    const user = await ServiceUser.findOne({email});

    if(user){
      return NextResponse.json({
        message: "user already exits",
        data: 'already'
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const emailOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    // const phoneOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const newProduct = new ServiceUser({
        first_name,
        last_name,
        email,
        // phone,
        password: hashedPass, 
        emailOTP,
        emailOTPExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP expiry 10 minutes from now
        // phoneOTP,
        // phoneOTPExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP expiry 10 minutes from now
    });

    await newProduct.save();

     // Send OTP to email
    await sendEmail(email, 'OTP for email verification', emailOTP, first_name);

    // Send OTP to phone
    // await sendSMS(phone, `Your verification OTP is: ${phoneOTP}`);

    return NextResponse.json({
      newProduct,
      message: "A product has been added",
    }, {
      status: 201
    });

  } catch (error) {
    console.error('Error:', error);

    // Check if the error is from Zod validation
    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.errors,
        message: "Validation error"
      }, {
        status: 400
      });
    }

    // General error handling
    return NextResponse.json({
      error: "Something went wrong while adding the product"
    }, {
      status: 500
    });
  }
}
