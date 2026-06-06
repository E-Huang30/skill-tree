import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalStyle from './styles/GlobalStyle'
import { ThemeProvider } from './context/ThemeContext'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import TreeDetail from './pages/TreeDetail'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trees/:id" element={<TreeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
