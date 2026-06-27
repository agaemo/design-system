/**
 * 使い方:
 *   import baseConfig from '../design-system/tailwind/tailwind.config'
 *   export default { ...baseConfig, content: [...] }
 *
 * 前提: css/variables.css をプロジェクト側で読み込むこと
 */
const config = {
  theme: {
    extend: {
      colors: {
        /* ── Primitive: Neutral ─────────────────── */
        neutral: {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
          1000: 'var(--color-neutral-1000)',
        },

        /* ── Primitive: Blue ─────────────────────── */
        blue: {
          50: 'var(--color-blue-50)',
          100: 'var(--color-blue-100)',
          200: 'var(--color-blue-200)',
          300: 'var(--color-blue-300)',
          400: 'var(--color-blue-400)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          700: 'var(--color-blue-700)',
          800: 'var(--color-blue-800)',
          900: 'var(--color-blue-900)',
          950: 'var(--color-blue-950)',
        },

        /* ── Primitive: Status Colors ────────────── */
        green: {
          50: 'var(--color-green-50)',
          100: 'var(--color-green-100)',
          500: 'var(--color-green-500)',
          600: 'var(--color-green-600)',
          900: 'var(--color-green-900)',
          950: 'var(--color-green-950)',
        },
        yellow: {
          50: 'var(--color-yellow-50)',
          100: 'var(--color-yellow-100)',
          500: 'var(--color-yellow-500)',
          600: 'var(--color-yellow-600)',
          900: 'var(--color-yellow-900)',
          950: 'var(--color-yellow-950)',
        },
        red: {
          50: 'var(--color-red-50)',
          100: 'var(--color-red-100)',
          500: 'var(--color-red-500)',
          600: 'var(--color-red-600)',
          900: 'var(--color-red-900)',
          950: 'var(--color-red-950)',
        },

        /* ── Semantic: Background ────────────────── */
        bg: {
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          sunken: 'var(--bg-sunken)',
        },

        /* ── Semantic: Surface ───────────────────── */
        surface: {
          DEFAULT: 'var(--surface)',
          subtle: 'var(--surface-subtle)',
          inset: 'var(--surface-inset)',
        },

        /* ── Semantic: Border ────────────────────── */
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },

        /* ── Semantic: Text ──────────────────────── */
        foreground: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          accent: 'var(--text-accent)',
        },

        /* ── Semantic: Accent ────────────────────── */
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          foreground: 'var(--accent-text)',
        },

        /* ── Semantic: Status ────────────────────── */
        success: {
          DEFAULT: 'var(--status-success)',
          subtle: 'var(--status-success-bg)',
        },
        warning: {
          DEFAULT: 'var(--status-warning)',
          subtle: 'var(--status-warning-bg)',
        },
        error: {
          DEFAULT: 'var(--status-error)',
          subtle: 'var(--status-error-bg)',
        },
        info: {
          DEFAULT: 'var(--status-info)',
          subtle: 'var(--status-info-bg)',
        },
      },

      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
      },

      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-snug)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-snug)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-tight)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
      },

      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        none: 'var(--shadow-none)',
      },
    },
  },

  plugins: [],
}

export default config
