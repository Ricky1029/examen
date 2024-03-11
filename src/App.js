import { React, useEffect } from 'react';
import "./firebase.css";
import { db, storage } from "./firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const style = {
  bg: `bg-slate-200 min-h-screen flex justify-center items-center flex-col p-4 gradient bg-gradient-to-r from-yellow-600 to-red-400`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  container2: `bg-slate-100 max-w-[1700px] w-full m-auto rounded-md shadow-xl p-4 mt-4`,
  heading: `text-4xl font-bold text-center text-gray-800 p-2`,
  bodyText: `text-xl text-gray-700 p-2 text-left`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-2 ml-2 bg-purple-600 text-slate-100`,
  buttonLista: `border p-2 ml-2 bg-green-600 text-slate-100`,
  count: `text-center p-2`,
  img: `w-1/2 m-auto`,
  grid: `grid grid-cols-3 gap-4`
}

function App() {

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [ingredientes, setIngredientes] = useState('')
  const [pan, setPan] = useState('')
  const [size, setSize] = useState('')
  const [image, setImage] = useState(null);
  const [id, setId] = useState('');
  const [show, setShow] = useState(false);
  const [val, setVal] = useState([])
  
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sandwiches"), (snapshot) => {
      setVal(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const value = collection(db, 'sandwiches')
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const handleEdit = async (id, nombre, precio, ingredientes, pan, size) => {
    setNombre(nombre);
    setPrecio(precio);
    setIngredientes(ingredientes);
    setPan(pan);
    setSize(size);
    setId(id);
    setShow(true);
  }

  const handleUpdate = async () => {
    const updateVal = doc(db, "sandwiches", id);
    await updateDoc(updateVal, {
      nombre: nombre,
      precio: precio,
      ingredientes: ingredientes,
      pan: pan,
      size: size,
    });
    if (image) {
      const storageRef = ref(storage, 'imagenes/' + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      await updateDoc(updateVal, {
        img: downloadURL,
      });
    }
    setNombre('');
    setPrecio('');
    setIngredientes('');
    setPan('');
    setSize('');
    setImage(null);
    setShow(false);
  }

  const handleDelete = async (id) => {
    const deleteVal = doc(db, "sandwiches", id);
    await deleteDoc(deleteVal);
  }

  const handleCreate = async () => {
    try {
      if (!nombre || !precio || !ingredientes || !pan || !size || !image) {
        alert('Por favor llena todos los campos');
        return;
      }
      if (isNaN(precio)) {
        alert('El precio debe ser un numero');
        return;
      }
      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        alert('El archivo debe ser de tipo jpeg o png');
        return;
      }

      // Esto agrega un nombre unico a la imagen por si pregunta el profe
      const imgFileName = uuidv4() + '_' + image.name;

      const storageRef = ref(storage, 'imagenes/' + imgFileName);

      await uploadBytes(storageRef, image);

      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(value, {
        nombre: nombre,
        precio: precio,
        ingredientes: ingredientes,
        pan: pan,
        size: size,
        img: downloadURL,
      });
      setNombre('');
      setPrecio('');
      setIngredientes('');
      setPan('');
      setSize('');
      setImage(null);
      alert('Sandwich Creado Exitosamente Excitoso!');
    } catch (error) {
      alert('No sabe subir un sandwich el wey');
    }
    
  };

  
  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h1 className={style.heading}>Crea tu Sandwich</h1>
        <h2>Nombre del sandwich</h2>
        <input className={style.input} value={nombre} onChange={(e) => setNombre(e.target.value)} /> <br /> <br />
        <h2>Precio</h2>
        <input className={style.input} value={precio} onChange={(e) => setPrecio(e.target.value)} /> <br /> <br />
        <h2>Ingredientes</h2>
        <input className={style.input} value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} /> <br /> <br />
        <h2>Tipo de Pan</h2>
        <input className={style.input} value={pan} onChange={(e) => setPan(e.target.value)} /> <br /> <br />
        <h2>Tamaño</h2>
        <input className={style.input} value={size} onChange={(e) => setSize(e.target.value)} /> <br /> <br />
        <h2>Sube la Imagen</h2>
        <input type="file" onChange={handleImageChange} /> <br /> <br />
        {!show?<button className={style.button} onClick={handleCreate}>Create</button>:
        <button className={style.button} onClick={handleUpdate}>Update</button>}
      </div>
      <div className={style.container2}>
        <h1 className={style.heading}>Sandwiches</h1> <hr /><hr /><hr /><hr />
        <div className={style.grid}>
        {
          val.map(values => 
            <div className={style.heading}>
              <h1>{values.nombre}<br /></h1>
              <div className={style.bodyText}>
              <h2>Precio: {values.precio}<br /></h2>
              <h3><p>Ingredientes: {values.ingredientes}</p></h3>
              <h4>Tipo de pan: {values.pan}<br /></h4>
              <h5>Tamaño: {values.size}<br /></h5>
              <img className={style.img} src={values.img} alt="sandwich" /><br />
              <button className={style.buttonLista} onClick={() => handleDelete(values.id)}>Delete</button>
              <button className={style.buttonLista} onClick={() => handleEdit(values.id, values.nombre, values.precio, values.ingredientes, values.pan, values.size)}>Edit</button>
              <br /><br /><br />
              <hr /><hr /><hr /><hr />
              </div>
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
}

export default App;
