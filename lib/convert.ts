import axios from "axios";

export const convertFromUrl = async (imageUrl: string) => {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_url", imageUrl);
  formData.append("crop", "true");

  const res = await axios.post(
    "https://api.remove.bg/v1.0/removebg",
    formData,
    {
      responseType: "arraybuffer",
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_IMAGE_APIKEY,
      },
    }
  );
  return res.data;
};
