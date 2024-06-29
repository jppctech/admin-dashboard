import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import { productSchema } from '@/schemas/productSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    // const { searchParams } = new URL(req.url, `http://${req.headers.get('host')}`);
    // const id = searchParams.get('id');

    const reqB = await req.json();

    const {id} = await reqB;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        error: 'Invalid or missing product ID',
      }, {
        status: 400,
      });
    }

    const reqBody = await req.json();
    // Validate the request body using Zod
    const validatedData = productSchema.partial().parse(reqBody);

    const updatedProduct = await Product.findByIdAndUpdate(id, validatedData, { new: true });// need to code more again, this is a simple code 

    if (!updatedProduct) {
      return NextResponse.json({
        error: 'Product not found',
      }, {
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Product successfully updated',
      product: updatedProduct,
    }, {
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json({
        error: error.errors,
        message: 'Validation error',
      }, {
        status: 400,
      });
    }

    return NextResponse.json({
      error: 'Something went wrong while updating the product',
    }, {
      status: 500,
    });
  }
}
