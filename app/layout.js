export const metadata = {
  title: 'Flores y Regalos a Domicilio en Trujillo y Piura | Tulipanda',
  description: 'Envío de flores frescas y regalos a domicilio en Trujillo y Piura.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: '100vh', overflow: 'hidden' }}>{children}</body>
    </html>
  );
}
