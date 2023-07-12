type Props = {
  imageUrl: string;
  nftName: string;
  onClicked: (imageUrl: string) => Promise<void>;
};
export default function NftImage(props: Props) {
  return (
    <div
      className="rounded-lg border-2 bg-slate-200 p-3 bg-gray"
      onClick={() => props.onClicked(props.imageUrl)}
    >
      <img className="rounded-lg" src={props.imageUrl} width={300}></img>
      <h3 className="text-slate-800">{props.nftName}</h3>
    </div>
  );
}
