import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

type Pages = 0 | 1;

export const Tutorial: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [pageNumber, setPageNumber] = useState<Pages>(0);

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm p-2 my-2">
          <p>{t("tutorial.pageOne.text1")}</p>
          <p className="mb-2">{t("tutorial.pageOne.text2")}</p>
        </div>
        <Button onClick={() => setPageNumber(1)}>{t("next")}</Button>
      </>
    );
  };

  const PageTwo = () => {
    return (
      <>
        <div className="space-y-3 text-sm p-2 mb-2">
          <p>{t("tutorial.pageTwo.text1")}</p>
          <p className="mb-2">{t("tutorial.pageTwo.text2")}</p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(0)}>{t("back")}</Button>
          <Button onClick={onClose}>{t("gotIt")}</Button>
        </div>
      </>
    );
  };

  return (
    <>
      {pageNumber === 0 && PageOne()}
      {pageNumber === 1 && PageTwo()}
    </>
  );
};
