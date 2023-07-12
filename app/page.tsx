"use client";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ImagePixelated } from "react-pixelate";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import NftImage from "./NftImage";
const AvatarSelect = dynamic(() => import("../lib/AvatarSelect"), {
  ssr: false,
});

const chains = [mainnet, polygon];
const projectId = "95a4b5b36b00fe83481dda90ea3dd77c";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const nftData = [
  {
    imageUrl:
      "https://as2.ftcdn.net/v2/jpg/06/02/64/67/1000_F_602646738_K6LugRq6VPbMWElfUQMnCqOZhcjQ2Own.jpg",
    nftName: "charactor1",
  },
  {
    imageUrl:
      "https://as2.ftcdn.net/v2/jpg/05/81/56/49/1000_F_581564907_kC2mbPUqNtao3cgq1kTmGeyKWRU7ucQC.jpg",
    nftName: "charactor2",
  },
  {
    imageUrl:
      "https://as2.ftcdn.net/v2/jpg/06/02/22/23/1000_F_602222303_STAOTzuTWzCzd6Vv9Gbrb20B26xK3Md5.jpg",
    nftName: "charactor3",
  },
  {
    imageUrl:
      "https://i.seadn.io/gcs/files/2aceea15ce6011236c8297b5ae661233.png?auto=format&dpr=1&w=1000",
    nftName: "charactor4",
  },
];

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
      const img = await convertFromUrl(originUrl);
      const file = new Blob([img], { type: "image/png" });
      setImgUrl(URL.createObjectURL(file));
    } catch (error: any) {
      console.log(error);
      if (!error.isAxiosError) {
      } else if (error.response.status === 402) {
        alert(`APIの利用条件に達しました。しばらくお待ちください。`);
      } else {
        alert(
          `画像が複雑なため、変換に失敗しました。他のNFTでお試しください。`
        );
      }
      setImgUrl(originUrl);
    }
  }

  return (
    <main className="flex min-h-screen flex-col text text-center px-24 py-8">
      <WagmiConfig config={wagmiConfig}>
        <section className="flex flex-row-reverse">
          <Web3Button />
        </section>
        <section className="flex flex-col min-h-[50px] px-[80px] py-2">
          <img src="logo.png"></img>
          <Web3Button label="Connect To Start!!" />
        </section>
        <section className="bg-slate-100 p-2 rounded-xl bg-opacity-75">
          <h2 className="text-slate-800 ">
            Select Charactor From Your Collection
          </h2>
          <div className="grid grid-cols-2 gap-1 p-2">
            {nftData.map((data) => {
              return (
                <NftImage
                  imageUrl={data.imageUrl}
                  nftName={data.nftName}
                ></NftImage>
              );
            })}
          </div>
        </section>

        {imgUrl ? (
          <>
            <ImagePixelated src={imgUrl} fillTransparencyColor={"white"} />
          </>
        ) : (
          ""
        )}
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </main>
  );
}

async function convertFromUrl(imageUrl: string) {
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
}
