import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Initialize S3 Client for Digital Ocean Spaces
const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT || `https://${process.env.SPACES_REGION || "nyc3"}.digitaloceanspaces.com`,
  region: process.env.SPACES_REGION || "nyc3",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
  forcePathStyle: false, // Digital Ocean Spaces supports virtual-hosted style
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // Prefix for organizing images strictly
    // If userId represents a tenant or user context, we can separate by folder
    // But for now, we'll just dump in 'templateimages/' as requested or root if preferred.
    // User requested "add at templateimges"
    const prefix = "templateimages/";

    const command = new ListObjectsV2Command({
      Bucket: process.env.SPACES_BUCKET,
      Prefix: prefix,
      // Optional: Filter by specific user if we structured keys like templateimages/userId/
    });

    const data = await s3Client.send(command);

    const images = (data.Contents || [])
      .map((item) => {
        // Construct public URL
        // Format: https://{bucket}.{region}.digitaloceanspaces.com/{key}
        // OR specific CDN endpoint if configured
        const endpoint = process.env.SPACES_ENDPOINT || `https://${process.env.SPACES_REGION || "nyc3"}.digitaloceanspaces.com`;
        
        // Handling endpoint to be sure we form the url correctly
        // Common pattern for DO Spaces public url: https://bucket-name.region.digitaloceanspaces.com/key
        // But if endpoint includes protocol, we need to be careful.
        
        // Simplest public URL construction for Spaces:
        const publicUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION || "nyc3"}.cdn.digitaloceanspaces.com/${item.Key}`;
        // Note: Using CDN endpoint is often better if enabled. If not, remove .cdn.
        // Fallback to direct ref:
        const directUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION || "nyc3"}.digitaloceanspaces.com/${item.Key}`;
        
        return {
          id: item.Key,
          url: directUrl, // using direct endpoint for reliability initially
          name: item.Key.replace(prefix, ""), // clean name
          lastModified: item.LastModified,
          size: item.Size
        };
      })
      // Filter out folder placeholders if any (keys ending in /)
      .filter(img => !img.id.endsWith("/"))
      // Sort by newest first
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error listing images:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replaceAll(" ", "_"); // Simple sanitization
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const key = `templateimages/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key,
      Body: buffer,
      ACL: "public-read",
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construct the public URL
    const publicUrl = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION || "nyc3"}.digitaloceanspaces.com/${key}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      id: key,
      name: fileName
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
