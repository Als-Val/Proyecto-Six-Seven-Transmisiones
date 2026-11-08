import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Menu, Typography } from 'antd';
import { 
  CircleDollarSign, ReceiptText, PieChart,
  CalendarDays, Package, Handshake, Users, MonitorOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, salir } = useAuth();

  const menuItems = [
    {
      key: 'grp-agenda',
      modulo: 'AGENDA',
      label: 'Agenda',
      icon: <CalendarDays size={18} />,
      children: [
        { key: '/agenda/transmisiones', label: 'Transmisiones' },
        { key: '/agenda/staff', label: 'Staff', icon: <Users size={16} />, modulo: 'PERSONAL' }
      ],
    },
    {
      key: 'grp-inventario',
      modulo: 'INVENTARIO',
      label: 'Inventario',
      icon: <Package size={18} />,
      children: [
        { key: '/inventario/equipos', label: 'Equipos' },
        { key: '/inventario/mermas', label: 'Mermas', icon: <MonitorOff size={16} /> }
      ],
    },
    {
      key: 'grp-auspicios',
      modulo: 'AUSPICIOS',
      label: 'Auspicios',
      icon: <Handshake size={18} />,
      children: [
        { key: '/auspicios/marcas', label: 'Marcas' }
      ],
    },
    {
      key: 'grp-finanzas',
      modulo: 'FINANZAS',
      label: 'Finanzas',
      icon: <CircleDollarSign size={18} />,
      children: [
        { key: '/finanzas/costos', label: 'Costos Operativos', icon: <ReceiptText size={16} /> },
        { key: '/finanzas/resumen', label: 'Resumen Mensual', icon: <PieChart size={16} /> },
      ],
    },
  ];

  // RF01: cada perfil ve solo sus módulos. La API también valida cada acción.
  const permitido = ({ modulo }) => !modulo || usuario?.modulos.includes(modulo);
  const quitarModulo = ({ modulo, ...item }) => item;
  const itemsVisibles = menuItems.filter(permitido).map((item) => ({
    ...quitarModulo(item),
    children: item.children.filter(permitido).map(quitarModulo),
  }));

  const allGroupKeys = itemsVisibles.map(item => item.key);

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <div style={{ width: '256px', minWidth: '256px' }} className="h-screen bg-[#f4f6f8] border-r border-gray-200 flex flex-col">
    <div className="p-5">
        <div 
          style={{ 
            fontFamily: 'system-ui, sans-serif', 
            fontSize: '25px'
          }} 
          className="font-bold text-black tracking-tight"
        >
          SixSeven
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]} 
          openKeys={allGroupKeys} 
          items={itemsVisibles}
          onClick={handleMenuClick}
          expandIcon={<span />} 
          style={{ borderRight: 'none', background: 'transparent' }} 
        />
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
        <Typography.Text strong ellipsis style={{ display: 'block' }}>{usuario?.name}</Typography.Text>
        <Button type="link" onClick={salir} style={{ padding: 0 }}>Cerrar sesión</Button>
      </div>
    </div>
  );
};

export default Sidebar;