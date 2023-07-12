"use client";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
  const head = item.contractAddress.substring(0, 5);
  const tail = item.contractAddress.substring(38, 43);
  return `${head}...${tail} #${item.tokenId}`;
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
  const [originalImgUrl, setOriginalImgUrl] = useState<string>("");

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOriginalImgUrl(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onItemSelected(originalImgUrl);
  };

  if (!isConnected) {
    return <>Connect Wallet First</>;
  }

  if (convertedImgUrl) {
    return <></>;
  }

  return (
    <Box>
      <Grid>
        <FormLabel id="demo-radio-buttons-group-label">
          Select item for avatar from your collection
        </FormLabel>
      </Grid>
      <Grid>
        {items ? (
          <form onSubmit={handleSubmit}>
            <FormControl>
              <RadioGroup name="radio-buttons-group" onChange={handleChange}>
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
              </RadioGroup>
              <Button variant="text" type="submit">
                Convert
              </Button>
            </FormControl>
          </form>
        ) : (
          <></>
        )}
      </Grid>
    </Box>
  );
}
