import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!,
});

export async function POST(req: NextRequest) {
  try {
    const { base64File, filename } = await req.json();

    const upload = await pinata.upload.public.base64(base64File, {
      metadata: { name: filename },
    });

    const uploadURL = `${process.env.PINATA_GATEWAY!}/ipfs/${upload.cid}`;

    return NextResponse.json({ uploadURL, success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed To Upload Image" },
      { status: 500 }
    );
  }
}
