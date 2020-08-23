// @flow

const palette = {
  orange: {
    lightest: '#f59470',
    lighter: '#f3774a',
    light: '#f26d3d',
    primary: '#f05a23',
    dark: '#e84a10',
    darker: '#db460f',
    darkest: '#b4390c'
  },
  blue: {
    lightest: '#6896e3',
    lighter: '#487fdd',
    light: '#3e78db',
    primary: '#2869d7',
    dark: '#245ec2',
    darker: '#2259b7',
    darkest: '#1c4997'
  },
  shades: {
    white: '#ffffff',
    lightGrey: '#f0f0f0',
    grey: '#c8c8c8',
    greyer: '#a0a0a0',
    darkGrey: '#787878',
    darkestGrey: '#505050',
    black: '#282828'
  },
  navy: {
    lightest: '#0d347c',
    lighter: '#0b2e6d',
    light: '#0b2c69',
    primary: '#0a285f',
    dark: '#092456',
    darker: '#082251',
    darkest: '#071c43'
  },
  warmBlue: {
    lightest: '#4d94ff',
    lighter: '#267dff',
    light: '#1a75ff',
    primary: '#0066ff',
    dark: '#005ce6',
    darker: '#0057d9',
    darkest: '#0047b3'
  },
  green: {
    lightest: '#ace151',
    lighter: '#9edb33',
    light: '#99da29',
    primary: '#8cc823',
    dark: '#7eb420',
    darker: '#77aa1e',
    darkest: '#628c18'
  },
  purple: {
    lightest: '#823bbd',
    lighter: '#7334a7',
    light: '#6e32a0',
    primary: '#642d91',
    dark: '#5a2983',
    darker: '#55267b',
    darkest: '#462066'
  },
  red: {
    lightest: '#da5155',
    lighter: '#d4343a',
    light: '#d12c31',
    primary: '#be282d',
    dark: '#ab2428',
    darker: '#a22226',
    darkest: '#851c1f'
  },
  yellow: {
    lightest: '#fcf570',
    lighter: '#fbf347',
    light: '#fbf239',
    primary: '#faf01e',
    dark: '#f7ec05',
    darker: '#e9de05',
    darkest: '#c0b704'
  }
}

module.exports = {
  plain: {
    color: palette.shades.darkestGrey,
    backgroundColor: palette.shades.lightGrey
  },
  styles: [
    {
      types: ["comment", "shebang"],
      style: {
        color: palette.warmBlue.lightest,
        opacity: 0.7
      }
    },
    {
      types: ["prolog", "doctype", "cdata", "attr-name"],
      style: {
        color: palette.shades.black
      }
    },
    {
      types: ["punctuation"],
      style: {
        color: palette.shades.darkGrey
      }
    },
    {
      types: ["tag", "number"],
      style: {
        color: palette.warmBlue.primary
      }
    },
    {
      types: ["property"],
      style: {
        color: palette.orange.light
      }
    },
    {
      types: ["function"],
      style: {
        color: palette.green.dark,
        fontWeight: 'bold'
      }
    },
    {
      types: ["builtin"],
      style: {
        color: palette.red.lightest
      }
    },
    {
      types: ["tag-id", "selector", "atrule-id"],
      style: {
        color: palette.navy.primary
      }
    },
    {
      types: ["string"],
      style: {
        color: palette.warmBlue.primary
      }
    },
    {
      types: [
        "boolean",
        "entity",
        "url",
        "attr-value",
        "keyword",
        "control",
        "directive",
        "unit",
        "statement",
        "regex",
        "at-rule",
        "placeholder"
      ],
      style: {
        color: palette.orange.dark,
        fontStyle: 'italic'
      }
    },
    {
      types: ["variable"],
      style: {
        color: palette.warmBlue.primary
      }
    },
    {
      types: ["deleted"],
      style: {
        textDecorationLine: "line-through"
      }
    },
    {
      types: ["inserted"],
      style: {
        textDecorationLine: "underline"
      }
    },
    {
      types: ["italic", "comment", "shebang"],
      style: {
        fontStyle: "italic"
      }
    },
    {
      types: ["important", "bold", "builtin"],
      style: {
        fontWeight: "bold"
      }
    }
  ]
};
