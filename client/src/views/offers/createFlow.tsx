import { useSearchParams } from "react-router";
import SelectGameBrand from "./game";
import ProductForm from "./form";

const CreateOfferFlow = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("game");
  const productId = searchParams.get("id");

  if (productId) {return <ProductForm/>;}

  if (!gameId){ return <SelectGameBrand />;
  }
  return <ProductForm/>;

};

export default CreateOfferFlow;