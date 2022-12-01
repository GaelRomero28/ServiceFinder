import React, {useEffect,useState} from 'react'
import axios from "axios";
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css"
import Button from '@mui/material/Button';
import { Modal, ModalBody,ModalFooter,ModalHeader } from 'reactstrap';
function App() {
  const baseURL = "https://localhost:44368/api/servicio";
  const [data,setData] =useState([]);
  const [modalInsertar,setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [servicioSeleccionado,setServicioSeleccionado] = useState({
    idServicio:0,
    idProfesionista:0,
    servicio:"",
    descripcion: "",
    precio: 0.00
  })


  const peticionGet=async()=>{
    await axios.get(baseURL)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error)
    })
  }

  const peticionPost=async()=>{
    delete servicioSeleccionado.idServicio;
    await axios.post(baseURL,servicioSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error)
    })
  }

  const peticionPut=async()=>{
    servicioSeleccionado.lanzamiento=parseInt(servicioSeleccionado.lanzamiento);
    await axios.put(baseURL,servicioSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.id===servicioSeleccionado.id){
          gestor.idProfesionista=respuesta.idProfesionista;
          gestor.servicio=respuesta.servicio;
          gestor.descripcion=respuesta.descripcion;
          gestor.precio=respuesta.precio;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarServicio = (servicio, caso) => {
    setServicioSeleccionado(servicio);
    (caso === "Editar") ?
      abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  useEffect(() => {
    peticionGet();
  }, [])

  const handleChange=e=>{
    const{name,value} = e.target;
    setServicioSeleccionado({
      ...servicioSeleccionado,
      [name]: value
    });
    console.log(servicioSeleccionado);
  }
  
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const peticionDelete = async () => {
    await axios.delete(baseURL+ "/" + servicioSeleccionado.idServicio)
      .then(response => {
        setData(data.filter(servicio => servicio.id !== response.data));
        abrirCerrarModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }

  return (
    <div className="App">
      <br />
      <Button onClick={()=>abrirCerrarModalInsertar()} variant="outlined">Insertar Nuevo Servicio</Button>
      <br />
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>ID Servicio</th>
            <th>ID Profesionista</th>
            <th>Servicio</th>
            <th>Descripcion</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(servicio=>(
            <tr key={servicio.idServicio}>
              <td>{servicio.idServicio}</td>
              <td>{servicio.idProfesionista}</td>
              <td>{servicio.servicio}</td>
              <td>{servicio.descripcion}</td>
              <td>{servicio.precio}</td>
              <td>
                <button  onClick={() => seleccionarServicio(servicio, "Editar")}>Editar</button>{"  "}
                <button className='btn btn-danger' onClick={() => seleccionarServicio(servicio, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Servicio</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label htmlFor="idProfesionista">ID del Profesionista</label>
            <br />
            <input type="number" className='form-control' onChange={handleChange} name="idProfesionista"/>
            <br />
            <label htmlFor="servicio">Servicio</label>
            <br />
            <input type="text" className='form-control' onChange={handleChange} name="servicio"/>
            <br />
            <label htmlFor="descripcion">descripcion</label>
            <br />
            <input type="text" className='form-control' onChange={handleChange} name="descripcion"/>
            <br />
            <label htmlFor="Precio">Precio</label>
            <br />
            <input type="number" className='form-control' onChange={handleChange} name="precio"/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>peticionPost()}>Insertar</button>{"  "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>{"  "}
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Servicio Datos</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
            <br />
              <input type="text" className="form-control" readOnly value={servicioSeleccionado && servicioSeleccionado.idServicio}/>
              <label htmlFor="idProfesionista">ID del Profesionista</label>
              <br />
              <input type="number" className='form-control' onChange={handleChange} name="idProfesionista" 
              value={servicioSeleccionado && servicioSeleccionado.idProfesionista}/>

              <br />
              <label htmlFor="servicio">Servicio</label>
              <br />
              <input type="text" className='form-control' onChange={handleChange} name="servicio"
              value={servicioSeleccionado && servicioSeleccionado.servicio}/>
              <br />
              <label htmlFor="descripcion">descripcion</label>
              <br />
              <input type="text" className='form-control' onChange={handleChange} name="descripcion"
              value={servicioSeleccionado && servicioSeleccionado.descripcion}/>
              <br />
              <label htmlFor="precio">Precio</label>
              <br />
              <input type="number" className='form-control' onChange={handleChange} name="precio"
              value={servicioSeleccionado && servicioSeleccionado.precio}/>
              <br />
          </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar Dicho Servicio {servicioSeleccionado && servicioSeleccionado.descripcion}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
    </div> 
  )
}

export default App
