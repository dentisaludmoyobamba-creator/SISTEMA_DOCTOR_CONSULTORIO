// Datos mock para la agenda médica
export const doctores = [
  {
    id: 1,
    nombre: "Eduardo Carmin",
    color: "bg-blue-500",
    colorLight: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: 2,
    nombre: "Especialistas",
    color: "bg-red-500",
    colorLight: "bg-red-100",
    textColor: "text-red-700"
  },
  {
    id: 3,
    nombre: "Dr. García",
    color: "bg-green-500",
    colorLight: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: 4,
    nombre: "Dra. López",
    color: "bg-purple-500",
    colorLight: "bg-purple-100",
    textColor: "text-purple-700"
  }
];

// Generar fechas de la semana actual
const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  const weekDates = [];
  for (let i = 0; i < 6; i++) { // Lunes a Sábado
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }
  return weekDates;
};

export const weekDates = getWeekDates();

export const citas = [
  {
    id: 1,
    paciente: "Romeo Prueba",
    doctorId: 1,
    fecha: weekDates[0], // Lunes
    hora: "09:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-123-456",
    motivo: "Consulta general"
  },
  {
    id: 2,
    paciente: "Homero Prueba",
    doctorId: 1,
    fecha: weekDates[0], // Lunes
    hora: "11:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-789-123",
    motivo: "Control de presión"
  },
  {
    id: 3,
    paciente: "Homero Prueba",
    doctorId: 1,
    fecha: weekDates[1], // Martes
    hora: "11:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-789-123",
    motivo: "Seguimiento"
  },
  {
    id: 4,
    paciente: "Romeo Prueba",
    doctorId: 1,
    fecha: weekDates[0], // Lunes
    hora: "13:00",
    duracion: 60,
    estado: "cancelado",
    telefono: "999-123-456",
    motivo: "Consulta especializada"
  },
  {
    id: 5,
    paciente: "María García",
    doctorId: 2,
    fecha: weekDates[2], // Miércoles
    hora: "10:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-456-789",
    motivo: "Consulta cardiológica"
  },
  {
    id: 6,
    paciente: "Carlos Mendoza",
    doctorId: 3,
    fecha: weekDates[3], // Jueves
    hora: "14:00",
    duracion: 60,
    estado: "pendiente",
    telefono: "999-654-321",
    motivo: "Revisión anual"
  },
  {
    id: 7,
    paciente: "Ana Rodríguez",
    doctorId: 4,
    fecha: weekDates[4], // Viernes
    hora: "09:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-987-654",
    motivo: "Consulta dermatológica"
  },
  {
    id: 8,
    paciente: "Pedro Sánchez",
    doctorId: 2,
    fecha: weekDates[1], // Martes
    hora: "15:00",
    duracion: 60,
    estado: "confirmado",
    telefono: "999-321-654",
    motivo: "Consulta neurológica"
  }
];

export const horarios = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export const diasSemana = [
  { nombre: "Lunes", fecha: weekDates[0], dia: new Date(weekDates[0]).getDate() },
  { nombre: "Martes", fecha: weekDates[1], dia: new Date(weekDates[1]).getDate() },
  { nombre: "Miércoles", fecha: weekDates[2], dia: new Date(weekDates[2]).getDate() },
  { nombre: "Jueves", fecha: weekDates[3], dia: new Date(weekDates[3]).getDate() },
  { nombre: "Viernes", fecha: weekDates[4], dia: new Date(weekDates[4]).getDate() },
  { nombre: "Sábado", fecha: weekDates[5], dia: new Date(weekDates[5]).getDate() }
];

