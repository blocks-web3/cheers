"use client";
import { Web3Button } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import NftImage from "./NftImage";
import { alchemy } from "./alchemy";

type NftDigest = {
  image: string;
  contractAddress: string;
  tokenId: string;
};
const hasImage = (
  item: Omit<NftDigest, "image"> & { image: string | undefined }
): item is NftDigest => {
  return item.image !== undefined;
};

const digestToken = (item: NftDigest) => {
  const head = item.contractAddress.substring(0, 5);
  const tail = item.contractAddress.substring(38, 43);
  const tokenId = item.tokenId.substring(0, 6);
  return `${head}...${tail} #${tokenId}`;
};

type AvatarSelectProps = {
  convertedImgUrl: string | undefined;
  onItemSelected: (originalImgUrl: string) => Promise<void>;
};

export default function AvatarSelect({
  convertedImgUrl,
  onItemSelected,
}: AvatarSelectProps) {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<NftDigest[]>([]);

  useEffect(() => {
    if (!address) return;
    const getNfts = async () => {
      const tokens = await alchemy.nft.getNftsForOwner(address);
      const digests = await Promise.all(
        tokens.ownedNfts.map(async (each) => {
          const meta = await alchemy.nft.getNftMetadata(
            each.contract.address,
            each.tokenId,
            {}
          );
          return {
            image: meta.rawMetadata?.image,
            contractAddress: each.contract.address,
            tokenId: each.tokenId,
          };
        })
      );
      const filtered: NftDigest[] = [];
      digests.forEach((each) => {
        if (hasImage(each)) {
          filtered.push(each);
        }
      });
      setItems(filtered);
    };
    getNfts();
  }, [address]);

  if (!isConnected) {
    return <Web3Button label="Connect To Start!!" />;
  }

  if (convertedImgUrl) {
    return <></>;
  }

  return (
    <>
      <h2 className="text-slate-800 ">Select Character From Your Collection</h2>
      <div className="grid grid-cols-2 gap-1 p-2">
        {items ? (
          items.map((item, index) => {
            return (
              <NftImage
                imageUrl={item.image}
                nftName={digestToken(item)}
                key={index}
                onClicked={onItemSelected}
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
