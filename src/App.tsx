import { HashRouter, Route, Routes } from 'react-router-dom'
import StarField from './components/StarField'
import Hub from './pages/Hub'
import FortuneGame from './games/fortune'
import EliminationGame from './games/elimination'
import PersonalityGame from './games/personality'
import CatchGame from './games/catch'

export default function App() {
  return (
    <div className="relative min-h-full">
      <StarField />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/fortune" element={<FortuneGame />} />
          <Route path="/elimination" element={<EliminationGame />} />
          <Route path="/personality" element={<PersonalityGame />} />
          <Route path="/catch" element={<CatchGame />} />
          <Route path="*" element={<Hub />} />
        </Routes>
      </HashRouter>
    </div>
  )
}
