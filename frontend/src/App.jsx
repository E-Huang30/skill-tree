import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalStyle from './styles/GlobalStyle'
import { ThemeProvider } from './context/ThemeContext'
import Landing from './pages/Landing'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import TreeDetail from './pages/TreeDetail'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppShell />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/trees/:id" element={<TreeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
