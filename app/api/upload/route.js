import { google } from "googleapis";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { pipeline } from "stream";
import { Readable } from "stream";


const driveFolderId = "15fL6TQQuoYO2FEwn9hS8dOvkjn78EulE"; // ID of the shared Google Drive folder


const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, "base64").toString("utf8")
    ),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  console.log("File received:", file);

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [driveFolderId],
    },
    media: {
      mimeType: file.type,
      body: bufferToStream(buffer),
    },
  });

  return NextResponse.json({ success: true, fileId: res.data.id });
}

function BufferToStream(buffer) {
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(buffer);
      controller.close();
    },
  });

  return readable;
}
