module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "mixin",
          "extend",
          "content",
          "include",
          "for",
          "function",
          "return",
        ],
      },
    ],
    "selector-pseudo-element-no-unknown": [
      true,
      {
        ignorePseudoElements: ["v-deep"],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["export"],
      },
    ],
    indentation: 2,
    "no-descending-specificity": null,
    "declaration-colon-newline-after": null,
    "rule-empty-line-before": "never",
    "selector-list-comma-newline-after": "always-multi-line",
    "declaration-block-single-line-max-declarations": 1,
    "number-leading-zero": "never"
  },
  ignoreFiles: ["**/*.js"],
};