//https://github.com/HamzaAnwar1998/Upload-And-View-Excel-Files/tree/main
import { useState, useEffect } from "react";
import { API_SERVER } from "./Apis";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Plot from 'react-plotly.js';
import Swal from 'sweetalert2'
function App() {

  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  const [doctorData, setDoctorData] = useState(null);
  const [cajeroData, setCajeroData] = useState(null);
  const [paymentsDataDoc, setPaymentsDoc] = useState([]);
  const [transactionsCaj, setTransactionsCaj] = useState([]);
  const [transactionsParticularesMedicos, setTransactionsParticularesMedicos] = useState([]);

  const [atentionData, setAtentionData] = useState([]);
  const [transactionsParticularesFonasa, setTransactionsParticularesFonasa] = useState([]);
  const [ventasInsumos, setVentasInsumos] = useState([]);
  const [atentionsByMedic, setAtentionsByMedic] = useState([]);


  const [selectedMedico, setSelectedMedico] = useState('');
  const [selectedMes, setSelectedMes] = useState('');
  const [selectedAnnio, setSelectedAnnio] = useState(0);

  const [selectedCajeros, setSelectedCajeros] = useState('');
  const [selectedMedicos, setSelectedMedicos] = useState('');

  const [selectedTrimestreCajero, setSelectedTrimestreCajero] = useState('');
  const [selectedAnnioCajero, setSelectedAnnioCajero] = useState(0);

  const [selectedMesMedicoParticular, setSelectedMesMedicoParticular] = useState('');
  const [selectedAnnioMedicoParticular, setSelectedMedicoParticular] = useState(0);

  const [selectedMesAtencion, setSelectedMesAtencion] = useState('');
  const [selectedSemestreAtencion, setSelectedSemestreAtencion] = useState(0);
  const [selectedAnnioAtencion, setSelectedAnnioAtencion] = useState(2021);
  const [selectedTrimestreAtencion, setSelectedTrimestreAtencion] = useState(0);

  const [selectedPrevision, setSelectedPrevision] = useState('');
  const [selectedMesPrevision, setSelectedMesPrevision] = useState('');
  const [selectedSemestrePrevision, setSelectedSemestrePrevision] = useState(0);
  const [selectedAnnioPrevision, setSelectedAnnioPrevision] = useState(0);

  const [selectedCajeroInsumo, setSelectedCajeroInsumo] = useState('');
  const [selectedTrimestreInsumo, setSelectedTrimestreInsumo] = useState(0);
  const [selectedAnnioInsumo, setSelectedAnnioInsumo] = useState(0);

  const [selectedMedicoAtencion, setSelectedMedicoAtencion] = useState('');
  const [selectedMesAtencionMedico, setSelectedMesAtencionMedico] = useState('');
  const [selectedSemestreAtencionMedico, setSelectedSemestreAtencionMedico] = useState(0);
  const [selectedAnnioAtencionMedico, setSelectedAnnioAtencionMedico] = useState(0);
  const [selectedTrimestreAtencionMedico, setSelectedTrimestreAtencionMedico] = useState(0);


  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setExcelFile(selectedFile);
      }
      else {
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else {
      console.log('Please select your file');
    }
  }

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const formData = new FormData();
      formData.append('file', excelFile);
      fetch(`${API_SERVER}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          Swal.fire({
            title: data.message,
            icon: data.status,
            confirmButtonText: 'OK'
          })
        })
    };
  }

  // Filtra los datos según los filtros seleccionados
  const paymentsDataDocFiltered = paymentsDataDoc.filter(item => {
    return (
      (!selectedMedico || item.medico === selectedMedico) &&
      (!selectedMes || item.nombre_mes === selectedMes) &&
      (!selectedAnnio || item.anio === parseInt(selectedAnnio))
    );
  });

  const transactionsCajFiltered = transactionsCaj.filter(item => {
    return (
      (selectedCajeros.length === 0 || selectedCajeros.includes(item.usuario)) &&
      (!selectedTrimestreCajero || item.trimestre === parseInt(selectedTrimestreCajero)) &&
      (!selectedAnnioCajero || item.anio === parseInt(selectedAnnioCajero))
    );
  }
  );

  const transactionsParticularesMedicosFiltered = transactionsParticularesMedicos.filter(item => {
    return (
      (selectedMedicos.length === 0 || selectedMedicos.includes(item.medico)) &&
      (!selectedMesMedicoParticular || item.nombre_mes === selectedMesMedicoParticular) &&
      (!selectedAnnioMedicoParticular || item.anio === parseInt(selectedAnnioMedicoParticular))
    );
  }
  );

  const atentionDataFiltered = atentionData.filter(item => {
    return (
      (!selectedSemestreAtencion || item.semestre === parseInt(selectedSemestreAtencion)) &&
      (!selectedAnnioAtencion || item.anio === parseInt(selectedAnnioAtencion))
    );
  }
  );

  const ventasInsumosFiltered = ventasInsumos.filter(item => {
    return (
      (!selectedCajeroInsumo || item.usuario === selectedCajeroInsumo) &&
      (!selectedTrimestreInsumo || item.trimestre === parseInt(selectedTrimestreInsumo)) &&
      (!selectedAnnioInsumo || item.anio === parseInt(selectedAnnioInsumo))
    );
  }
  );

  const atentionsByMedicFiltered = atentionsByMedic.filter(item => {
    return (
      (!selectedSemestreAtencionMedico || item.semestre === parseInt(selectedSemestreAtencionMedico)) &&
      (!selectedTrimestreAtencionMedico || item.trimestre === parseInt(selectedTrimestreAtencionMedico)) &&
      (!selectedAnnioAtencionMedico || item.anio === parseInt(selectedAnnioAtencionMedico))
    );
  }
  );

  const transactionsFonasa = transactionsParticularesFonasa.filter(item => item.prevision === 'Fonasa');
  const transactionsParticular = transactionsParticularesFonasa.filter(item => item.prevision === 'Particular');


  const transactionsFonasaFiltered = transactionsFonasa.filter(item => {
    return (
      (!selectedMesPrevision || item.nombre_mes === selectedMesPrevision) &&
      (!selectedSemestrePrevision || item.semestre === parseInt(selectedSemestrePrevision)) &&
      (!selectedAnnioPrevision || item.anio === parseInt(selectedAnnioPrevision))
    );
  }
  );

  const transactionsParticularFiltered = transactionsParticular.filter(item => {
    return (
      (!selectedMesPrevision || item.nombre_mes === selectedMesPrevision) &&
      (!selectedSemestrePrevision || item.semestre === parseInt(selectedSemestrePrevision)) &&
      (!selectedAnnioPrevision || item.anio === parseInt(selectedAnnioPrevision))
    );
  }
  );

  const get_doctors = () => {
    fetch(`${API_SERVER}/get_doctors`)
      .then((res) => res.json())
      .then((data) => {
        setDoctorData(data);
      })
      .catch((err) => console.error(err));
  }

  const get_cajeros = () => {
    fetch(`${API_SERVER}/get_cajeros`)
      .then((res) => res.json())
      .then((data) => {
        setCajeroData(data);
      })
      .catch((err) => console.error(err));
  }

  const get_payments_doc = () => {
    fetch(`${API_SERVER}/get_payments_doc`)
      .then((res) => res.json())
      .then((data) => {
        setPaymentsDoc(data);
      })
      .catch((err) => console.error(err));
  }

  const get_transactions_caj = () => {
    fetch(`${API_SERVER}/get_transactions_caj`)
      .then((res) => res.json())
      .then((data) => {
        setTransactionsCaj(data);
      })
      .catch((err) => console.error(err));
  }

  const get_transactions_particulares_medicos = () => {
    fetch(`${API_SERVER}/get_transactions_particulares_doc`)
      .then((res) => res.json())
      .then((data) => {
        setTransactionsParticularesMedicos(data);
      })
      .catch((err) => console.error(err));
  }

  const get_atentions = () => {
    fetch(`${API_SERVER}/get_atentions`)
      .then((res) => res.json())
      .then((data) => {
        setAtentionData(data);
      })
      .catch((err) => console.error(err));
  }

  const get_transactions_particulares_fonasa = () => {
    fetch(`${API_SERVER}/get_transactions_particulares_fonasa`)
      .then((res) => res.json())
      .then((data) => {
        setTransactionsParticularesFonasa(data);
      })
      .catch((err) => console.error(err));
  }

  const get_ventas_insumos_cajeros = () => {
    fetch(`${API_SERVER}/get_venta_insumos_cajeros`)
      .then((res) => res.json())
      .then((data) => {
        setVentasInsumos(data);
      })
      .catch((err) => console.error(err));
  }

  const get_atentions_by_medic = () => {
    fetch(`${API_SERVER}/get_atentions_by_doc`)
      .then((res) => res.json())
      .then((data) => {
        setAtentionsByMedic(data);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    get_doctors();
    get_cajeros();
    get_payments_doc();
    get_transactions_caj();
    get_transactions_particulares_medicos();
    get_atentions();
    get_transactions_particulares_fonasa();
    get_ventas_insumos_cajeros();
    get_atentions_by_medic();
  }
    , []);

  return (
    <div className="app">
      <Navbar bg="primary" data-bs-theme="dark">
        <div className="container-fluid">
          <Navbar.Brand href="#">Clínica de salud</Navbar.Brand>
        </div>
      </Navbar>
      <div className="container">
        <h1>Visualización de datos</h1>
        <hr />
        {/* subir archivo excel */}
        <h3>Subir archivo</h3>
        <form onSubmit={handleFileSubmit}>
          <Form.Label>Suba el archivo con los datos</Form.Label>
          <Stack direction="horizontal" gap={3}>  
            <Form.Control type="file" required onChange={handleFile} />
            <Button type="submit" variant="primary">SUBIR</Button>
            {typeError && (
              <div className="alert alert-danger" role="alert">{typeError}</div>
            )}
          </Stack>
        </form>
        <hr />
        {/* mostrar graficos */}
        <div>
          <h3>Montos recaudados de algún médico</h3>
          <div className="center">
            <form className="form-group">
              <Container>
                <Stack direction="horizontal" gap={3} center>
                  <FloatingLabel controlId="floatingSelect" label="Medicos">
                    <Form.Select value={selectedMedico} onChange={(e) => setSelectedMedico(e.target.value)}>
                      <option value="">Seleccione un médico</option>
                      {doctorData && doctorData.map((doctor) => (
                        <option key={doctor.rut_medico} value={doctor.rut_medico}>{doctor.nombre_medico}</option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Meses">
                    <Form.Select value={selectedMes} onChange={(e) => setSelectedMes(e.target.value)}>
                      <option value="">Seleccione un mes</option>
                      <option value="enero">Enero</option>
                      <option value="febrero">Febrero</option>
                      <option value="marzo">Marzo</option>
                      <option value="abril">Abril</option>
                      <option value="mayo">Mayo</option>
                      <option value="junio">Junio</option>
                      <option value="julio">Julio</option>
                      <option value="agosto">Agosto</option>
                      <option value="septiembre">Septiembre</option>
                      <option value="octubre">Octubre</option>
                      <option value="noviembre">Noviembre</option>
                      <option value="diciembre">Diciembre</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Años">
                    <Form.Select select value={selectedAnnio} onChange={(e) => setSelectedAnnio(e.target.value)}>
                      <option value="">Seleccione un año</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </FloatingLabel>
                </Stack>
              </Container>
            </form>
            <div className="graph1">
              {paymentsDataDoc && (<Plot
                data={[
                  {
                    y: paymentsDataDocFiltered.map(item => item.nombre_medico),
                    x: paymentsDataDocFiltered.map(item => item.monto),
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                    orientation: 'h'
                  },
                ]}
                layout={{
                  width: 720, height: 720, title: 'Montos recaudados por médico', margin: {
                    l: 150,
                  },
}}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de transacciones por cajero</h3>
          <div className="center">

            <form>
              <Container>
                <Stack direction="horizontal" gap={2} >
                  <FloatingLabel controlId="floatingSelect" label="Trimestre">
                    <Form.Select select value={selectedTrimestreCajero} onChange={(e) => setSelectedTrimestreCajero(e.target.value)}>
                      <option value="">Seleccione un año</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Año">
                    <Form.Select select value={selectedAnnioCajero} onChange={(e) => setSelectedAnnioCajero(e.target.value)}>
                      <option value="">Seleccione un año</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </FloatingLabel>
                </Stack>
                <label>Seleccione hasta 4 cajeros:</label>
                {cajeroData && (
                  <Select
                    isMulti
                    name="cajeros"
                    options={cajeroData.map((cajero) => ({ value: cajero.rut_cajero, label: cajero.nombre_cajero })
                    )}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(e) => {
                      if (e.length > 4) {
                        Swal.fire({ 
                          title: 'Solo puede seleccionar hasta 4 cajeros',
                          icon: 'warning',
                          confirmButtonText: 'OK'
                        })
                        e.pop();
                      }
                      else {
                        setSelectedCajeros(e.map(item => item.value))
                      }

                    }}
                  />
                )}
              </Container>
            </form>
            <div className="graph2">
              {transactionsCaj && (<Plot
                data={[
                  {
                    y: transactionsCajFiltered.map(item => item.nombre_cajero),
                    x: transactionsCajFiltered.map(item => item.conteo),
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                    orientation: 'h'
                  },
                ]}
                layout={{ width: 720, height: 720, title: 'Cantidad de transacciones por cajero' }}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de pagos particulares y montos totales por médicos</h3>
          <div className="center">
            <form>
              <Container>
                <Stack direction="horizontal" gap={2} >
                  <FloatingLabel controlId="floatingSelect" label="Mes">
                    <Form.Select select value={selectedMesMedicoParticular} onChange={(e) => setSelectedMesMedicoParticular(e.target.value)}>
                      <option value="">Seleccione un mes</option>
                      <option value="enero">Enero</option>
                      <option value="febrero">Febrero</option>
                      <option value="marzo">Marzo</option>
                      <option value="abril">Abril</option>
                      <option value="mayo">Mayo</option>
                      <option value="junio">Junio</option>
                      <option value="julio">Julio</option>
                      <option value="agosto">Agosto</option>
                      <option value="septiembre">Septiembre</option>
                      <option value="octubre">Octubre</option>
                      <option value="noviembre">Noviembre</option>
                      <option value="diciembre">Diciembre</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Año">
                    <Form.Select select value={selectedAnnioMedicoParticular} onChange={(e) => setSelectedMedicoParticular(e.target.value)}>
                      <option value="">Seleccione un año</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </FloatingLabel>
                </Stack>
                <label>Seleccione hasta 4 médicos:</label>
                {doctorData && (
                  <Select
                    isMulti
                    name="medicos"
                    options={doctorData.map((medico) => ({ value: medico.rut_medico, label: medico.nombre_medico })
                    )}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(e) => {
                      if (e.length > 4) {
                        Swal.fire({ 
                          title: 'Solo puede seleccionar hasta 4 médicos',
                          icon: 'warning',
                          confirmButtonText: 'OK'
                        })
                        e.pop();
                      }
                      else {
                        setSelectedMedicos(e.map(item => item.value))
                      }

                    }}
                  />

                )}
              </Container>
            </form>
            <div className="graph3">
              {transactionsParticularesMedicos && (<Plot
                data={[
                  {
                    y: transactionsParticularesMedicosFiltered.map(item => item.nombre_medico),
                    x: transactionsParticularesMedicosFiltered.map(item => item.monto_sum),
                    type: 'bar',
                    name: "Monto",
                    orientation: 'h'


                  }
                ]}
                layout={{ width: 720, height: 720, title: 'Cantidad de pagos particulares por médicos',
                margin: {
                  l: 150, // Ajusta este valor según sea necesario
                }, }}
              />)}
              {transactionsParticularesMedicos && (<Plot
                data={[
                  {
                    y: transactionsParticularesMedicosFiltered.map(item => item.nombre_medico),
                    x: transactionsParticularesMedicosFiltered.map(item => item.conteo),
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                    orientation: 'h',
                  },
                ]}
                layout={{ width: 720, height: 720, title: 'Montos particulares totales por médicos',
                margin: {
                  l: 150, // Ajusta este valor según sea necesario
                }, }}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de atenciones por mes, semestre y año</h3>
          <div className="center">
            <form>
              <Container>
                <Stack direction="horizontal" gap={3} >
                 
                  <FloatingLabel controlId="floatingSelect" label="Semestre">
                    <Form.Select select value={selectedSemestreAtencion} onChange={(e) => setSelectedSemestreAtencion(e.target.value)}>
                      <option value="">Seleccione un semestre</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Año">
                    <Form.Select
                      value={selectedAnnioAtencion}
                      onChange={(e) => setSelectedAnnioAtencion(e.target.value)}
                    >
                      <option value="2021" select>2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </FloatingLabel>
                </Stack>
              </Container>
            </form>
            <div className="graph4">
              {atentionData && (<Plot
                data={[
                  {
                    x: atentionDataFiltered.map(item => item.nombre_mes),
                    y: atentionDataFiltered.map(item => item.conteo),
                    type: 'scatter', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                  },
                ]}
                layout={{ width: 720, height: 440, title: 'Cantidad de Atenciones' }}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de atenciones por previsión</h3>
          <div className="center">
            <form>
              <Container>
                <Stack direction="horizontal" gap={3} >
                  <FloatingLabel controlId="floatingSelect" label="Meses">
                    <Form.Select select value={selectedMesPrevision} onChange={(e) => setSelectedMesPrevision(e.target.value)}>
                      <option value="">Seleccione un mes</option>
                      <option value="enero">Enero</option>
                      <option value="febrero">Febrero</option>
                      <option value="marzo">Marzo</option>
                      <option value="abril">Abril</option>
                      <option value="mayo">Mayo</option>
                      <option value="junio">Junio</option>
                      <option value="julio">Julio</option>
                      <option value="agosto">Agosto</option>
                      <option value="septiembre">Septiembre</option>
                      <option value="octubre">Octubre</option>
                      <option value="noviembre">Noviembre</option>
                      <option value="diciembre">Diciembre</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Semestre">
                    <Form.Select select value={selectedSemestrePrevision} onChange={(e) => setSelectedSemestrePrevision(e.target.value)}>
                      <option value="">Seleccione un semestre</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Año">
                    <Form.Select select value={selectedAnnioPrevision} onChange={(e) => setSelectedAnnioPrevision(e.target.value)}>
                      <option value="">Seleccione un año</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                    </Form.Select>
                  </FloatingLabel>
                </Stack>
              </Container>
            </form>
            <div className="graph5">
              {transactionsParticularesFonasa && (<Plot
                data={[
                  {
                    x: transactionsFonasaFiltered.map(item => item.nombre_mes),
                    y: transactionsFonasaFiltered.map(item => item.conteo),
                    name: 'Fonasa',
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                  },
                  {
                    x: transactionsParticularFiltered.map(item => item.nombre_mes),
                    y: transactionsParticularFiltered.map(item => item.conteo),
                    name: 'Particular',
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                  },
                ]}
                layout={{ width: 720, height: 440, title: 'Cantidad de Atenciones por previsión', barmode: 'group' }}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de atenciones por cajero</h3>
          <div className="center">
            <form>
              <Container>
             <Stack direction="horizontal" gap={3} >
              <FloatingLabel controlId="floatingSelect" label="Cajeros">
              <Form.Select select value={selectedCajeroInsumo} onChange={(e) => setSelectedCajeroInsumo(e.target.value)}>
                <option value="">Seleccione un cajero</option>
                {cajeroData && cajeroData.map((cajero) => (
                  <option key={cajero.rut_cajero} value={cajero.rut_cajero}>{cajero.nombre_cajero}</option>
                ))}
              </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Trimestre">
              <Form.Select select value={selectedTrimestreInsumo} onChange={(e) => setSelectedTrimestreInsumo(e.target.value)}>
                <option value="">Seleccione un año</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Año">
              <Form.Select select value={selectedAnnioInsumo} onChange={(e) => setSelectedAnnioInsumo(e.target.value)}>
                <option value="">Seleccione un año</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </Form.Select>
              </FloatingLabel>
              </Stack>
              </Container>
            </form>
            <div className="graph6">
              {ventasInsumos && (<Plot
                data={[
                  {
                    x: ventasInsumosFiltered.map(item => item.nombre_cajero),
                    y: ventasInsumosFiltered.map(item => item.conteo),
                    type: 'bar', // Puedes cambiar a 'scatter' u otro tipo según tus necesidades
                  },
                ]}
                layout={{ width: 720, height: 440, title: 'Cantidad de Atenciones por cajero' }}
              />)}
            </div>
          </div>
          <hr />
          <h3>Cantidad de atenciones por médico</h3>
          <div className="center">
            <form>
              <Container>
              <Stack direction="horizontal" gap={3} >
              <FloatingLabel controlId="floatingSelect" label="Semestre">
              <Form.Select select value={selectedSemestreAtencionMedico} onChange={(e) => setSelectedSemestreAtencionMedico(e.target.value)}>
                <option value="">Seleccione un semestre</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Trimestre">
              <Form.Select select value={selectedTrimestreAtencionMedico} onChange={(e) => setSelectedTrimestreAtencionMedico(e.target.value)}>
                <option value="">Seleccione un trimestre</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option> 
              </Form.Select>
              </FloatingLabel>
              <FloatingLabel controlId="floatingSelect" label="Año">
              <Form.Select select value={selectedAnnioAtencionMedico} onChange={(e) => setSelectedAnnioAtencionMedico(e.target.value)}>
                <option value="">Seleccione un año</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </Form.Select>
              </FloatingLabel>
              </Stack>
              </Container>
            </form>
            <div className="graph7">
              {atentionsByMedic && (<Plot
                data={[
                  {
                    y: atentionsByMedicFiltered.map(item => item.nombre_medico),
                    z: atentionsByMedicFiltered.map(item => item.conteo),
                    x: atentionsByMedicFiltered.map(item => item.nombre_mes),
                    type: 'heatmap',
                    
                  },
                ]}
                layout={{
                  width: 720, height: 600, title: 'Cantidad de Atenciones por médico', margin: {
                    l: 150, // Ajusta este valor según sea necesario
                  }, }}
              />)}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
