import { useParams } from "react-router";
import ManageGameForm from "./manaGameForm";
import { useGame } from "../../../hooks/game/useGame";

const ManageGame = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGame(id);

  if (id && isLoading) return <p>Loading...</p>;
  if (id && error) return <p>Failed to fetch game</p>;

  return <ManageGameForm key={id ?? "create"} data={data} id={id} />;
};

export default ManageGame;
