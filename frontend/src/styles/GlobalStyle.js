import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    height: 100%;
    overflow: hidden;
  }
  body {
    font-family: 'Courier New', Courier, monospace;
    background: #080812;
    color: #c0cce8;
  }
  a { color: inherit; text-decoration: none; }
`

export default GlobalStyle
