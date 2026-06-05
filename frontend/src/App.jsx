import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalStyle from './styles/GlobalStyle'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import TreeDetail from './pages/TreeDetail'

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trees/:id" element={<TreeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
