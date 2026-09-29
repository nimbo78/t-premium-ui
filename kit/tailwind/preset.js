/** T-Premium UI Tailwind preset: colours are the theme tokens, fonts are the kit fonts. */
const token = (name) => `var(--${name})`;

export default {
  theme: {
    extend: {
      colors: {
        page: token("page"),
        line: token("line"),
        fg: { DEFAULT: token("text"), muted: token("muted"), faint: token("faint") },
        accent: { DEFAULT: token("accent"), soft: token("accent-soft"), text: token("accent-text") },
        pos: { DEFAULT: token("pos-text"), bg: token("pos-bg") },
        neg: { DEFAULT: token("neg-text"), bg: token("neg-bg") },
        warn: { DEFAULT: token("warn-text"), bg: token("warn-bg") },
      },
      fontFamily: {
        heading: ["TinkoffSans", "Arial", "sans-serif"],
        sans: ["Haas", "Arial", "sans-serif"],
        mono: ["ui-monospace", "Cascadia Mono", "Consolas", "monospace"],
      },
    },
  },
};
