import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { 
  CircleDollarSign, PieChart,
  Calendar, Package, Handshake, Users, 
  Home, Monitor, Trash2, Tag, UserCheck, CreditCard, Receipt
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/inicio', 
      label: 'Inicio',
      icon: <Home size={18} />,
    },
    {
      key: '/agenda',
      label: 'Agenda',
      icon: <Calendar size={18} />,
    },
    {
      key: 'grp-inventario',
      label: 'Inventario',
      icon: <Package size={18} />,
      children: [
        { key: '/inventario/equipos', label: 'Equipos', icon: <Monitor size={16} /> },
        { key: '/inventario/mermas', label: 'Mermas', icon: <Trash2 size={16} /> }
      ],
    },
    {
      key: 'grp-personal',
      label: 'Personal',
      icon: <Users size={18} />,
      children: [
        { key: '/personal/trabajadores-cargos', label: 'Trabajadores y Cargos', icon: <UserCheck size={16} /> },
        { key: '/personal/control-pagos', label: 'Control de Pagos', icon: <CreditCard size={16} /> },
      ],
    },
    {
      key: 'grp-auspicios',
      label: 'Auspicios',
      icon: <Handshake size={18} />,
      children: [
        { key: '/auspicios/marcas', label: 'Marcas', icon: <Tag size={16} /> },
      ],
    },
    {
      key: 'grp-finanzas',
      label: 'Finanzas',
      icon: <CircleDollarSign size={18} />,
      children: [
        { key: '/finanzas/gastos', label: 'Gastos Operativos', icon: <Receipt size={16} /> },
        { key: '/finanzas/resumen', label: 'Resumen Mensual', icon: <PieChart size={16} /> },
      ],
    },
  ];

  const allGroupKeys = menuItems.map(item => item.key);

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
          items={menuItems}
          onClick={handleMenuClick}
          expandIcon={<span />} 
          style={{ borderRight: 'none', background: 'transparent' }} 
        />
      </div>
    </div>
  );
};

export default Sidebar;