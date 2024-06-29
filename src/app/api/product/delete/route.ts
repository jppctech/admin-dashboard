import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    // const { searchParams } = new URL(req.url);
    // const id = searchParams.get('id');

    const reqBody = await req.json();
    const {id} = await reqBody;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        error: 'Invalid or missing product ID',
      }, {
        status: 400,
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({
        error: 'Product not found',
      }, {
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Product successfully deleted',
      product: deletedProduct,
    }, {
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: 'Something went wrong while deleting the product',
    }, {
      status: 500,
    });
  }
}
