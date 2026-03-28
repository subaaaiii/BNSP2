import { useSearchParams } from "react-router";
import SelectGameBrand from "./game";
import CreateOffer from "./create";

const CreateOfferFlow = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("game");

  if (!gameId) return <SelectGameBrand />;
  return <CreateOffer gameId={gameId} />;
};

export default CreateOfferFlow;