/**
 * Sri Senthoor Granites - Centralized Typography Design Tokens
 * 
 * To change the primary font family globally across the entire project in the future,
 * simply update the `primary` font string below or update `--font-primary` in `src/index.css`.
 */

export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    primary: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
