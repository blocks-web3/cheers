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

export default function Home() {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  // const originUrl = "https://as2.ftcdn.net/v2/jpg/06/02/64/67/1000_F_602646738_K6LugRq6VPbMWElfUQMnCqOZhcjQ2Own.jpg";

  async function onClick(originalImgUrl: string) {
    if (typeof window === "undefined") return;

    try {
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
      setImgUrl(originalImgUrl);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WagmiConfig config={wagmiConfig}>
        <Web3Button />
        <AvatarSelect convertedImgUrl={imgUrl} onItemSelected={onClick} />
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
