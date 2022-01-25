import React from "react";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";
import question from "assets/icons/expression_confused.png";

const roundToOneDecimal = (number: number) => Math.round(number * 10) / 10;

const CHARITIES = [
  {
    name: "The Water Project",
    info: "You can provide clean, safe and reliable water today.",
    url: "https://thewaterproject.org/donate-ethereum",
  },
  {
    name: "The Heifer Project",
    info: "We do more than train farmers. We grow incomes.",
    url: "https://www.heifer.org/give/other/digital-currency.html",
  },
  {
    name: "Cool Earth",
    info: "Aim to halt deforestation and its impact on climate change.",
    url: "https://www.coolearth.org/cryptocurrency-donations/",
  },
];

interface Props {
  onDonate: () => void;
}

export const Charity: React.FC<Props> = ({ onDonate }) => {
  const [donation, setDonation] = React.useState(0.3);

  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.valueAsNumber);
    setDonation(roundToOneDecimal(e.target.valueAsNumber));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.1) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const onAboutClick = (url: string) => {
    window.open(url);
  };

  const onDonateAndPlayClick = () => {
    onDonate();
  };

  // TODO: Connect Donate and Play

  return (
    <Panel>
      <div className="flex flex-col text-shadow items-center">
        <h2 className="text-base mb-1">Donate to play.</h2>
        <p className="text-xs mb-3">
          To start a farm, you need to donate to a charity of your choice.
        </p>
      </div>
      <div className="flex flex-col items-center mb-3">
        <div className="relative">
          <input
            type="number"
            className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-1 text-center"
            step="0.1"
            min={0.1}
            value={donation}
            onChange={onDonationChange}
          />
          <img
            src={upArrow}
            alt="increment donation value"
            className="absolute -right-4 top-0"
            onClick={incrementDonation}
          />
          <img
            src={downArrow}
            alt="decrement donation value"
            className="absolute -right-4 bottom-0"
            onClick={decrementDonation}
          />
        </div>
        <span className="text-[10px] text-shadow mt-2">
          Minumum of 0.1 MATIC
        </span>
      </div>
      {CHARITIES.map(({ name, info, url }) => (
        <OuterPanel key={url} className="flex flex-col mt-4 last:mb-1">
          <div className="flex flex-col items-center mb-3">
            <h5 className="text-sm text-shadow underline mb-3">{name}</h5>
            <p className="text-xs text-center text-shadow mb-2">{info}</p>
          </div>

          <div className="flex justify-evenly">
            <Button className="w-full mr-1" onClick={() => onAboutClick(url)}>
              <span className="text-xs mr-1">About</span>
              <img src={question} className="scale-110" alt="question-mark" />
            </Button>
            <Button className="w-full ml-1" onClick={onDonateAndPlayClick}>
              <span className="text-xs whitespace-nowrap">Donate & Play</span>
            </Button>
          </div>
        </OuterPanel>
      ))}
    </Panel>
  );
};
