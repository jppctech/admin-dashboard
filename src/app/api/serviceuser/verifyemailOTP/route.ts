import dbConnect from "@/lib/dbConnect";
import ServiceUser from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    await dbConnect();
    
    try {
        const reqBody = await req.json();
        const {OTP, email} = await reqBody;

        const user = await ServiceUser.findOne({
            email: email,
            emailOTPExpiry: {$gt: Date.now()}
        });

        if(!user){
            return NextResponse.json({
                message: "OTP has been Expired"
            })
        }

        const validOTP: number = user.emailOTP;

        if(validOTP === OTP){
            user.isVerified = true;
            user.emailOTPExpiry = undefined;
            user.emailOTP = undefined

            await user.save();
        }

        return NextResponse.json({
            message: "email has been verified",
            data: 'verified'
        })
    } catch (error) {
        return NextResponse.json({
            error: error,
            message: "cannot handle the email verify otp route"
        },{
            status: 501
        })
    }
}