import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";

export const RoninButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      className="mb-1 py-2 text-sm relative justify-start"
      onClick={onClick}
    >
      <div className="px-8 mr-2 flex ">
        <img
          src={SUNNYSIDE.icons.roninIcon}
          className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
        />
        {"Ronin"}
      </div>
    </Button>
  );
};
