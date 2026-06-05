import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root, [data-theme="dark"] {
    --bg:      #06060f;
    --panel:   #0b0b18;
    --card:    #0d0d1c;
    --border:  #141424;
    --border2: #1a2030;
    --text:    #c0cce8;
    --text2:   #8090b0;
    --muted:   #2a3a55;
    --dim:     #1e2a3a;
    --accent:  #5a90e8;
    --dot-bg:  #1a1a2e;
  }

  [data-theme="light"] {
    --bg:      #f0f0f8;
    --panel:   #e6e8f4;
    --card:    #ffffff;
    --border:  #c8ccde;
    --border2: #b8bcd4;
    --text:    #1a1a2e;
    --text2:   #3a4a6a;
    --muted:   #6a7a9a;
    --dim:     #8090aa;
    --accent:  #3a6ad8;
    --dot-bg:  #c0c8e0;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Courier New', Courier, monospace;
    background: var(--bg);
    color: var(--text);
    transition: background 0.2s, color 0.2s;
  }

  a { color: inherit; text-decoration: none; }
`

export default GlobalStyle
