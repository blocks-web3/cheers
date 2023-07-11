"use client";
import axios from "axios";
import { useState } from "react";
import { ImagePixelated, ElementPixelated } from "react-pixelate";

export default function Home() {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const originUrl =
    // "https://as2.ftcdn.net/v2/jpg/05/81/56/49/1000_F_581564907_kC2mbPUqNtao3cgq1kTmGeyKWRU7ucQC.jpg";
    "https://as2.ftcdn.net/v2/jpg/06/02/64/67/1000_F_602646738_K6LugRq6VPbMWElfUQMnCqOZhcjQ2Own.jpg";
    // "https://as2.ftcdn.net/v2/jpg/06/02/64/75/1000_F_602647524_aP47B9Nr94gDG5YkRBNWiHFWiQ6jBfQW.jpg";
    // "https://as2.ftcdn.net/v2/jpg/06/02/64/75/1000_F_602647530_RPmZfH2OSRZyAc3DrRokvLomjZ6o8gUJ.jpg";
    // "https://as1.ftcdn.net/v2/jpg/05/65/49/44/1000_F_565494411_I2uUanw2CqAoWRROhKdThGvmdtyYMsWh.jpg";
    // "https://as1.ftcdn.net/v2/jpg/04/93/47/98/1000_F_493479838_jD4nfsRtLfkuyz1xY0uCDzAKXQKHBTbT.jpg";
    // "https://as2.ftcdn.net/v2/jpg/06/02/22/23/1000_F_602222303_STAOTzuTWzCzd6Vv9Gbrb20B26xK3Md5.jpg";
    // "https://i.seadn.io/gcs/files/2aceea15ce6011236c8297b5ae661233.png?auto=format&dpr=1&w=1000";
    // "https://as1.ftcdn.net/v2/jpg/06/01/76/54/1000_F_601765476_bUQYJqdk7NLH5X5CUOZwpBWxLRc0UyUt.jpg";
    // "https://as2.ftcdn.net/v2/jpg/06/01/89/01/1000_F_601890115_IrmNGfrI6r4zt1lwocm3ZFI5EnDwtPVg.jpg";

  async function onCllick() {
    if (typeof window === "undefined") return;

    try {
      const img = await convertUrl(originUrl);
      const file = new Blob([img], { type: "image/png" });
      setImgUrl(URL.createObjectURL(file));
    } catch (e) {
      alert("画像が複雑なため、変換に失敗しました。他のNFTでお試しください。");
      setImgUrl(originUrl);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={onCllick}>convert</button>

      {originUrl ? <img src={originUrl}></img> : ""}
      {imgUrl ? (
        <>
          <ImagePixelated src={imgUrl} fillTransparencyColor={"white"} />
        </>
      ) : (
        ""
      )}
    </main>
  );
}

async function convertUrl(imageUrl: string) {
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
        "X-Api-Key": "YvZXx6fH7zvrnsRgJyCAh7HR",
      },
    }
  );
  return res.data;
}
