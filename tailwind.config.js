/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./alpha_frontend_stich/**/*.html"
],

  darkMode: "class",

  theme: {
    extend: {

      colors: {
        "laurel-green": "#B5BFA1",
        "warm-neutral": "#F5F5F4",
        "sage-muted": "#D7DEC8",
        "surface-glass": "rgba(253,252,248,0.7)",
        "surface-card": "rgba(255,255,255,0.6)",
        "overlay-dark": "rgba(0,0,0,0.3)",

        "background": "#141313",
        "surface": "#141313",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",

        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",

        "surface-variant": "#e2e2e2",

        "primary": "#ffffff",
        "primary-container": "#1c1b1b",
        "primary-fixed": "#e5e2e1",
        "primary-fixed-dim": "#c8c6c5",

        "secondary": "#B5BFA1",
        "secondary-container": "#B5BFA1",
        "secondary-fixed": "#B5BFA1",
        "secondary-fixed-dim": "#B5BFA1",

        "tertiary": "#ffffff",
        "tertiary-container": "#1a1c1c",
        "tertiary-fixed": "#e2e2e2",
        "tertiary-fixed-dim": "#c6c6c7",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",

        "outline": "#747878",
        "outline-variant": "#c4c7c7",

        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#c8c6c5",

        "surface-tint": "#5f5e5e",

        "on-background": "#e5e2e1",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#444748",

        "on-primary": "#1a1c1c",
        "on-primary-container": "#858383",
        "on-primary-fixed": "#1c1b1b",
        "on-primary-fixed-variant": "#474646",

        "on-secondary": "#1a1c1c",
        "on-secondary-container": "#4d685e",
        "on-secondary-fixed": "#052018",
        "on-secondary-fixed-variant": "#324c43",

        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#838484",
        "on-tertiary-fixed": "#1a1c1c",
        "on-tertiary-fixed-variant": "#454747",

        "on-error": "#ffffff",
        "on-error-container": "#93000a"
      },

      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "9999px"
      },

      spacing: {
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "gutter": "24px",
        "container-max": "1280px",
        "base": "8px"
      },

      fontFamily: {
        "display-lg": ["Poppins"],
        "headline-lg": ["Montserrat"],
        "headline-lg-mobile": ["Montserrat"],
        "headline-md": ["Montserrat"],

        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "caption": ["Inter"],

        "accent-label": ["Work Sans"]
      },

      fontSize: {
        "display-lg": [
          "64px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            fontWeight: "700"
          }
        ],

        "headline-lg": [
          "40px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
            fontWeight: "700"
          }
        ],

        "headline-lg-mobile": [
          "32px",
          {
            lineHeight: "1.2",
            fontWeight: "700"
          }
        ],

        "headline-md": [
          "24px",
          {
            lineHeight: "1.3",
            fontWeight: "600"
          }
        ],

        "body-lg": [
          "18px",
          {
            lineHeight: "1.6",
            fontWeight: "400"
          }
        ],

        "body-md": [
          "16px",
          {
            lineHeight: "1.5",
            fontWeight: "400"
          }
        ],

        "caption": [
          "12px",
          {
            lineHeight: "1.4",
            fontWeight: "400"
          }
        ],

        "accent-label": [
          "14px",
          {
            lineHeight: "1.2",
            letterSpacing: "0.05em",
            fontWeight: "500"
          }
        ]
      }
    }
  },

  plugins: []
}