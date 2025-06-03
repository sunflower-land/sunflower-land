import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";

export const WechatButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <Button className="mb-1 py-2 text-sm relative" onClick={onClick}>
      <img
        src={SUNNYSIDE.icons.wechatIcon}
        className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
      />
      {"Wechat"}
    </Button>
  );
};
