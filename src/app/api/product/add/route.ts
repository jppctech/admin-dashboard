import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import { productSchema } from '@/schemas/productSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  await dbConnect();
  
  try {
    const reqBody = await req.json();

    const validatedData = productSchema.parse(reqBody);

    const {
      name,
      description,
      price,
      category,
      stock,
      imageUrl 
    } = validatedData;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    });

    await newProduct.save();

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
