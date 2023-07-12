"use client";
import { convertFromUrl } from "@/lib/convert";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ImagePixelated } from "react-pixelate";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
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
  const [loading, setLoading] = useState<boolean>(false);
  // const originUrl = "https://as2.ftcdn.net/v2/jpg/06/02/64/67/1000_F_602646738_K6LugRq6VPbMWElfUQMnCqOZhcjQ2Own.jpg";

  async function onClick(originalImgUrl: string) {
    if (typeof window === "undefined") return;

    try {
      setLoading(true);
      setImgUrl("dummy");
      const img = await convertFromUrl(originalImgUrl);
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
      setImgUrl(undefined);
    } finally {
      setLoading(false);
    }
  }

  const selectAgain = () => {
    setImgUrl(undefined);
  };

  return (
    <main className="flex min-h-screen flex-col text text-center px-24 py-8">
      <WagmiConfig config={wagmiConfig}>
        <section className="flex flex-row-reverse">
          <Web3Button />
        </section>
        <section className="flex flex-col min-h-[50px] px-[80px] py-2">
          <img src="logo.png"></img>
        </section>
        <section className="bg-slate-100 p-2 rounded-xl bg-opacity-75">
          <AvatarSelect convertedImgUrl={imgUrl} onItemSelected={onClick} />
          <div className="max-w-full">
            {imgUrl ? (
              loading ? (
                <>Now Converting...</>
              ) : (
                <div className="pixel">
                  <ImagePixelated
                    src={imgUrl}
                    fillTransparencyColor={"white"}
                    width={300}
                    height={300}
                    centered
                  />
                  <button className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white hover:border-transparent py-2 px-4 border border-blue-500 m-2 rounded-full">
                    入室する
                  </button>
                  <button
                    className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white hover:border-transparent py-2 px-4 border border-red-500 m-2 rounded-full"
                    onClick={selectAgain}
                  >
                    選び直す
                  </button>
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        </section>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </main>
  );
}
