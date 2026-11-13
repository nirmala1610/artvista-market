export const uploadToCloudinary = async (file) => {

  if (!file) return null;

  try {

    const data = new FormData();

    data.append("file", file);

    data.append(
      "upload_preset",
      "ArtVista"
    );

    data.append("folder", "artvista");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxd1wajan/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const result = await res.json();

    return result.secure_url;

  } catch (err) {

    console.error(err);
    return null;
  }
};