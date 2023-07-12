type Props = {
  imageUrl: string;
  nftName: string;
  onClicked: (imageUrl: string) => Promise<void>;
};
export default function NftImage(props: Props) {
  return (
    <button
      className="rounded-lg bg-slate-200 p-3 bg-gray hover:bg-slate-50"
      onClick={() => props.onClicked(props.imageUrl)}
    >
      <img className="rounded-lg" src={props.imageUrl} width={300}></img>
      <h3 className="text-slate-800">{props.nftName}</h3>
    </button>
  );
}
