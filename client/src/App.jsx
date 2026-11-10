import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout'; 


import Tablero from './pages/Tablero';
import Agenda from './pages/Agenda';
import Personal from './pages/Personal';
import Inventario from './pages/Inventario';
import Financiero from './pages/Financiero';
import Auspicios from './pages/Auspicios';
import Usuarios from './pages/Usuarios';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/tablero" element={<Tablero />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/personal" element={<Personal />} />
         <Route path="/inventario" element={<Inventario />} />
          <Route path="/financiero" element={<Financiero />} />
         <Route path="/auspicios" element={<Auspicios />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}


export default App;