
import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Panel } from "components/ui/Panel";

interface Props {
  closeModal: () => void;
}

export const PokerHouseModal: React.FC<Props> = ({ closeModal }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <h1>{"Hello"}</h1>
      <p>{"World"}</p>
      <Button onClick={closeModal}>{t("close")}</Button>
    </Panel>
  );
};