import React, { useState, useEffect, useRef } from 'react';
import patientsService from '../services/patientsService';
import authService from '../services/authService';
import odontogramaService from '../services/odontogramaService';
import archivosService from '../services/archivosService';
import NuevoArchivoModal from './NuevoArchivoModal';
import NotaEvolucionModal from './NotaEvolucionModal';
import AgregarEvolucionModal from './AgregarEvolucionModal';
import AgregarDatosFiscalesModal from './AgregarDatosFiscalesModal';
import AgregarFamiliarModal from './AgregarFamiliarModal';
import DienteSVG from './DienteSVG';
import PeriodontoTooth from './PeriodontoTooth';

const HistoriaClinica = ({ paciente, onClose }) => {
  const [activeSection, setActiveSection] = useState('filiacion');
  const [activeTab, setActiveTab] = useState('datos-personales');
  const [isEditing, setIsEditing] = useState(false);
  const [datosPersonales, setDatosPersonales] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    tipo_documento: 'DNI',
    fecha_nacimiento: '',
    numero_hc: '',
    sexo: 'Hombre',
    grupo: '',
    ultima_cita: '',
    telefono: '',
    email: '',
    nacionalidad: 'Perú',
    telefono_fijo: '',
    direccion: '',
    fuente_captacion: '',
    aseguradora: ''
  });
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [savingDatos, setSavingDatos] = useState(false);
  const [lookupOptions, setLookupOptions] = useState({
    fuentes_captacion: [],
    aseguradoras: [],
    lineas_negocio: []
  });
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [notasAlergias, setNotasAlergias] = useState(null);
  const [loadingNotasAlergias, setLoadingNotasAlergias] = useState(false);
  const [editingNotas, setEditingNotas] = useState(false);
  const [editingAlergias, setEditingAlergias] = useState(false);
  const [tempNotas, setTempNotas] = useState('');
  const [tempAlergias, setTempAlergias] = useState('');
  const [isNuevoArchivoOpen, setIsNuevoArchivoOpen] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [loadingArchivos, setLoadingArchivos] = useState(false);
  const [showFotoMenu, setShowFotoMenu] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const fotoInputRef = useRef(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [isNotaEvolucionOpen, setIsNotaEvolucionOpen] = useState(false);
  const [notasEvolucion, setNotasEvolucion] = useState([]);
  const [activeOdontogramaTab, setActiveOdontogramaTab] = useState('inicial');
  const [activeHistoriaTab, setActiveHistoriaTab] = useState('anam-odontologia');
  const [isAgregarEvolucionOpen, setIsAgregarEvolucionOpen] = useState(false);
  const [notasEvolucionBreve, setNotasEvolucionBreve] = useState([]);
  const [isAgregarDatosFiscalesOpen, setIsAgregarDatosFiscalesOpen] = useState(false);
  const [isAgregarFamiliarOpen, setIsAgregarFamiliarOpen] = useState(false);
  const [datosFiscales, setDatosFiscales] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const [citas, setCitas] = useState([]);
  const [activePeriodontogramaTab, setActivePeriodontogramaTab] = useState('periodontogramas');
  const [selectedDoctor, setSelectedDoctor] = useState('Eduardo Carmin');
  const [periodontogramaData, setPeriodontogramaData] = useState({
    movilidad: {},
    sangrado: {},
    placa: {},
    margenGingival: {},
    profundidadSondaje: {}
  });

  // Estados para el odontograma
  const [odontogramaData, setOdontogramaData] = useState({
    id_odontograma: null,
    dientes: {},
    plan_tratamiento: [],
    observaciones: '',
    especificaciones: '',
    diagnostico: '',
    plan_trabajo: ''
  });
  const [loadingOdontograma, setLoadingOdontograma] = useState(false);
  const [savingOdontograma, setSavingOdontograma] = useState(false);
  const [codigosOdontologicos, setCodigosOdontologicos] = useState([]);

  const sections = [
    { id: 'filiacion', label: 'Filiación', icon: '👤' },
    { id: 'historia-clinica', label: 'Historia clínica', icon: '📄' },
    { id: 'odontograma', label: 'Odontograma', icon: '🦷' },
    { id: 'periodontograma', label: 'Periodontograma', icon: '🦷' },
    { id: 'ortodoncia', label: 'Ortodoncia', icon: '🦷' },
    { id: 'estado-cuenta', label: 'Estado de cuenta', icon: '💰' },
    { id: 'prescripciones', label: 'Prescripciones', icon: '📋' },
    { id: 'archivos', label: 'Archivos', icon: '📁' }
  ];

  // Cargar datos del paciente al abrir el componente
  useEffect(() => {
    if (paciente?.id) {
      loadDatosPersonales();
      loadLookupOptions();
      loadNotasAlergias();
      loadArchivos();
      loadDatosFiscales();
      loadFamiliares();
      loadCitas();
      setFotoPerfil(paciente.foto_perfil_url);
    }
  }, [paciente?.id]);

  // Cargar odontograma cuando se cambia el tab activo
  useEffect(() => {
    if (activeSection === 'odontograma' && paciente?.id) {
      loadOdontograma();
      loadCodigosOdontologicos();
    }
  }, [activeSection, activeOdontogramaTab, paciente?.id]);

  const loadDatosPersonales = async () => {
    try {
      setLoadingDatos(true);
      patientsService.setAuthService(authService);
      const result = await patientsService.getFiliacion(paciente.id);
      if (result.success) {
        const filiacion = result.filiacion;
        setDatosPersonales({
          nombres: filiacion.nombres || '',
          apellidos: filiacion.apellidos || '',
          documento: filiacion.dni || '',
          tipo_documento: 'DNI',
          fecha_nacimiento: filiacion.fecha_nacimiento ? filiacion.fecha_nacimiento.split('T')[0] : '',
          numero_hc: filiacion.id || '',
          sexo: filiacion.genero === 'M' ? 'Hombre' : filiacion.genero === 'F' ? 'Mujer' : 'Otro',
          grupo: filiacion.aseguradora || '',
          ultima_cita: filiacion.ultima_cita ? filiacion.ultima_cita.split('T')[0] : '',
          telefono: filiacion.telefono || '',
          email: filiacion.email || '',
          nacionalidad: 'Perú',
          telefono_fijo: '',
          direccion: filiacion.direccion || '',
          fuente_captacion: filiacion.fuente_captacion || '',
          aseguradora: filiacion.aseguradora || ''
        });
      } else {
        console.error('Error al cargar datos personales:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar datos personales:', e);
    } finally {
      setLoadingDatos(false);
    }
  };

  const loadLookupOptions = async () => {
    try {
      setLoadingOptions(true);
      patientsService.setAuthService(authService);
      const result = await patientsService.getLookupOptions();
      if (result.success) {
        setLookupOptions({
          fuentes_captacion: result.fuentes_captacion || [],
          aseguradoras: result.aseguradoras || [],
          lineas_negocio: result.lineas_negocio || []
        });
      } else {
        console.error('Error al cargar opciones de combos:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar opciones:', e);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadNotasAlergias = async () => {
    try {
      setLoadingNotasAlergias(true);
      patientsService.setAuthService(authService);
      const result = await patientsService.getNotasAlergias(paciente.id);
      if (result.success) {
        setNotasAlergias(result.notas_alergias);
        setTempNotas(result.notas_alergias.notas || '');
        setTempAlergias(result.notas_alergias.alergias || '');
      } else {
        console.error('Error al cargar notas y alergias:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar notas y alergias:', e);
    } finally {
      setLoadingNotasAlergias(false);
    }
  };

  const loadArchivos = async () => {
    try {
      setLoadingArchivos(true);
      archivosService.setAuthService?.(authService);
      const result = await archivosService.listarArchivos(paciente.id);
      if (result.success) {
        const archivosFormateados = result.archivos.map(archivo => ({
          id: archivo.id,
          nombre: archivo.nombre,
          categoria: archivo.categoria,
          descripcion: archivo.descripcion,
          notas: archivo.notas,
          tipo: archivo.tipo,
          tamano: archivo.tamano,
          tamano_formateado: archivo.tamano_formateado,
          url: archivo.url,
          fecha: archivo.fecha,
          compartido: archivo.compartido,
          doctor: archivo.doctor,
          subido_por: archivo.subido_por
        }));
        setArchivos(archivosFormateados);
      } else {
        console.error('Error al cargar archivos:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar archivos:', e);
    } finally {
      setLoadingArchivos(false);
    }
  };

  // ===== FUNCIONES PARA DATOS FISCALES =====
  const loadDatosFiscales = async () => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.getDatosFiscales(paciente.id);
      if (result.success) {
        setDatosFiscales(result.datos_fiscales);
      } else {
        console.error('Error al cargar datos fiscales:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar datos fiscales:', e);
    }
  };

  const handleSaveDatoFiscal = async (datoFiscal) => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.createDatoFiscal({
        id_paciente: paciente.id,
        razon_social: datoFiscal.razonSocial,
        numero_fiscal: datoFiscal.numeroFiscal,
        direccion: datoFiscal.direccion,
        departamento: datoFiscal.departamento,
        provincia: datoFiscal.provincia || '',
        distrito: datoFiscal.distrito || ''
      });
      if (result.success) {
        await loadDatosFiscales();
        setIsAgregarDatosFiscalesOpen(false);
      } else {
        alert(result.error || 'Error al crear dato fiscal');
      }
    } catch (e) {
      alert('Error de conexión: ' + e.message);
    }
  };

  const handleEditDatoFiscal = async (datoFiscal) => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.updateDatoFiscal({
        id: datoFiscal.id,
        razon_social: datoFiscal.razonSocial,
        numero_fiscal: datoFiscal.numeroFiscal,
        direccion: datoFiscal.direccion,
        departamento: datoFiscal.departamento,
        provincia: datoFiscal.provincia || '',
        distrito: datoFiscal.distrito || ''
      });
      if (result.success) {
        await loadDatosFiscales();
      } else {
        alert(result.error || 'Error al actualizar dato fiscal');
      }
    } catch (e) {
      alert('Error de conexión: ' + e.message);
    }
  };

  const handleDeleteDatoFiscal = async (datoFiscalId) => {
    if (window.confirm('¿Está seguro de eliminar este dato fiscal?')) {
      try {
        patientsService.setAuthService?.(authService);
        const result = await patientsService.deleteDatoFiscal(datoFiscalId);
        if (result.success) {
          await loadDatosFiscales();
        } else {
          alert(result.error || 'Error al eliminar dato fiscal');
        }
      } catch (e) {
        alert('Error de conexión: ' + e.message);
      }
    }
  };

  // ===== FUNCIONES PARA FAMILIARES =====
  const loadFamiliares = async () => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.getFamiliares(paciente.id);
      if (result.success) {
        setFamiliares(result.familiares);
      } else {
        console.error('Error al cargar familiares:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar familiares:', e);
    }
  };

  const handleSaveFamiliar = async (familiar) => {
    try {
      // Solo procesar si es nuevo familiar
      if (familiar.opcion !== 'nuevo') {
        alert('Por ahora solo se puede crear un nuevo familiar');
        return;
      }
      
      patientsService.setAuthService?.(authService);
      const result = await patientsService.createFamiliar({
        id_paciente: paciente.id,
        nombre_completo: familiar.nombre,
        documento: familiar.documento || '',
        telefono: familiar.telefono || '',
        email: familiar.email || '',
        es_apoderado: familiar.apoderado || false,
        parentesco: familiar.parentesco || ''
      });
      if (result.success) {
        await loadFamiliares();
        setIsAgregarFamiliarOpen(false);
      } else {
        alert(result.error || 'Error al crear familiar');
      }
    } catch (e) {
      alert('Error de conexión: ' + e.message);
    }
  };

  const handleEditFamiliar = async (familiar) => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.updateFamiliar({
        id: familiar.id,
        nombre_completo: familiar.nombreCompleto,
        documento: familiar.documento,
        telefono: familiar.telefono,
        email: familiar.email,
        es_apoderado: familiar.esApoderado,
        parentesco: familiar.parentesco || ''
      });
      if (result.success) {
        await loadFamiliares();
      } else {
        alert(result.error || 'Error al actualizar familiar');
      }
    } catch (e) {
      alert('Error de conexión: ' + e.message);
    }
  };

  const handleDeleteFamiliar = async (familiarId) => {
    if (window.confirm('¿Está seguro de eliminar este familiar?')) {
      try {
        patientsService.setAuthService?.(authService);
        const result = await patientsService.deleteFamiliar(familiarId);
        if (result.success) {
          await loadFamiliares();
        } else {
          alert(result.error || 'Error al eliminar familiar');
        }
      } catch (e) {
        alert('Error de conexión: ' + e.message);
      }
    }
  };

  // ===== FUNCIONES PARA CITAS =====
  const loadCitas = async () => {
    try {
      patientsService.setAuthService?.(authService);
      const result = await patientsService.getCitas(paciente.id);
      if (result.success) {
        setCitas(result.citas);
      } else {
        console.error('Error al cargar citas:', result.error);
      }
    } catch (e) {
      console.error('Error de conexión al cargar citas:', e);
    }
  };

  const handleDatosPersonalesChange = (field, value) => {
    setDatosPersonales(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDatosPersonales = async () => {
    try {
      setSavingDatos(true);
      const updateData = {
        id: paciente.id,
        telefono: datosPersonales.telefono,
        email: datosPersonales.email,
        direccion: datosPersonales.direccion,
        fuente_captacion: datosPersonales.fuente_captacion,
        aseguradora: datosPersonales.aseguradora,
        linea_negocio: datosPersonales.linea_negocio
      };
      
      const result = await patientsService.updateFiliacion(updateData);
      if (result.success) {
        setIsEditing(false);
        // Recargar datos actualizados
        await loadDatosPersonales();
      } else {
        alert(result.error || 'Error al actualizar datos personales');
      }
    } catch (e) {
      alert('Error de conexión con el servidor');
    } finally {
      setSavingDatos(false);
    }
  };

  const handleEditNotas = () => {
    setEditingNotas(true);
    setTempNotas(notasAlergias?.notas || '');
  };

  const handleCancelEditNotas = () => {
    setEditingNotas(false);
    setTempNotas(notasAlergias?.notas || '');
  };

  const handleSaveNotas = async () => {
    try {
      setLoadingNotasAlergias(true);
      const result = await patientsService.updateNotasAlergias(paciente.id, 'notas', tempNotas);
      if (result.success) {
        setNotasAlergias(prev => ({ ...prev, notas: tempNotas }));
        setEditingNotas(false);
      } else {
        alert(result.error || 'Error al actualizar notas');
      }
    } catch (e) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoadingNotasAlergias(false);
    }
  };

  const handleEditAlergias = () => {
    setEditingAlergias(true);
    setTempAlergias(notasAlergias?.alergias || '');
  };

  const handleCancelEditAlergias = () => {
    setEditingAlergias(false);
    setTempAlergias(notasAlergias?.alergias || '');
  };

  const handleSaveAlergias = async () => {
    try {
      setLoadingNotasAlergias(true);
      const result = await patientsService.updateNotasAlergias(paciente.id, 'alergias', tempAlergias);
      if (result.success) {
        setNotasAlergias(prev => ({ ...prev, alergias: tempAlergias }));
        setEditingAlergias(false);
      } else {
        alert(result.error || 'Error al actualizar alergias');
      }
    } catch (e) {
      alert('Error de conexión con el servidor');
    } finally {
      setLoadingNotasAlergias(false);
    }
  };

  const handleOpenHistoria = () => {
    setActiveSection('historia-clinica');
  };

  const handleSaveArchivo = async (archivoData) => {
    try {
      // Subir archivo al servidor
      const result = await archivosService.subirArchivo(archivoData.archivo, {
        id_paciente: paciente.id,
        id_doctor: archivoData.doctor || null,
        categoria: archivoData.categoria,
        descripcion: archivoData.descripcion,
        notas: archivoData.notas,
        compartir_con_paciente: archivoData.compartirConPaciente
      });

      if (result.success) {
        // Actualizar lista de archivos
        const nuevoArchivo = {
          id: result.id_archivo,
          nombre: archivoData.archivo.name,
          categoria: archivoData.categoria,
          descripcion: archivoData.descripcion,
          notas: archivoData.notas,
          tipo: archivoData.archivo.name.split('.').pop(),
          tamano: result.tamano_bytes,
          url: result.url_publica,
          fecha: new Date().toISOString(),
          compartido: archivoData.compartirConPaciente
        };
        setArchivos(prev => [...prev, nuevoArchivo]);
        
        alert(`Archivo "${archivoData.archivo.name}" subido exitosamente`);
      } else {
        throw new Error(result.error || 'Error al subir archivo');
      }
    } catch (error) {
      console.error('Error al guardar archivo:', error);
      alert(`Error al subir archivo: ${error.message}`);
      throw error; // Re-lanzar para que el modal maneje el error
    }
  };

  const handleDescargarArchivo = async (archivo) => {
    try {
      await archivosService.descargarArchivo(archivo.id, archivo.nombre);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert(`Error al descargar archivo: ${error.message}`);
    }
  };

  const handleEliminarArchivo = async (archivoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const result = await archivosService.eliminarArchivo(archivoId);
      if (result.success) {
        // Remover de la lista
        setArchivos(prev => prev.filter(a => a.id !== archivoId));
        alert('Archivo eliminado exitosamente');
      } else {
        throw new Error(result.error || 'Error al eliminar archivo');
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert(`Error al eliminar archivo: ${error.message}`);
    }
  };

  const handleCambiarFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setUploadingFoto(true);
    setShowFotoMenu(false);

    try {
      // Subir foto a Cloud Storage
      const uploadResult = await archivosService.subirArchivo(file, {
        id_paciente: paciente.id,
        categoria: 'Foto de Perfil',
        descripcion: `Foto de perfil de ${paciente.nombre} ${paciente.apellido}`,
        compartir_con_paciente: false
      });

      if (uploadResult.success) {
        // Actualizar URL en base de datos
        const updateResult = await patientsService.updateFotoPerfil(paciente.id, uploadResult.url_publica);
        
        if (updateResult.success) {
          setFotoPerfil(uploadResult.url_publica);
          alert('Foto de perfil actualizada exitosamente');
        } else {
          throw new Error(updateResult.error);
        }
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      console.error('Error al cambiar foto:', error);
      alert(`Error al cambiar foto: ${error.message}`);
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleSaveNotaEvolucion = (notaData) => {
    const nuevaNota = {
      id: Date.now(),
      ...notaData,
      fecha: new Date().toISOString(),
      paciente: paciente?.nombre + ' ' + paciente?.apellido
    };
    setNotasEvolucion(prev => [...prev, nuevaNota]);
  };

  const handleSaveEvolucionBreve = (evolucionData) => {
    const nuevaEvolucion = {
      id: Date.now(),
      ...evolucionData,
      fecha: new Date().toISOString()
    };
    setNotasEvolucionBreve(prev => [nuevaEvolucion, ...prev]);
  };

  const handleSaveDatosFiscales = (datosData) => {
    const nuevosDatos = {
      id: Date.now(),
      ...datosData
    };
    setDatosFiscales(prev => [nuevosDatos, ...prev]);
  };

  const handleSaveFamiliar = (familiarData) => {
    const nuevoFamiliar = {
      id: Date.now(),
      ...familiarData
    };
    setFamiliares(prev => [nuevoFamiliar, ...prev]);
  };

  // ===== FUNCIONES DE ODONTOGRAMA =====
  
  const loadOdontograma = async () => {
    try {
      setLoadingOdontograma(true);
      const result = await odontogramaService.obtenerOdontograma(
        paciente.id,
        activeOdontogramaTab
      );

      if (result.success && result.existe) {
        // Convertir array de dientes a objeto con número como clave
        const dientesMap = {};
        result.dientes.forEach(diente => {
          dientesMap[diente.numero] = diente;
        });

        setOdontogramaData({
          id_odontograma: result.odontograma.id,
          dientes: dientesMap,
          plan_tratamiento: result.plan_tratamiento || [],
          observaciones: result.odontograma.observaciones || '',
          especificaciones: '',
          diagnostico: '',
          plan_trabajo: ''
        });
      } else {
        // Inicializar odontograma vacío
        setOdontogramaData({
          id_odontograma: null,
          dientes: {},
          plan_tratamiento: [],
          observaciones: '',
          especificaciones: '',
          diagnostico: '',
          plan_trabajo: ''
        });
      }
    } catch (error) {
      console.error('Error al cargar odontograma:', error);
      alert('Error al cargar el odontograma');
    } finally {
      setLoadingOdontograma(false);
    }
  };

  const loadCodigosOdontologicos = async () => {
    try {
      const result = await odontogramaService.obtenerCodigos();
      if (result.success) {
        setCodigosOdontologicos(result.codigos || []);
      }
    } catch (error) {
      console.error('Error al cargar códigos odontológicos:', error);
    }
  };

  const handleDienteUpdate = async (dienteInfo) => {
    try {
      // Actualizar localmente
      setOdontogramaData(prev => ({
        ...prev,
        dientes: {
          ...prev.dientes,
          [dienteInfo.numero]: dienteInfo
        }
      }));

      // Guardar en la API (actualización individual del diente)
      await odontogramaService.actualizarDiente({
        id_paciente: paciente.id,
        tipo: activeOdontogramaTab,
        numero_diente: dienteInfo.numero,
        estado_general: dienteInfo.estado_general || 'sano',
        superficies: dienteInfo.superficies,
        tiene_caries: dienteInfo.tiene_caries,
        tiene_obturacion: dienteInfo.tiene_obturacion,
        tiene_corona: dienteInfo.tiene_corona,
        necesita_extraccion: dienteInfo.necesita_extraccion,
        notas: dienteInfo.notas
      });
    } catch (error) {
      console.error('Error al actualizar diente:', error);
      // Recargar odontograma en caso de error
      loadOdontograma();
    }
  };

  const handleGuardarOdontograma = async () => {
    try {
      setSavingOdontograma(true);

      // Convertir objeto de dientes a array
      const dientesArray = Object.keys(odontogramaData.dientes).map(numero => ({
        numero: parseInt(numero),
        ...odontogramaData.dientes[numero]
      }));

      await odontogramaService.guardarOdontograma({
        id_paciente: paciente.id,
        tipo: activeOdontogramaTab,
        observaciones: odontogramaData.observaciones,
        dientes: dientesArray
      });

      alert('Odontograma guardado exitosamente');
      loadOdontograma(); // Recargar para obtener el ID actualizado
    } catch (error) {
      console.error('Error al guardar odontograma:', error);
      alert('Error al guardar el odontograma');
    } finally {
      setSavingOdontograma(false);
    }
  };

  const handleAgregarTratamiento = async (tratamiento) => {
    try {
      if (!odontogramaData.id_odontograma) {
        alert('Primero debe guardar el odontograma');
        return;
      }

      await odontogramaService.agregarTratamientoPlan({
        id_odontograma: odontogramaData.id_odontograma,
        ...tratamiento
      });

      loadOdontograma(); // Recargar para mostrar el nuevo tratamiento
      alert('Tratamiento agregado al plan exitosamente');
    } catch (error) {
      console.error('Error al agregar tratamiento:', error);
      alert('Error al agregar tratamiento al plan');
    }
  };

  const handleEliminarTratamiento = async (idPlan) => {
    try {
      if (window.confirm('¿Está seguro de eliminar este tratamiento?')) {
        await odontogramaService.eliminarTratamientoPlan(idPlan);
        loadOdontograma();
        alert('Tratamiento eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar tratamiento:', error);
      alert('Error al eliminar tratamiento');
    }
  };

  const handleActualizarEstadoTratamiento = async (idPlan, nuevoEstado) => {
    try {
      await odontogramaService.actualizarTratamientoPlan({
        id_plan: idPlan,
        estado: nuevoEstado
      });
      loadOdontograma();
    } catch (error) {
      console.error('Error al actualizar estado del tratamiento:', error);
      alert('Error al actualizar estado del tratamiento');
    }
  };

  // ===== FIN FUNCIONES DE ODONTOGRAMA =====

  const getTipoDiente = (numero) => {
    const ultimoDigito = numero % 10;
    if (ultimoDigito === 1 || ultimoDigito === 2) return 'incisor';
    if (ultimoDigito === 3) return 'canino';
    if (ultimoDigito === 4 || ultimoDigito === 5) return 'premolar';
    return 'molar';
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 top-24 sm:top-28 z-[200] bg-gray-50">

      <div className="flex h-full">
        {/* Sidebar izquierdo - Perfil del paciente */}
        <div className="w-80 bg-gradient-to-b from-blue-50 to-white border-r hidden lg:block">
          {/* Tarjeta del paciente */}
          <div className="p-6 border-b">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div 
                  onClick={() => setShowFotoMenu(!showFotoMenu)}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl overflow-hidden border-4 border-blue-400 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {uploadingFoto ? (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : fotoPerfil ? (
                    <img 
                      src={fotoPerfil} 
                      alt={`${paciente?.nombre} ${paciente?.apellido}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                      {paciente?.avatar || '👤'}
                    </div>
                  )}
                </div>
                
                {/* Menú de opciones */}
                {showFotoMenu && !uploadingFoto && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <button
                      onClick={() => {
                        fotoInputRef.current?.click();
                        setShowFotoMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      <span>{fotoPerfil ? 'Cambiar foto' : 'Adjuntar foto'}</span>
                    </button>
                  </div>
                )}
                
                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCambiarFoto}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{paciente?.nombre} {paciente?.apellido}</h2>
                <p className="text-gray-600">22 años</p>
                <p className="text-sm text-gray-500">Creado el 22 sep 2025</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navegación de secciones */}
          <div className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Navegación móvil */}
          <div className="lg:hidden bg-white border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{paciente?.nombre} {paciente?.apellido}</h2>
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => setShowFotoMenu(!showFotoMenu)}
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-400 cursor-pointer hover:opacity-90 transition-opacity relative"
                >
                  {fotoPerfil ? (
                    <img 
                      src={fotoPerfil} 
                      alt={`${paciente?.nombre} ${paciente?.apellido}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg">
                      {paciente?.avatar || '👤'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.icon} {section.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Barra superior con etiquetas y notas */}
          <div className="bg-white border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Etiquetas</span>
                  <div className="flex space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tarjeta de Etiquetas */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">Etiquetas</span>
                  </div>
                  <button className="text-blue-600 text-sm flex items-center space-x-1 hover:text-blue-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Agregar</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span>VIP</span>
                    <button className="ml-1 text-yellow-600 hover:text-yellow-800">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Notas */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span className="text-sm font-semibold text-yellow-800">Notas</span>
                  </div>
                  {!editingNotas && (
                    <button 
                      onClick={handleEditNotas}
                      className="text-yellow-600 text-sm flex items-center space-x-1 hover:text-yellow-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>Agregar</span>
                    </button>
                  )}
                </div>
                
                {editingNotas ? (
                  <div className="space-y-3">
                    <textarea
                      value={tempNotas}
                      onChange={(e) => setTempNotas(e.target.value)}
                      className="w-full p-3 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                      rows={4}
                      placeholder="Escribe aquí las notas del paciente..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNotas}
                        disabled={loadingNotasAlergias}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {loadingNotasAlergias ? (
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancelEditNotas}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 min-h-[80px]">
                    {notasAlergias?.notas ? (
                      <p className="text-sm text-yellow-800 whitespace-pre-wrap">{notasAlergias.notas}</p>
                    ) : (
                      <p className="text-sm text-yellow-600 italic">No hay notas registradas</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tarjeta de Alergias */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-red-800">Alergias</span>
                  </div>
                  {!editingAlergias && (
                    <button 
                      onClick={handleEditAlergias}
                      className="text-red-600 text-sm flex items-center space-x-1 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>Agregar</span>
                    </button>
                  )}
                </div>
                
                {editingAlergias ? (
                  <div className="space-y-3">
                    <textarea
                      value={tempAlergias}
                      onChange={(e) => setTempAlergias(e.target.value)}
                      className="w-full p-3 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      rows={4}
                      placeholder="Escribe aquí las alergias del paciente..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveAlergias}
                        disabled={loadingNotasAlergias}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-1"
                      >
                        {loadingNotasAlergias ? (
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancelEditAlergias}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-300 rounded-md p-3 min-h-[80px]">
                    {notasAlergias?.alergias ? (
                      <p className="text-sm text-red-800 whitespace-pre-wrap">{notasAlergias.alergias}</p>
                    ) : (
                      <p className="text-sm text-red-600 italic">No hay alergias registradas</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button className="text-blue-600 text-sm flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Ver 'Barra de progreso'</span>
              </button>
            </div>
          </div>

          {/* Tabs de datos - Solo para Filiación */}
          {activeSection === 'filiacion' && (
            <div className="bg-white border-b">
              <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('datos-personales')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'datos-personales'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Datos Personales
                </button>
                <button
                  onClick={() => setActiveTab('datos-fiscales')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'datos-fiscales'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Datos Fiscales
                </button>
              </div>
            </div>
          )}

          {/* Formulario de datos personales */}
          {activeSection === 'filiacion' && activeTab === 'datos-personales' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span>Editar campos</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDatosPersonales}
                      disabled={savingDatos}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {savingDatos ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>Guardar</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombres*</label>
                    <input
                      type="text"
                      value={datosPersonales.nombres}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <div className="flex space-x-2">
                      <select 
                        value={datosPersonales.tipo_documento}
                        disabled={true}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      >
                        <option value="DNI">DNI</option>
                      </select>
                      <input
                        type="text"
                        value={datosPersonales.documento}
                        disabled={true}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">F. nacimiento</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={datosPersonales.fecha_nacimiento}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                      <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° HC</label>
                    <input
                      type="text"
                      value={datosPersonales.numero_hc}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                    <select 
                      value={datosPersonales.sexo}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <select 
                      value={datosPersonales.grupo}
                      disabled={!isEditing || loadingOptions}
                      onChange={(e) => handleDatosPersonalesChange('grupo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Seleccionar</option>
                      {loadingOptions ? (
                        <option value="" disabled>Cargando...</option>
                      ) : (
                        lookupOptions.aseguradoras.map((aseguradora) => (
                          <option key={aseguradora.id} value={aseguradora.nombre}>
                            {aseguradora.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Última cita</label>
                    <input
                      type="date"
                      value={datosPersonales.ultima_cita}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos*</label>
                    <input
                      type="text"
                      value={datosPersonales.apellidos}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                        <span className="text-sm">🇵🇪</span>
                        <span className="text-sm">+51</span>
                      </div>
                      <input
                        type="text"
                        value={datosPersonales.telefono}
                        disabled={!isEditing}
                        onChange={(e) => handleDatosPersonalesChange('telefono', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={datosPersonales.email}
                      disabled={!isEditing}
                      onChange={(e) => handleDatosPersonalesChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                    <select 
                      value={datosPersonales.nacionalidad}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="Perú">Perú</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tel. Fijo</label>
                    <input
                      type="text"
                      value={datosPersonales.telefono_fijo}
                      disabled={!isEditing}
                      onChange={(e) => handleDatosPersonalesChange('telefono_fijo', e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      value={datosPersonales.direccion}
                      disabled={!isEditing}
                      onChange={(e) => handleDatosPersonalesChange('direccion', e.target.value)}
                      placeholder="Ingrese la dirección"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuente captación</label>
                    <select 
                      value={datosPersonales.fuente_captacion}
                      disabled={!isEditing || loadingOptions}
                      onChange={(e) => handleDatosPersonalesChange('fuente_captacion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Seleccionar</option>
                      {loadingOptions ? (
                        <option value="" disabled>Cargando...</option>
                      ) : (
                        lookupOptions.fuentes_captacion.map((fuente) => (
                          <option key={fuente.id} value={fuente.nombre}>
                            {fuente.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aseguradora</label>
                    <select 
                      value={datosPersonales.aseguradora}
                      disabled={!isEditing || loadingOptions}
                      onChange={(e) => handleDatosPersonalesChange('aseguradora', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Seleccionar</option>
                      {loadingOptions ? (
                        <option value="" disabled>Cargando...</option>
                      ) : (
                        lookupOptions.aseguradoras.map((aseguradora) => (
                          <option key={aseguradora.id} value={aseguradora.nombre}>
                            {aseguradora.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Línea de negocio</label>
                    <select 
                      value={datosPersonales.linea_negocio || ''}
                      disabled={!isEditing || loadingOptions}
                      onChange={(e) => handleDatosPersonalesChange('linea_negocio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Seleccionar</option>
                      {loadingOptions ? (
                        <option value="" disabled>Cargando...</option>
                      ) : (
                        lookupOptions.lineas_negocio.map((linea) => (
                          <option key={linea.id} value={linea.nombre}>
                            {linea.nombre}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adicional</label>
                    <input
                      type="text"
                      placeholder=""
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Datos fiscales */}
          {activeSection === 'filiacion' && activeTab === 'datos-fiscales' && (
            <div className="flex-1 bg-white overflow-y-auto">
              {/* Datos Fiscales */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos Fiscales</h2>
                
                {/* Header de la tabla */}
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                    <div>Razón Social</div>
                    <div>Número Fiscal</div>
                    <div>Dirección</div>
                    <div>Departamento</div>
                    <div className="text-center">Acciones</div>
                  </div>
                </div>
                
                {/* Botón Nuevo Registro */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => setIsAgregarDatosFiscalesOpen(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Nuevo Registro
                  </button>
                </div>
                
                {/* Contenido de la tabla */}
                {datosFiscales.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-b-lg p-8 text-center">
                    <p className="text-gray-500">No hay datos fiscales registrados</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-b-lg">
                    {datosFiscales.map((dato) => (
                      <div key={dato.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-100 text-sm items-center">
                        <div>{dato.razonSocial}</div>
                        <div>{dato.numeroFiscal}</div>
                        <div>{dato.direccion}</div>
                        <div>{dato.departamento}</div>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDeleteDatoFiscal(dato.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Familiar */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Familiar</h2>
                
                {/* Header de la tabla */}
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                    <div>Nombre</div>
                    <div>N° doc</div>
                    <div>Teléfono</div>
                    <div>Email</div>
                    <div>Apoderado</div>
                    <div className="text-center">Acciones</div>
                  </div>
                </div>
                
                {/* Botón Nuevo Registro */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <button
                    onClick={() => setIsAgregarFamiliarOpen(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Nuevo Registro
                  </button>
                </div>
                
                {/* Contenido de la tabla */}
                {familiares.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-b-lg p-8 text-center">
                    <p className="text-gray-500">No hay familiares registrados</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-b-lg">
                    {familiares.map((familiar) => (
                      <div key={familiar.id} className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-100 text-sm items-center">
                        <div>{familiar.nombreCompleto}</div>
                        <div>{familiar.documento}</div>
                        <div>{familiar.telefono}</div>
                        <div>{familiar.email}</div>
                        <div>{familiar.esApoderado ? 'Sí' : 'No'}</div>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDeleteFamiliar(familiar.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Citas */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas</h2>
                
                {/* Header de la tabla */}
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                  <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                    <div>Fecha</div>
                    <div>Doctor</div>
                    <div>Motivo</div>
                    <div>Estado</div>
                    <div>Comentario</div>
                  </div>
                </div>
                
                {/* Contenido */}
                {citas.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-b-lg p-12 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500">No hay citas registradas</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-b-lg">
                    {citas.map((cita) => (
                      <div key={cita.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-100 text-sm">
                        <div>{cita.fecha_hora ? new Date(cita.fecha_hora).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '--'}</div>
                        <div>{cita.doctor || '--'}</div>
                        <div>{cita.motivo || '--'}</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            cita.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                            cita.estado === 'Programada' ? 'bg-blue-100 text-blue-800' :
                            cita.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cita.estado}
                          </span>
                        </div>
                        <div className="truncate">{cita.comentario || '--'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Paginación */}
              <div className="p-6 border-t flex justify-end">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección de Archivos */}
          {activeSection === 'archivos' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              {/* Header de archivos */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-teal-600">Archivos digitales</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>Espacio usado: 0.0 MB de 20 GB</span>
                  </div>
                  <button
                    onClick={() => setIsNuevoArchivoOpen(true)}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <span>Subir archivo</span>
                  </button>
                </div>
              </div>

              {/* Área de archivos */}
              <div className="border border-blue-200 rounded-lg p-8 min-h-96">
                {archivos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No se encontró ningún archivo médico</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archivos.map((archivo) => (
                      <div key={archivo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate" title={archivo.nombre}>
                              {archivo.nombre}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                                {archivo.categoria}
                              </span>
                              {archivo.tamano_formateado && (
                                <span className="text-xs text-gray-500">
                                  {archivo.tamano_formateado}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {archivo.subido_por || archivo.doctor || 'Sin información'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(archivo.fecha).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            {archivo.descripcion && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2" title={archivo.descripcion}>
                                {archivo.descripcion}
                              </p>
                            )}
                            {archivo.compartido && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                ✓ Compartido con paciente
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="mt-4 flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleDescargarArchivo(archivo)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="Descargar archivo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Descargar</span>
                          </button>
                          <button
                            onClick={() => handleEliminarArchivo(archivo.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            title="Eliminar archivo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sección de Odontograma */}
          {/* Sección Historia Clínica */}
          {activeSection === 'historia-clinica' && (
            <div className="flex-1 bg-white overflow-y-auto">
              {/* Barra de navegación con pestañas */}
              <div className="bg-white border-b">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex space-x-6 overflow-x-auto">
                    <button 
                      onClick={() => setActiveHistoriaTab('anam-odontologia')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'anam-odontologia'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Anam. Odontología
                    </button>
                    <button 
                      onClick={() => setActiveHistoriaTab('nota-evolucion-breve')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'nota-evolucion-breve'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Nota evolución breve
                    </button>
                    <button 
                      onClick={() => setActiveHistoriaTab('anam-odontopediatria')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'anam-odontopediatria'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Anam. Odontopediatría
                    </button>
                    <button 
                      onClick={() => setActiveHistoriaTab('endodoncia')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'endodoncia'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Endodoncia
                    </button>
                    <button 
                      onClick={() => setActiveHistoriaTab('signos-vitales')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'signos-vitales'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Signos Vitales
                    </button>
                    <button 
                      onClick={() => setActiveHistoriaTab('consentimientos')}
                      className={`pb-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeHistoriaTab === 'consentimientos'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Consentimientos
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Plantillas</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del doctor */}
              <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Doctor:</span>
                  <span className="text-sm font-medium text-gray-900">Eduardo Carmin</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>

              {/* Contenido del formulario - Anam. Odontología */}
              {activeHistoriaTab === 'anam-odontologia' && (
                <div className="p-6 space-y-6">
                {/* Sección - Motivo de consulta */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-blue-600 font-medium">Sección</h3>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                    </svg>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Motivo de consulta</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* ENFERMEDAD ACTUAL */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-blue-600 font-bold">ENFERMEDAD ACTUAL</h3>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                    </svg>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Tiempo de enfermedad</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Signos y síntomas principales</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Relato cronológico</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Funciones biológicas</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* ANTECEDENTES */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-blue-600 font-bold">ANTECEDENTES</h3>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                    </svg>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Antecedentes familiares</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Antecedentes personales</label>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder=""
                      />
                    </div>
                    
                    {/* ¿Tiene o ha tenido? */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">¿Tiene o ha tenido?</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          'Presión alta', 'Presión baja', 'Hepatitis', 'Gastritis',
                          'Úlceras', 'VIH', 'Diabetes', 'Asma', '¿Fuma?'
                        ].map((condicion) => (
                          <div key={condicion} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700 w-24">{condicion}</span>
                            <div className="flex space-x-2">
                              <label className="flex items-center space-x-1">
                                <input type="radio" name={condicion} value="no" className="text-blue-600" />
                                <span className="text-sm text-gray-600">No</span>
                              </label>
                              <label className="flex items-center space-x-1">
                                <input type="radio" name={condicion} value="si" className="text-blue-600" />
                                <span className="text-sm text-gray-600">Si</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">Comentario adicional</label>
                      <textarea
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                        placeholder=""
                      />
                    </div>

                    {/* Preguntas adicionales */}
                    {[
                      'Enfermedades sanguíneas', 'Problemas cardíacos', '¿Padece de alguna otra enfermedad?',
                      '¿Cuántas veces al día se cepilla los dientes?', '¿Le sangra sus encías?',
                      '¿Ha tenido hemorragias anormales después de una extracción?', '¿Hace rechinar o aprieta los dientes?',
                      'Otras molestias en la boca', 'Alergias', '¿Ha tenido alguna operación grande en los últimos años?',
                      '¿Toma alguna medicación de manera permanente?'
                    ].map((pregunta) => (
                      <div key={pregunta} className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-48">{pregunta}</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name={pregunta} value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name={pregunta} value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Si</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXAMEN CLINICO */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-blue-600 font-bold">EXAMEN CLINICO</h3>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                    </svg>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Columna izquierda */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Signos vitales:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700 w-20">PA</span>
                              <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded border">mmgh</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700 w-20">Temperatura</span>
                              <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded border">°C</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Examen extraoral</h4>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Resultado de exámenes auxiliares</h4>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                      </div>

                      {/* Columna derecha */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Signos vitales (continuación):</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700 w-20">FC</span>
                              <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded border">bpm</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700 w-20">FR</span>
                              <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder=""
                              />
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded border">r/m</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Examen intraoral</h4>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Observaciones</h4>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Botón Guardar */}
                    <div className="flex justify-center mt-6">
                      <button className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors">
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Contenido - Nota evolución breve */}
              {activeHistoriaTab === 'nota-evolucion-breve' && (
                <div className="p-6">
                  <div className="bg-white min-h-96">
                    <div className="mb-4">
                      <button
                        onClick={() => setIsAgregarEvolucionOpen(true)}
                        className="bg-blue-100 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                      >
                        Agregar evolución
                      </button>
                    </div>
                    
                    {/* Lista de notas de evolución */}
                    {notasEvolucionBreve.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay notas de evolución</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notasEvolucionBreve.map((nota) => (
                          <div key={nota.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-900">{nota.doctor}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(nota.fecha).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                            {nota.evolucion && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-600 font-medium mb-1">Evolución:</p>
                                <p className="text-sm text-gray-800">{nota.evolucion}</p>
                              </div>
                            )}
                            {nota.observacion && (
                              <div>
                                <p className="text-xs text-gray-600 font-medium mb-1">Observación:</p>
                                <p className="text-sm text-gray-800">{nota.observacion}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contenido - Anam. Odontopediatría */}
              {activeHistoriaTab === 'anam-odontopediatria' && (
                <div className="p-6 space-y-6">
                  {/* Sección - Motivo de consulta y datos familiares */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-medium">Sección</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de consulta</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                      
                      {/* Información de padres y hermanos */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre mamá</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre papá</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número de hermanos</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ENFERMEDAD ACTUAL */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">ENFERMEDAD ACTUAL</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de enfermedad</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relato cronológico</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* ANTECEDENTES PRENATALES */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">ANTECEDENTES PRENATALES</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enfermedades maternas</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">¿Hubo complicaciones en el embarazo?</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">¿Fue un bebé prematuro?</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="block text-sm font-medium text-gray-700">Peso al nacer</label>
                        <input
                          type="text"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded border">kg</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* ANTECEDENTES POSTNATALES */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">ANTECEDENTES POSTNATALES</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Preguntas Sí/No con campos de texto */}
                      {[
                        '¿Problemas en el parto?', '¿Usó chupón?', '¿Usó biberón?', '¿Se chupa/chupaba el dedo?',
                        '¿Toma alguna medicación o terapia?', '¿Es alérgico o intolerante a algo?',
                        '¿Se cepilla antes de dormir?', '¿Duerme con la boca abierta o ronca?'
                      ].map((pregunta) => (
                        <div key={pregunta} className="flex items-center space-x-4">
                          <span className="text-sm text-gray-700 w-48">{pregunta}</span>
                          <div className="flex space-x-2">
                            <label className="flex items-center space-x-1">
                              <input type="radio" name={pregunta} value="no" className="text-blue-600" />
                              <span className="text-sm text-gray-600">No</span>
                            </label>
                            <label className="flex items-center space-x-1">
                              <input type="radio" name={pregunta} value="si" className="text-blue-600" />
                              <span className="text-sm text-gray-600">Si</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentario adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>

                      {/* Preguntas sobre dieta y alimentación */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-700 w-48">¿Cuánto dulce come?</span>
                          <input
                            type="text"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                          <button className="bg-blue-100 text-blue-600 px-3 py-2 rounded border text-sm">
                            Veces al día
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-700 w-48">¿Con qué frecuencia?</span>
                          <input
                            type="text"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                          <button className="bg-blue-100 text-blue-600 px-3 py-2 rounded border text-sm">
                            días/semana
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué tipo de leche recibe el bebé?</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo le lava los dientes al bebé o niño?</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Describa un día de comida de su bebé/niño desde el desayuno.</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección final - Evaluación parental y examen clínico */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ¿Te consideras un papá/mamá autoritario, cooperador, despreocupado o sobreprotector?
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hábitos orales</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Técnica de cepillado</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Examen clínico</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                            placeholder=""
                          />
                        </div>
                      </div>
                      
                      {/* Botón Guardar */}
                      <div className="flex justify-center pt-4">
                        <button className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors">
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido - Endodoncia */}
              {activeHistoriaTab === 'endodoncia' && (
                <div className="p-6 space-y-6">
                  {/* Primera sección - Datos básicos */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-medium">Sección</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">¿Tratamiento endodóntico previo?</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Historia del dolor</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nota adicional</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">N° de diente</label>
                        <input
                          type="text"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* EXAMEN CLÍNICO */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">EXAMEN CLÍNICO</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Corona Anatómica */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Corona Anatómica</label>
                        <div className="flex flex-wrap gap-4">
                          {['Caries', 'Restauración', 'Bruxismo', 'Fractura', 'Fractura y exposición pulpar'].map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-2">
                              <input type="checkbox" className="text-blue-600" />
                              <span className="text-sm text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Inflamación presente */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Inflamación presente</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="inflamacion" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="inflamacion" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Especificar</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      {/* Fístulas */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Fístulas</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="fistulas" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="fistulas" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Especificar</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      {/* Gingivitis */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Gingivitis</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="gingivitis" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="gingivitis" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Movilidad</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      {/* Bolsas */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Bolsas</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="bolsas" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="bolsas" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Sondeo</span>
                        <input
                          type="text"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>

                      {/* Sarro */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Sarro</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="sarro" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="sarro" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                      </div>

                      {/* Características del dolor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Características del dolor</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-wrap gap-4">
                            {['Espontáneo', 'Provocado', 'Frío', 'Calor', 'Masticación', 'Nocturno', 'Aire', 'Dulce', 'Ácido', 'Irradiado', 'Difuso', 'Punzante'].map((opcion) => (
                              <label key={opcion} className="flex items-center space-x-2">
                                <input type="checkbox" className="text-blue-600" />
                                <span className="text-sm text-gray-700">{opcion}</span>
                              </label>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {['Continuo', 'Intermitente', 'Esporádico'].map((opcion) => (
                              <label key={opcion} className="flex items-center space-x-2">
                                <input type="checkbox" className="text-blue-600" />
                                <span className="text-sm text-gray-700">{opcion}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segunda sección - Dolor y pruebas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dolor a la percusión */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dolor a la percusión</label>
                        <div className="flex space-x-4 mb-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">Horizontal</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">Vertical</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dolor a palpación */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dolor a palpación</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">Vestibular</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">Lingual/Palatino</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRUEBA DE VITALIDAD */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">PRUEBA DE VITALIDAD</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Calor */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-20">Calor</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="calor" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="calor" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Duración</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                        <span className="text-sm text-gray-700">Intensidad</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      {/* Frío */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-20">Frío</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="frio" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Sí</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="frio" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <span className="text-sm text-gray-700">Duración</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                        <span className="text-sm text-gray-700">Intensidad</span>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* EXAMEN RADIOGRÁFICO */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">EXAMEN RADIOGRÁFICO</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Cámara Pulpar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cámara Pulpar</label>
                        <div className="flex flex-wrap gap-4">
                          {['Abierta', 'Cerrada', 'Amplia', 'Estrecha', 'Cálculos pulpares'].map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-2">
                              <input type="checkbox" className="text-blue-600" />
                              <span className="text-sm text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Conducto(s) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conducto(s)</label>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-700">Número de conductos:</span>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {['Único', '2 conductos', '3 conductos', '4 conductos'].map((opcion) => (
                                <label key={opcion} className="flex items-center space-x-2">
                                  <input type="checkbox" className="text-blue-600" />
                                  <span className="text-sm text-gray-700">{opcion}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-700">Características:</span>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {['Recto', 'Curvo', 'Amplio', 'Estrecho', 'Tratado anteriormente', 'Ápice abierto'].map((opcion) => (
                                <label key={opcion} className="flex items-center space-x-2">
                                  <input type="checkbox" className="text-blue-600" />
                                  <span className="text-sm text-gray-700">{opcion}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hallazgos específicos */}
                      <div className="space-y-3">
                        {[
                          'Lesión en Furca', 'Lesión Apical', 'Lesión Lateral', 'Lesión Endo-perio',
                          'Raíces enanas', 'Fractura radicular', 'Calcificación'
                        ].map((hallazgo) => (
                          <div key={hallazgo} className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 w-32">{hallazgo}</span>
                            <div className="flex space-x-2">
                              <label className="flex items-center space-x-1">
                                <input type="radio" name={hallazgo} value="si" className="text-blue-600" />
                                <span className="text-sm text-gray-600">Sí</span>
                              </label>
                              <label className="flex items-center space-x-1">
                                <input type="radio" name={hallazgo} value="no" className="text-blue-600" />
                                <span className="text-sm text-gray-600">No</span>
                              </label>
                            </div>
                            {(hallazgo === 'Fractura radicular' || hallazgo === 'Calcificación') && (
                              <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Seleccionar</option>
                              </select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tercera sección - Ligamento periodontal y reabsorción */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Ligamento periodontal</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="ligamento" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Si</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="ligamento" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 w-32">Reabsorción</span>
                        <div className="flex space-x-2">
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="reabsorcion" value="si" className="text-blue-600" />
                            <span className="text-sm text-gray-600">Si</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input type="radio" name="reabsorcion" value="no" className="text-blue-600" />
                            <span className="text-sm text-gray-600">No</span>
                          </label>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Seleccionar</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIAGNÓSTICO PULPAR DE PRESUNCIÓN */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">DIAGNÓSTICO PULPAR DE PRESUNCIÓN</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {['Pulpa normal', 'Pulpitis Reversible', 'Pulpitis Irreversible sintomática', 'Pulpitis Irreversible asintomática', 'Necrosis Pulpar', 'Previamente tratado', 'Previamente iniciado'].map((opcion) => (
                          <label key={opcion} className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">{opcion}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIAGNÓSTICO PERIAPICAL */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">DIAGNÓSTICO PERIAPICAL</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {['Tejidos apicales sanos', 'Periodontitis apical aguda (sintomática)', 'Periodontitis apical crónica (asintomática)', 'Absceso apical agudo (sin fístula)', 'Absceso apical crónico (con fístula)', 'Osteítis condensante'].map((opcion) => (
                          <label key={opcion} className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">{opcion}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIAGNÓSTICO DEFINITIVO */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">DIAGNÓSTICO DEFINITIVO</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {['Pulpitis irreversible', 'Pulpa necrótica'].map((opcion) => (
                          <label key={opcion} className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">{opcion}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* TRATAMIENTO INDICADO */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">TRATAMIENTO INDICADO</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {['Biopulpectomía', 'Apicectomía', 'Necropulpectomía', 'Hemisección', 'Retratamiento', 'Radicectomía', 'Blanqueamiento', 'Extracción'].map((opcion) => (
                          <label key={opcion} className="flex items-center space-x-2">
                            <input type="checkbox" className="text-blue-600" />
                            <span className="text-sm text-gray-700">{opcion}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* DATOS CLÍNICOS */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-bold">DATOS CLÍNICOS</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Conducto</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Longitud de trabajo (mm)</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Punto de referencia</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Lima inicial</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Última lima apical</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Tipo Cemento</th>
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Cono maestro de gutapercha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['Único', 'Vestibular', 'Palatino/Lingual', 'Mesio lingual', 'Mesio Bucal', 'Distal', 'Disto Bucal', 'Disto Lingual'].map((conducto) => (
                              <tr key={conducto}>
                                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-700">{conducto}</td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                  <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección final - Accidentes operatorios y pronóstico */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="bg-blue-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-blue-600 font-medium">Sección</h3>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
                      </svg>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accidentes operatorios</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder=""
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Restauración post-endodóntica indicada</label>
                        <div className="flex flex-wrap gap-4">
                          {['Poste', 'Amalgama/Resina', 'Corona', 'Otro'].map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-2">
                              <input type="checkbox" className="text-blue-600" />
                              <span className="text-sm text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pronóstico</label>
                        <div className="flex flex-wrap gap-4">
                          {['Favorable', 'Desfavorable', 'Reservado'].map((opcion) => (
                            <label key={opcion} className="flex items-center space-x-2">
                              <input type="checkbox" className="text-blue-600" />
                              <span className="text-sm text-gray-700">{opcion}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nota adicional</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón Guardar */}
                  <div className="flex justify-center pt-4">
                    <button className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors">
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              {/* Contenido - Otras pestañas (placeholder) */}
              {activeHistoriaTab !== 'anam-odontologia' && activeHistoriaTab !== 'nota-evolucion-breve' && activeHistoriaTab !== 'anam-odontopediatria' && activeHistoriaTab !== 'endodoncia' && (
                <div className="p-6">
                  <div className="bg-white min-h-96 flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Contenido de {activeHistoriaTab} - En desarrollo</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'odontograma' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              {/* Header del odontograma */}
              <div className="mb-6">
                {/* Tabs */}
                <div className="flex space-x-8 border-b mb-4">
                  <button
                    onClick={() => setActiveOdontogramaTab('inicial')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'inicial'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Inicial
                  </button>
                  <button
                    onClick={() => setActiveOdontogramaTab('evolucion')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'evolucion'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Evolución
                  </button>
                  <button
                    onClick={() => setActiveOdontogramaTab('alta')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeOdontogramaTab === 'alta'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Odo. Alta
                  </button>
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="text-blue-600 text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Ver 'Barra de progreso'</span>
                    </button>
                    
                    {/* Leyenda */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Mal estado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Buen estado</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Nuevo odontog.</span>
                    </button>
                    
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                      </svg>
                      <span>Marcado múltiple</span>
                    </button>
                    
                    <button className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-sm flex items-center space-x-1">
                      <span>$</span>
                      <span>Crear presupuesto</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Odontograma */}
              <div className="bg-white border border-gray-200 rounded-lg p-12">
                {loadingOdontograma ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Cargando odontograma...</span>
                  </div>
                ) : (
                  <>
                    {/* Arcada Superior */}
                    <div className="flex justify-center mb-8">
                      <div className="flex items-center space-x-2">
                        {/* Cuadrante Superior Derecho (18-11) */}
                        <div className="flex space-x-2">
                          {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                            <DienteSVG 
                              key={numero} 
                              numero={numero} 
                              tipo={getTipoDiente(numero)}
                              estadoInicial={odontogramaData.dientes[numero]}
                              onUpdate={handleDienteUpdate}
                              readonly={false}
                              showTooltip={true}
                            />
                          ))}
                        </div>
                        
                        {/* Separador */}
                        <div className="w-8"></div>
                        
                        {/* Cuadrante Superior Izquierdo (21-28) */}
                        <div className="flex space-x-2">
                          {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                            <DienteSVG 
                              key={numero} 
                              numero={numero} 
                              tipo={getTipoDiente(numero)}
                              estadoInicial={odontogramaData.dientes[numero]}
                              onUpdate={handleDienteUpdate}
                              readonly={false}
                              showTooltip={true}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Arcada Inferior */}
                    <div className="flex justify-center">
                      <div className="flex items-center space-x-2">
                        {/* Cuadrante Inferior Izquierdo (38-31) */}
                        <div className="flex space-x-2">
                          {[38, 37, 36, 35, 34, 33, 32, 31].map(numero => (
                            <DienteSVG 
                              key={numero} 
                              numero={numero} 
                              tipo={getTipoDiente(numero)}
                              estadoInicial={odontogramaData.dientes[numero]}
                              onUpdate={handleDienteUpdate}
                              readonly={false}
                              showTooltip={true}
                            />
                          ))}
                        </div>
                        
                        {/* Separador */}
                        <div className="w-8"></div>
                        
                        {/* Cuadrante Inferior Derecho (41-48) */}
                        <div className="flex space-x-2">
                          {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                            <DienteSVG 
                              key={numero} 
                              numero={numero} 
                              tipo={getTipoDiente(numero)}
                              estadoInicial={odontogramaData.dientes[numero]}
                              onUpdate={handleDienteUpdate}
                              readonly={false}
                              showTooltip={true}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Plan de tratamiento */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Plan de tratamiento</h3>
                    <button 
                      onClick={handleGuardarOdontograma}
                      disabled={savingOdontograma}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:bg-gray-400 flex items-center space-x-2"
                    >
                      {savingOdontograma ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>Guardar Odontograma</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Tabla de plan de tratamiento */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header de la tabla */}
                    <div className="bg-slate-700 text-white">
                      <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm font-medium">
                        <div>N° diente</div>
                        <div>Tratamiento</div>
                        <div>Descripción</div>
                        <div>Prioridad</div>
                        <div>Estado</div>
                        <div>Acciones</div>
                      </div>
                    </div>
                    
                    {/* Contenido de la tabla */}
                    <div className="divide-y divide-gray-200">
                      {odontogramaData.plan_tratamiento && odontogramaData.plan_tratamiento.length > 0 ? (
                        odontogramaData.plan_tratamiento.map((tratamiento) => (
                          <div key={tratamiento.id} className="grid grid-cols-6 gap-4 px-6 py-3 text-sm hover:bg-gray-50">
                            <div className="font-medium text-gray-900">{tratamiento.numero_diente}</div>
                            <div className="text-gray-700">{tratamiento.tratamiento}</div>
                            <div className="text-gray-600 text-xs">{tratamiento.descripcion || '-'}</div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                tratamiento.prioridad === 'urgente' ? 'bg-red-100 text-red-800' :
                                tratamiento.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                                tratamiento.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {tratamiento.prioridad}
                              </span>
                            </div>
                            <div>
                              <select
                                value={tratamiento.estado}
                                onChange={(e) => handleActualizarEstadoTratamiento(tratamiento.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="en_proceso">En proceso</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                              </select>
                            </div>
                            <div>
                              <button
                                onClick={() => handleEliminarTratamiento(tratamiento.id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6">
                          <div className="min-h-32 flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">No hay tratamientos planificados</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secciones adicionales */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Especificaciones */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Especificaciones:</h4>
                    <textarea 
                      className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                      placeholder="Escribir especificaciones..."
                      value={odontogramaData.especificaciones}
                      onChange={(e) => setOdontogramaData(prev => ({ ...prev, especificaciones: e.target.value }))}
                    />
                  </div>

                  {/* Diagnóstico */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnóstico:</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <button className="text-blue-600 text-sm hover:text-blue-800">
                        Usar lista CIE-10
                      </button>
                    </div>
                    <textarea 
                      className="w-full h-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                      placeholder="Escribir diagnóstico..."
                      value={odontogramaData.diagnostico}
                      onChange={(e) => setOdontogramaData(prev => ({ ...prev, diagnostico: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Observaciones y Plan de trabajo */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Observaciones */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Observaciones:</h4>
                    <div className="relative">
                      <textarea 
                        className="w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                        placeholder="Escribir observaciones generales..."
                        value={odontogramaData.observaciones}
                        onChange={(e) => setOdontogramaData(prev => ({ ...prev, observaciones: e.target.value }))}
                      />
                      <div className="absolute bottom-2 right-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Lista de observaciones con viñetas */}
                    <div className="mt-4 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">▲</span>
                        <span>P1 8-1.5: Aparato ortodóncico fijo</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">⚪</span>
                        <span>P1.3: Caries oclusal (a nivel del esmalte)</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">⚪</span>
                        <span>P1.3: Caries vestibular (a nivel del esmalte)</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">⚪</span>
                        <span>P1.3: Caries distal (a nivel del esmalte)</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">⚪</span>
                        <span>P2.5: Caries distal (Mancha Blanca)</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">▼</span>
                        <span>P2.5: Caries oclusal (Mancha Blanca)</span>
                      </div>
                      <div className="flex items-start space-x-2 mt-1">
                        <span className="text-gray-400 mt-1">⚪</span>
                        <span>P3.3: Caries distal</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan de trabajo */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Plan de trabajo:</h4>
                    <div className="relative">
                      <textarea 
                        className="w-full h-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                        placeholder="Escribir plan de trabajo..."
                        value={odontogramaData.plan_trabajo}
                        onChange={(e) => setOdontogramaData(prev => ({ ...prev, plan_trabajo: e.target.value }))}
                      />
                      <div className="absolute bottom-2 right-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sección de Periodontograma */}
          {activeSection === 'periodontograma' && (
            <div className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto">
              {/* Header del periodontograma */}
              <div className="mb-6">
                {/* Tabs */}
                <div className="flex space-x-8 border-b mb-4">
                  <button
                    onClick={() => setActivePeriodontogramaTab('periodontogramas')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activePeriodontogramaTab === 'periodontogramas'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Periodontogramas
                  </button>
                  <button
                    onClick={() => setActivePeriodontogramaTab('plan-tratamiento')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activePeriodontogramaTab === 'plan-tratamiento'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Plan de tratamiento
                  </button>
                </div>

                {/* Controls Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Doctor:</span>
                      <select 
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="Eduardo Carmin">Eduardo Carmin</option>
                        <option value="Dr. Rodriguez">Dr. Rodriguez</option>
                        <option value="Dra. Martinez">Dra. Martinez</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Indicadores */}
                    <div className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-md flex items-center space-x-4">
                      <span className="text-sm font-medium">Índice de placa (%IP): 0.00%</span>
                      <span className="text-sm font-medium">Sangrado (%SAS): 0.00%</span>
                    </div>
                    
                    <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Guardar
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {activePeriodontogramaTab === 'periodontogramas' && (
                <div className="space-y-8">
                  {/* Tabla Superior */}
                  <div className="space-y-4">
                    {/* Dientes superiores 18-11 */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 w-32"></th>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <th key={numero} className="text-center py-2 px-2 text-sm font-medium text-gray-700 border-l border-gray-200">
                                {numero}
                              </th>
                            ))}
                            <th className="w-8"></th>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <th key={numero} className="text-center py-2 px-2 text-sm font-medium text-gray-700 border-l border-gray-200">
                                {numero}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Movilidad</td>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t bg-red-50">
                            <td className="py-2 px-3 text-sm text-blue-600 bg-gray-50 font-medium">Sangrado al sondaje</td>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded bg-red-50" defaultValue="0" />
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded bg-red-50" defaultValue="0" />
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t bg-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Placa</td>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200 bg-gray-100">
                                <div className="w-8 h-6 bg-gray-200 rounded border border-gray-300"></div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200 bg-gray-100">
                                <div className="w-8 h-6 bg-gray-200 rounded border border-gray-300"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Margen Gingival</td>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Profundidad de Sondaje</td>
                            {[18, 17, 16, 15, 14, 13, 12, 11].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[21, 22, 23, 24, 25, 26, 27, 28].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Gráfico de dientes superiores */}
                    <div className="border border-gray-300 rounded-lg p-6 bg-white">
                      <svg width="100%" height="200" viewBox="0 0 1000 200" className="bg-white">
                        {/* Línea guía */}
                        <line x1="40" y1="110" x2="960" y2="110" stroke="#9333ea" strokeWidth="2" />
                        {/* Dientes superiores 18-11 */}
                        {[18, 17, 16, 15, 14, 13, 12, 11].map((numero, index) => (
                          <PeriodontoTooth
                            key={numero}
                            x={60 + index * 48}
                            y={50}
                            type={index <= 1 ? 'molar' : index <= 3 ? 'premolar' : index === 4 ? 'canino' : 'incisor'}
                            arch="upper"
                            number={numero}
                          />
                        ))}
                        {/* Dientes superiores 21-28 */}
                        {[21, 22, 23, 24, 25, 26, 27, 28].map((numero, index) => (
                          <PeriodontoTooth
                            key={numero}
                            x={560 + index * 48}
                            y={50}
                            type={index >= 6 ? 'molar' : index >= 4 ? 'premolar' : index === 3 ? 'canino' : 'incisor'}
                            arch="upper"
                            number={numero}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Tabla Inferior */}
                  <div className="space-y-4">
                    {/* Tabla para dientes inferiores */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Margen Gingival</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Profundidad de Sondaje</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <div className="flex space-x-1">
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                  <input className="w-6 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t bg-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Placa</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200 bg-gray-100">
                                <div className="w-8 h-6 bg-gray-200 rounded border border-gray-300"></div>
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200 bg-gray-100">
                                <div className="w-8 h-6 bg-gray-200 rounded border border-gray-300"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t bg-red-50">
                            <td className="py-2 px-3 text-sm text-blue-600 bg-gray-50 font-medium">Sangrado al sondaje</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded bg-red-50" defaultValue="0" />
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded bg-red-50" defaultValue="0" />
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-2 px-3 text-sm text-gray-700 bg-gray-50 font-medium">Movilidad</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                              </td>
                            ))}
                            <td className="w-8"></td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-2 px-2 border-l border-gray-200">
                                <input className="w-8 h-6 text-center text-xs border border-gray-300 rounded" defaultValue="0" />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                        <thead>
                          <tr className="bg-gray-50 border-t">
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-700 w-32"></th>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <th key={numero} className="text-center py-2 px-2 text-sm font-medium text-gray-700 border-l border-gray-200">
                                {numero}
                              </th>
                            ))}
                            <th className="w-8"></th>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <th key={numero} className="text-center py-2 px-2 text-sm font-medium text-gray-700 border-l border-gray-200">
                                {numero}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      </table>
                    </div>

                    {/* Gráfico de dientes inferiores */}
                    <div className="border border-gray-300 rounded-lg p-6 bg-white">
                      <svg width="100%" height="200" viewBox="0 0 1000 200" className="bg-white">
                        {/* Línea guía */}
                        <line x1="40" y1="95" x2="960" y2="95" stroke="#9333ea" strokeWidth="2" />
                        {/* Dientes inferiores 48-41 */}
                        {[48, 47, 46, 45, 44, 43, 42, 41].map((numero, index) => (
                          <PeriodontoTooth
                            key={numero}
                            x={60 + index * 48}
                            y={100}
                            type={index <= 1 ? 'molar' : index <= 3 ? 'premolar' : index === 4 ? 'canino' : 'incisor'}
                            arch="lower"
                            number={numero}
                          />
                        ))}
                        {/* Dientes inferiores 31-38 */}
                        {[31, 32, 33, 34, 35, 36, 37, 38].map((numero, index) => (
                          <PeriodontoTooth
                            key={numero}
                            x={560 + index * 48}
                            y={100}
                            type={index >= 6 ? 'molar' : index >= 4 ? 'premolar' : index === 3 ? 'canino' : 'incisor'}
                            arch="lower"
                            number={numero}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Tablas adicionales inferiores */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tabla izquierda inferior */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 text-right text-orange-600 bg-gray-50">Nota</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-1 px-2 text-right text-blue-600 bg-gray-50">Sangrado al sondaje</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-1 px-2 text-right text-gray-700 bg-gray-50">Placa</td>
                            {[48, 47, 46, 45, 44, 43, 42, 41].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Tabla derecha inferior */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="py-1 px-2 text-right text-orange-600 bg-gray-50">Nota</td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-1 px-2 text-right text-blue-600 bg-gray-50">Sangrado al sondaje</td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t">
                            <td className="py-1 px-2 text-right text-gray-700 bg-gray-50">Placa</td>
                            {[31, 32, 33, 34, 35, 36, 37, 38].map(numero => (
                              <td key={numero} className="text-center py-1 px-1 border-l border-gray-200 bg-gray-100">
                                <div className="w-6 h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activePeriodontogramaTab === 'plan-tratamiento' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Plan de tratamiento periodontal</p>
                  <p className="text-gray-400 text-sm mt-2">Esta sección estará disponible próximamente</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar derecho - Notas y presupuestos */}
        <div className="w-80 bg-white border-l hidden lg:block">
          {/* Notas de evolución */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notas de evolución</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsNotaEvolucionOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                </button>
              </div>
            </div>
            {notasEvolucion.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay notas de evolución</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {notasEvolucion.map((nota) => (
                  <div key={nota.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{nota.doctor}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(nota.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {nota.evolucion && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 font-medium mb-1">Evolución:</p>
                        <p className="text-sm text-gray-800">{nota.evolucion}</p>
                      </div>
                    )}
                    {nota.observacion && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Observación:</p>
                        <p className="text-sm text-gray-800">{nota.observacion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presupuestos */}
          <div className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <p className="text-gray-600 text-sm">Este paciente aún no tiene presupuestos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[300] p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* Modal de nuevo archivo */}
      <NuevoArchivoModal
        isOpen={isNuevoArchivoOpen}
        onClose={() => setIsNuevoArchivoOpen(false)}
        onSave={handleSaveArchivo}
      />

      {/* Modal de nota de evolución */}
      <NotaEvolucionModal
        isOpen={isNotaEvolucionOpen}
        onClose={() => setIsNotaEvolucionOpen(false)}
        onSave={handleSaveNotaEvolucion}
      />

      {/* Modal de agregar evolución breve */}
      <AgregarEvolucionModal
        isOpen={isAgregarEvolucionOpen}
        onClose={() => setIsAgregarEvolucionOpen(false)}
        onSave={handleSaveEvolucionBreve}
      />
      <AgregarDatosFiscalesModal
        isOpen={isAgregarDatosFiscalesOpen}
        onClose={() => setIsAgregarDatosFiscalesOpen(false)}
        onSave={handleSaveDatosFiscales}
      />
      <AgregarFamiliarModal
        isOpen={isAgregarFamiliarOpen}
        onClose={() => setIsAgregarFamiliarOpen(false)}
        onSave={handleSaveFamiliar}
      />
    </div>
  );
};

export default HistoriaClinica;
