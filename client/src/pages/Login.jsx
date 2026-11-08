import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { usuario, entrar } = useAuth();
  const location = useLocation();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={location.state?.desde ?? '/'} replace />;

  const enviar = async (valores) => {
    setError(null);
    setEnviando(true);
    try {
      await entrar(valores);
    } catch (e) {
      if (e.detalle) {
        form.setFields(Object.entries(e.detalle).map(([name, mensaje]) => ({ name, errors: [mensaje] })));
      } else {
        setError(e.status ? e.message : 'No se pudo conectar con el servidor. Inténtalo nuevamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f4f6f8' }}>
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <Typography.Title level={3} style={{ marginTop: 0 }}>SixSeven</Typography.Title>
        <Typography.Paragraph type="secondary">Ingresa con tu cuenta para continuar.</Typography.Paragraph>
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        <Form form={form} layout="vertical" requiredMark={false} onFinish={enviar}>
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: 'Ingresa tu correo' },
              { type: 'email', message: 'Ingresa un correo válido' },
            ]}
          >
            <Input autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingresa tu contraseña' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={enviando}>Ingresar</Button>
        </Form>
      </Card>
    </main>
  );
}

export default Login;
