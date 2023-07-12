import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
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
  return `${item.contractAddress.substring(
    0,
    5
  )}...${item.contractAddress.substring(38, 43)} #${item.tokenId}`;
};

export const AvatarSelect = () => {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<NftDigest[]>([]);
  if (!isConnected) {
    return <>Connect Wallet First</>;
  }

  useEffect(() => {
    if (!address) return;
    const getNfts = async () => {
      const contractAddresses = ["0x7409f5b06c370997b9eF7Ba263C6987bBCc1C6fF"];
      const tokens = await alchemy.nft.getNftsForOwner(address, {
        contractAddresses,
      });
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

  return (
    <div>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          Select item for avatar from your collection
        </FormLabel>
        <RadioGroup name="radio-buttons-group">
          <Grid>
            {items.map((item, index) => {
              return (
                <Grid key={index} item xs={4}>
                  <img src={item.image} alt="" height={120} width={120} />
                  <FormControlLabel
                    value={item.image}
                    control={<Radio />}
                    label={digestToken(item)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>
      </FormControl>
    </div>
  );
};
