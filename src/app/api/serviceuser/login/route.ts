import dbConnect from "@/lib/dbConnect";
import ServiceUser from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest) {
    await dbConnect();

    try {
        const reqBody = await req.json();

        const {
            email,
            password
        } = await reqBody;

        const user = await ServiceUser.findOne({email: email});

        if(!user){
            return NextResponse.json({
                message: "user not found",
                data: "notfound"
            })
        }

        const validPass = await bcrypt.compare(password, user.password);

        if(!validPass){
            return NextResponse.json({
                message: "password did not matched",
                data: "invalidpassword"
            })
        }

        const tokenData = {
            id: user._id,
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN!);

        const response = NextResponse.json({
            data: 'true',
            message: "Logged In Success",
            success: true
           }) 

        response.cookies.set("token", token, {
            httpOnly: true
           })
           return response

    } catch (error) {
        return NextResponse.json({
            message: "something went wrong while logging in"
        })
    }
}