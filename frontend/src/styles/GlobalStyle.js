import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; overflow: hidden; }

  :root, [data-theme="dark"] {
    --bg:      #080812;
    --panel:   #0b0b18;
    --card:    #0e0e1e;
    --border:  #141424;
    --border2: #1e2a40;
    --accent:  #5a90e8;
    --text:    #c0cce8;
    --text2:   #6a7a9a;
    --muted:   #2a3a55;
    --dim:     #1a2030;
  }

  [data-theme="light"] {
    --bg:      #f4f5fb;
    --panel:   #ffffff;
    --card:    #eeeef8;
    --border:  #dde0f0;
    --border2: #b0b8d8;
    --accent:  #3b5fc0;
    --text:    #1a1a2e;
    --text2:   #4a5070;
    --muted:   #8090b0;
    --dim:     #b0b8d0;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    background: var(--bg);
    color: var(--text);
  }
  a { color: inherit; text-decoration: none; }
`

export default GlobalStyle