export const estadosCita = [
  { value: "todos", label: "Todos", color: "bg-gray-100" },
  { value: "confirmado", label: "Confirmado", color: "bg-green-100" },
  { value: "pendiente", label: "Pendiente", color: "bg-yellow-100" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100" }
];

// Datos de pacientes expandidos
export const pacientes = [
  {
    id: 1,
    nombre: "Homero Prueba",
    apellido: "Simpson",
    documento: "12345678",
    telefono: "999-789-123",
    email: "homero@email.com",
    fechaNacimiento: "1980-05-12",
    direccion: "Jr. Lima 456, Moyobamba",
    ultimaCita: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 3 días
    proximaCita: null,
    tarea: "Revisión anual pendiente",
    presupuesto: 0,
    fuenteCaptacion: "Referido",
    comentario: "Paciente regular, muy puntual",
    estado: "activo",
    avatar: "👨‍💼",
    etiqueta: "VIP",
    etiquetaColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 2,
    nombre: "Julieta Prueba",
    apellido: "Capuleto",
    documento: "87654321",
    telefono: "999-456-789",
    email: "julieta@email.com",
    fechaNacimiento: "1992-08-15",
    direccion: "Av. Grau 789, Moyobamba",
    ultimaCita: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 2 días
    proximaCita: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 7 días
    tarea: "Control post-operatorio",
    presupuesto: 500,
    fuenteCaptacion: "Redes sociales",
    comentario: "Paciente joven, muy colaborativa",
    estado: "activo",
    avatar: "👩‍💻",
    etiqueta: "VIP",
    etiquetaColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 3,
    nombre: "Romeo Prueba",
    apellido: "Montesco",
    documento: "11223344",
    telefono: "999-123-456",
    email: "romeo@email.com",
    fechaNacimiento: "1988-03-20",
    direccion: "Jr. Sucre 321, Moyobamba",
    ultimaCita: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 3 días
    proximaCita: null,
    tarea: "Seguimiento tratamiento",
    presupuesto: 0,
    fuenteCaptacion: "Caminata",
    comentario: "Requiere seguimiento especial",
    estado: "impuntual",
    avatar: "👨‍🎭",
    etiqueta: "Impuntual",
    etiquetaColor: "bg-red-100 text-red-800"
  },
  {
    id: 4,
    nombre: "María García",
    apellido: "López",
    documento: "55667788",
    telefono: "999-654-321",
    email: "maria@email.com",
    fechaNacimiento: "1975-11-10",
    direccion: "Av. Amazonas 654, Moyobamba",
    ultimaCita: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 7 días
    proximaCita: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 14 días
    tarea: "Limpieza dental",
    presupuesto: 150,
    fuenteCaptacion: "Referido",
    comentario: "Paciente de confianza",
    estado: "activo",
    avatar: "👩‍⚕️",
    etiqueta: null,
    etiquetaColor: null
  },
  {
    id: 5,
    nombre: "Carlos Mendoza",
    apellido: "Vásquez",
    documento: "99887766",
    telefono: "999-987-654",
    email: "carlos@email.com",
    fechaNacimiento: "1965-07-25",
    direccion: "Jr. Bolívar 987, Moyobamba",
    ultimaCita: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 1 día
    proximaCita: null,
    tarea: "Evaluación ortodoncia",
    presupuesto: 800,
    fuenteCaptacion: "Google",
    comentario: "Interesado en tratamiento completo",
    estado: "activo",
    avatar: "👨‍💼",
    etiqueta: null,
    etiquetaColor: null
  }
];

// Datos de transacciones para la caja
export const transacciones = [
  {
    id: 1,
    fecha: new Date().toISOString().split('T')[0],
    hora: "09:30",
    tipo: "ingreso",
    doctor: "Eduardo Carmin",
    paciente: "Homero Prueba",
    concepto: "Consulta general",
    medioPago: "Efectivo",
    monto: 80,
    estado: "completado",
    comentario: "Pago completo"
  },
  {
    id: 2,
    fecha: new Date().toISOString().split('T')[0],
    hora: "11:15",
    tipo: "ingreso",
    doctor: "Eduardo Carmin",
    paciente: "Julieta Prueba",
    concepto: "Limpieza dental",
    medioPago: "Tarjeta",
    monto: 120,
    estado: "completado",
    comentario: "Tratamiento completo"
  },
  {
    id: 3,
    fecha: new Date().toISOString().split('T')[0],
    hora: "14:00",
    tipo: "egreso",
    doctor: "Eduardo Carmin",
    paciente: null,
    concepto: "Materiales dentales",
    medioPago: "Transferencia",
    monto: 250,
    estado: "completado",
    comentario: "Compra de insumos"
  },
  {
    id: 4,
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ayer
    hora: "10:00",
    tipo: "ingreso",
    doctor: "Especialistas",
    paciente: "Romeo Prueba",
    concepto: "Consulta especializada",
    medioPago: "Efectivo",
    monto: 150,
    estado: "completado",
    comentario: "Consulta cardiológica"
  },
  {
    id: 5,
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ayer
    hora: "16:30",
    tipo: "egreso",
    doctor: "Eduardo Carmin",
    paciente: null,
    concepto: "Servicios públicos",
    medioPago: "Transferencia",
    monto: 180,
    estado: "completado",
    comentario: "Pago de luz y agua"
  }
];

// Resumen financiero
export const resumenFinanciero = {
  ingresoHoy: 200,
  egresoHoy: 250,
  ingresoMes: 8500,
  egresoMes: 3200,
  balanceHoy: -50,
  balanceMes: 5300
};
