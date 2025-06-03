import { Button } from "components/ui/Button";
import walletIcon from "assets/icons/wallet.png";
import { t } from "i18next";

export const OtherWalletsButton: React.FC<{
  onClick: () => void;
  title: string;
}> = ({ onClick, title }) => {
  return (
    <Button className="mb-1 py-2 text-sm relative" onClick={onClick}>
      <div className="px-8">
        <img
          src={walletIcon}
          className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
        />
        {title}
      </div>
    </Button>
  );
};
