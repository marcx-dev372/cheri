'use client';

import './panel.css';
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseDb, firebaseStorage } from '../../lib/firebase';

export default function PanelPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDocs(collection(firebaseDb, 'products')).then((snapshot) => {
      setProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, []);

  const createProduct = async (event) => {
    event.preventDefault();
    if (!image) return setMessage('Selecciona una imagen.');
    setBusy(true);
    setMessage('Subiendo producto...');
    try {
      const imageRef = ref(firebaseStorage, `products/${crypto.randomUUID()}-${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      const product = { ...form, price: Number(form.price), imageUrl, published: true, createdAt: serverTimestamp() };
      const saved = await addDoc(collection(firebaseDb, 'products'), product);
      setProducts((current) => [{ id: saved.id, ...product }, ...current]);
      setForm({ name: '', price: '', description: '' });
      setImage(null);
      event.target.reset();
      setMessage('Producto publicado.');
    } catch {
      setMessage('No se pudo publicar. Revisa Firebase Storage y Firestore.');
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = async (id) => {
    await deleteDoc(doc(firebaseDb, 'products', id));
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return <main className="panel-shell"><div className="panel-card panel-wide"><header className="panel-header"><div><p className="panel-kicker">CHERY_DETALLES</p><h1>Productos</h1></div><span className="panel-access-note">Acceso por enlace privado</span></header><form className="product-form" onSubmit={createProduct}><input placeholder="Nombre del producto" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input type="number" min="0" step="0.01" placeholder="Precio" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /><textarea placeholder="Descripción" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} required /><button type="submit" disabled={busy}>{busy ? 'Publicando...' : 'Subir producto'}</button></form>{message && <p>{message}</p>}<section className="product-list">{products.map((product) => <article key={product.id}><img src={product.imageUrl} alt={product.name} /><div><strong>{product.name}</strong><p>S/ {product.price}</p><small>{product.description}</small></div><button type="button" onClick={() => removeProduct(product.id)}>Eliminar</button></article>)}</section></div></main>;
}