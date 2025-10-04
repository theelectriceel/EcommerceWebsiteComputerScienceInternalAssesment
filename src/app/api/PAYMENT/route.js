import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.SECRET);

export async function POST(request) {
  try {
    const { totalPrice } = await request.json();

    // Ensure totalPrice is a valid number
    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return NextResponse.json(
        { error: "Invalid total price." },
        { status: 400 }
      );
    }


    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice, 
      currency: "aed", 
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
 
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
