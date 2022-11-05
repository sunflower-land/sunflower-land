module.exports = {
  ci: {
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      // preset: "lighthouse:recommended",
      // budgetsFile: "./budget.json",
      "first-contentful-paint": ["error", { maxNumericValue: 8600 }],
      interactive: ["error", { maxNumericValue: 18900 }],
      "total-blocking-time": ["error", { maxNumericValue: 2200 }],
      "categories:performance": ["error", { minScore: 0.17 }],
      "categories:accessibility": ["error", { minScore: 0.7 }],
      "categories:best-practices": ["error", { minScore: 0.85 }],
    },
  },
};
