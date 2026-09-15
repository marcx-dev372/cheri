export default async function RoutedPage({ params }) {
  const route = (await params).path.join('/');
  const source = `/index.html?route=${encodeURIComponent(route)}`;

  return (
    <iframe
      src={source}
      title="CHERY_DETALLES"
      style={{ border: 0, display: 'block', height: '100vh', width: '100%' }}
    />
  );
}