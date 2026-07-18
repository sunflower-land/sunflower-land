import React from "react";

import { ExpansionNodePreview } from "./ExpansionNodePreview";

const { renderToStaticMarkup } = jest.requireActual(
  "react-dom/server.node",
) as {
  renderToStaticMarkup: (node: React.ReactNode) => string;
};

jest.mock("lib/i18n/useAppTranslations", () => ({
  useAppTranslation: () => ({
    t: (key: string) =>
      ({
        "expansion.resourceNodes.title": "Resource nodes in this expansion",
        "expansion.resourceNodes.none": "No resource nodes in this expansion.",
      })[key] ?? key,
  }),
}));

jest.mock("lib/utils/hooks/useIsDarkMode", () => ({
  useIsDarkMode: () => ({ isDarkMode: false }),
}));

describe("ExpansionNodePreview", () => {
  it("renders multiple node types and counts", () => {
    const html = renderToStaticMarkup(
      <ExpansionNodePreview
        nodes={[
          { name: "Tree", count: 2 },
          { name: "Stone Rock", count: 1 },
        ]}
      />,
    );

    expect(html).toContain("Resource nodes in this expansion");
    expect(html).toContain("+2 Tree");
    expect(html).toContain("+1 Stone Rock");
  });

  it("clearly displays an expansion with no resource nodes", () => {
    const html = renderToStaticMarkup(<ExpansionNodePreview nodes={[]} />);

    expect(html).toContain("No resource nodes in this expansion.");
  });
});
