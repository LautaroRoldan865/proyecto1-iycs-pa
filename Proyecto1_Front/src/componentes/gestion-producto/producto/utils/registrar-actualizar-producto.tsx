import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import CantidadesInput from "../../../herramientas/formateo-de-campos/cantidades-input";
import { Producto, SelectPresentacion } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { SelectMarca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Linea, SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { AlicuotaIva, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import Select from "react-select";
import { useEnterFocus } from "../../../herramientas/formateo-de-campos/movimiento-campos";
import { useConfiguracionSistema } from "../../../sistema/ConfiguracionSistemaContext";
import { parseApiError } from "../../../../utils/errores";
import { Layers } from "lucide-react";
import RegistrarActualizarMarcaForm from "../../marca/utils/registrar-actualizar-marca";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { SelectSublinea } from "../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { ItemsProveedorEnPayload } from "../interfaces/interfaces-validaciones-item-proveedor";
import { FormValues, schema, transformData, transformarItemsProdAlternativo } from "../interfaces/interfaces-validaciones-producto";
import LineasSelector from "../componentes/configuracion/lineas-selector";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import MarcasSelector from "../componentes/configuracion/marcas-selector";
import { getUsuarioId } from "../../../../utils/auth";
import RegistrarActualizarLineaForm from "../../linea/utils/registrar-actualizar-linea";
import PorcentajeInput from "../../../herramientas/formateo-de-campos/porcentaje-input";
import PresentacionesSelector from "../componentes/configuracion/presentacion-selector";
import GenerarDenominacionButton from "../componentes/boton-generar-denom";


export default function RegistrarActualizarProductoForm({
  producto,
  onClose,
  onSuccess,
}: {
  producto?: Producto;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();

  const { configuracion } = useConfiguracionSistema();
  const [rStockCritico, setStockCritico] = useState(false);
  const [pack, setPack] = useState(false);
  const [usaOferta, setUsaOferta] = useState(false);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<Linea>({} as Linea);

  console.log("Configuración del sistema:", configuracion);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(rStockCritico, pack, usaOferta)),
    defaultValues: producto
      ? transformData(producto)
      : {
          alicuotaIva: AlicuotaIva.ALICUOTA_21,
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

  console.log("estos son los errores", errors);

  console.log("Producto que llega al formulario", producto);

  console.log("linea seleccionada", lineaSeleccionada);

  const [marcas, setMarcas] = React.useState<SelectMarca[]>([]);
  const [lineas, setLineas] = React.useState<SelectLinea[]>([]);
  const [presentaciones, setPresentaciones] = React.useState<SelectPresentacion[]>([]);

  //pone a la denominación como vacia
  const [denominacionPresentacion, setDenominacionPresentacion] = useState("");

  //cambia el estado
  const [selectedPresentacion, setSelectedPresentacion] =
    React.useState<SelectPresentacion | null>(null);
  
  const [denominacionMarca, setDenominacionMarca] = useState(" ");
  const [denominacionLinea, setDenominacionLinea] = useState(" ");
  const [selectedLinea, setSelectedLinea] = React.useState<SelectLinea>();
  const [selectedMarca, setSelectedMarca] = React.useState<SelectMarca>();
  const [mostrarFormularioLinea, setMostrarFormularioLinea] = useState(false);
  const [mostrarFormularioMarca, setMostrarFormularioMarca] = useState(false);
  const [itemProdAlternativoSinAgregar, setItemProdAlternativoSinAgregar] = useState(false);

  const stock = watch(`stock`);
  const stockMinimo = watch("stockMinimo");
  const cantidadPorPack = watch("cantidadPorPack");
  const utilizaStockMinimo = watch("utilizaStockMinimo");
  const utilizaPack = watch("utilizaPack");
  

  //=============================== CONSTANTES PARA MOVIMIENTO ENTRE CAMPOS ==================================
  const denominacionProductoRef = useRef<HTMLInputElement>(null);
  useEnterFocus(denominacionProductoRef);
  const observacionRef = useRef<HTMLInputElement>(null);
  const ubicacionRef = useRef<HTMLInputElement>(null);
  const selectTipoProductoRef = useRef<HTMLDivElement>(null);
  const codigoBarraRef = useRef<HTMLInputElement>(null);
  const selectAlicuotaIvaRef = useRef<HTMLDivElement>(null);
  const precioOfertaRef = useRef<HTMLInputElement>(null);
  const denominacionLineaRef = useRef<HTMLInputElement>(null);
  const selectLineaRef = useRef<HTMLDivElement>(null);
  const denominacionMarcaRef = useRef<HTMLInputElement>(null);
  const selectMarcaRef = useRef<HTMLDivElement>(null);

  const denominacionPresentacionRef = useRef<HTMLInputElement>(null);
  const selectPresentacionRef = useRef<HTMLDivElement>(null);

  const enterToObservacion = useEnterFocus(observacionRef);
  const enterToPrecioOferta = useEnterFocus(precioOfertaRef);
  const enterToDenominacionMarca = useEnterFocus(denominacionMarcaRef);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    if (!utilizaStockMinimo) {
      setValue("stockMinimo", 0);
    }
    if (!utilizaPack) {
      setValue("cantidadPorPack", 0);
    }
    
  }, [utilizaStockMinimo, utilizaPack, false, setValue]);

  useEffect(() => {
    setValue("stockMinimo", lineaSeleccionada.stockMinimo || 0);
    setValue("utilizaStockMinimo", lineaSeleccionada.utilizaStockMinimo || false);
  }, [lineaSeleccionada]);

  useEffect(() => {
    setPack(utilizaPack || false);
    setStockCritico(utilizaStockMinimo || false);
    setUsaOferta(false);
  }, [utilizaPack, utilizaStockMinimo, false]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (producto) {
          setValue("lineaId", producto.linea.id || 0);
          setSelectedLinea(producto.linea);

          setValue("marcaId", producto.marca.id || 0);
          setSelectedMarca(producto.marca);

          
          setValue("denominacion", producto.denominacion || "");
          setValue("observacion", producto.observacion || null);
          setValue("codigoProveedor", producto.codigoProveedor || "");
          setValue("codigoBarra", producto.codigoBarra || null);
          setValue("stock", producto.stock || 0);
          setValue("costo", producto.costo || 0);
          
          //setValue("oferta", producto.oferta || false);
          setValue("alicuotaIva", producto.alicuotaIva || 0);

          setValue("stockMinimo", producto.stockMinimo || 0);
          setValue("utilizaStockMinimo", producto.utilizaStockMinimo || false);
          setValue("cantidadPorPack", producto.cantidadPorPack || 0);
          setValue("utilizaPack", producto.utilizaPack || false);
        
          console.error("llega aca", producto);
        
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [producto]);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;

    try {
      // ⚠️ Validar si hay ítems sin agregar
      if (itemProdAlternativoSinAgregar) {
        const mensaje = [
          itemProdAlternativoSinAgregar ? "- Hay un producto alternativo sin agregar." : "",
          "",
          "¿Estás seguro de que querés registrar sin agregarlos?",
        ]
          .filter(Boolean)
          .join("\n");

        const confirmar = window.confirm(mensaje);

        if (!confirmar) return; // el usuario canceló
      }

      if (producto) {
        const payload = {
          ...formData,
          usuarioUpdatedId: usuarioId,
        };

        response = await ProductoService.actualizar(producto.id, payload);
      } else {
        const payload = {
          ...formData,
          usuarioCreatedId: usuarioId,
        };

        response = await ProductoService.nuevo(payload);
      }

      await onSuccess(response.mensaje);
      onClose();
    } catch (error) {
      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleBuscarPorDenominacion = async (select: string) => {
    try {
      if (select === "LINEA") {
        const lineas = await ProductoService.obtenerTotales({ denominacion: denominacionLinea }, "lineas");
        if (lineas) {
          console.log("Lineas encontradas:", lineas);
          setLineas(lineas.data);
        } else {
          console.log("No se encontró una linea con la denominación ingresada.");
        }
      }
      if (select === "MARCA") {
        const marcas = await ProductoService.obtenerTotales({ denominacion: denominacionMarca }, "marcas");
        if (marcas) {
          console.log("Marcas encontradas:", marcas);
          setMarcas(marcas.data);
        } else {
          console.log("No se encontró una marca con la denominación ingresada.");
        }
      }
      if (select === "PRESENTACION") {
        const presentaciones = await ProductoService.obtenerTotales(
          { denominacion: denominacionPresentacion }, "presentaciones"
        );

        if(presentaciones){
          console.log("Presentaciones encontradas: ", presentaciones);
          setPresentaciones(presentaciones.data);
        }else{
          console.log("No se encontraron presentaciones.")
        }
      }
      
    } catch (error) {
      console.error("Error al buscar por código:", error);
    }
  };

  const handleEnterEnSelect = async (e: React.KeyboardEvent<HTMLInputElement>, select: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (select === "LINEA") {
        handleBuscarPorDenominacion("LINEA");
      }

      if (select === "MARCA") {
        handleBuscarPorDenominacion("MARCA");
      }

      if(select === "PRESENTACION"){
        handleBuscarPorDenominacion("PRESENTACION");
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        let selectDiv: HTMLDivElement | null = null;

        if (select === "MARCA") {
          selectDiv = selectMarcaRef.current;
        }

        if (select === "LINEA") {
          selectDiv = selectLineaRef.current;
        }

        if(select==="PRESENTACION"){
          selectDiv = selectPresentacionRef.current;
        }

        if (select === "TIPO-PRODUCTO") {
          selectDiv = selectTipoProductoRef.current;
        }

        if (select === "ALICUOTA-IVA") {
          selectDiv = selectAlicuotaIvaRef.current;
        }

        if (selectDiv) {
          const input = selectDiv.querySelector("input");
          if (input) {
            input.focus();
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          }
        }
      }, 300); // Ajustá este delay según el tiempo de búsqueda, si es necesario
    }
  };

  const lineaId = watch("lineaId");
  const marcaId = watch("marcaId");
  const presentacionId = watch("presentacionId");

  const deshabilitarGenerar = 
    (producto && producto.sistema > 0) || 
    !lineaId || 
    !marcaId || 
    !presentacionId;



  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-7xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">
        <EncabezadoFormularios
          title={producto ? "Producto" : "Registrar Producto"}
          subtitle={
            producto
              ? "Sólo puede visualizarse, no modificarse."
            : "Ingresa los datos."
          }
          icon={<Layers className="form-icon" />}
          onClose={onClose}
        />  

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-6 py-4">
              {/* Primera fila */}
              <div className="flex flex-col w-full gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full">
                  <div className="col-span-full flex items-end gap-2">
                    <div className="flex-1">
                      <FormInput
                        name="denominacion"
                        label="Denominación"
                        placeholder="Ingresa la denominación"
                        disabled={producto && producto.sistema > 0 ? true : false}
                        onKeyDown={enterToObservacion}
                        inputRef={denominacionProductoRef}
                      />
                    </div>

                    

                    
                  </div>

               

                  {/* <FormInput
                    name="costo"
                    label="Costo"
                    placeholder="Ingresa el costo"
                  />

                  <FormInput
                    name="precio"
                    label="Precio"
                    placeholder="Ingresa el precio"
                  />

                  <FormInput
                    name="porcentaje"
                    label="Porcentaje"
                    placeholder="Ingresa el porcentaje"
                  /> */}

                  <PriceInput
                    name="costo"
                    label="Costo"
                    value={watch("costo") || 0}
                    onChange={(value) => setValue("costo", value, { shouldValidate: true })}
                    maxDigits={9}
                    disabled={producto && producto.sistema > 0 ? true : false}
                  />
                   <PorcentajeInput
                    name="porcentaje"
                    label="Margen"
                    value={watch("porcentaje") || 0}
                    onChange={(value) => setValue("porcentaje", value, { shouldValidate: true })}
                    disabled={producto && producto.sistema > 0 ? true : false}
                  />
                  <PriceInput
                    name="precio"
                    label="Precio"
                    value={watch("precio") || 0}
                    onChange={(value) => setValue("precio", value, { shouldValidate: true })}
                    maxDigits={9}
                    disabled={producto && producto.sistema > 0 ? true : false}
                  />
                 

                  


         

                  <div className="flex-1 min-w-[120px]">
                    {producto ? (
                      <CantidadesInput
                        name={`stock`}
                        label="Stock"
                        value={stock || 0}
                        onChange={(value) => setValue(`stock`, Number(value))}
                        disabled={true}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <div className="col-span-full flex flex-wrap gap-4 mt-8">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...methods.register("utilizaStockMinimo")}
                          className={` w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500`}
                          disabled={producto && producto.sistema > 0 ? true : false}
                        />
                      </label>
                    </div>

                    <CantidadesInput
                      name={`stockMinimo`}
                      label="Stock Crítico"
                      value={stockMinimo || 0}
                      onChange={(value) => setValue(`stockMinimo`, Number(value))}
                      disabled={utilizaStockMinimo ? false : true}
                    />
                  </div>

                  

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 min-w-[140px]">
                    

              
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-2">

              <LineasSelector
                denominacionLinea={denominacionLinea}
                setDenominacionLinea={setDenominacionLinea}
                denominacionLineaRef={denominacionLineaRef}
                selectLineaRef={selectLineaRef}
                lineas={lineas}
                selectedLinea={selectedLinea}
                lineaId={watch("lineaId")}
                disabled={producto && producto.sistema > 0}
                errors={errors}
                onEnterLinea={(e) => handleEnterEnSelect(e, "LINEA")}
                onEnterDenominacion={enterToDenominacionMarca}
                onLineaChange={(linea) => {
                  methods.setValue("lineaId", linea?.id || 0);
                  setLineaSeleccionada(linea as any);
                }}
                onAgregarLinea={() => setMostrarFormularioLinea(true)}
              />

              <MarcasSelector
                denominacionMarca={denominacionMarca}
                setDenominacionMarca={setDenominacionMarca}
                denominacionMarcaRef={denominacionMarcaRef}
                selectMarcaRef={selectMarcaRef}
                marcas={marcas}
                selectedMarca={selectedMarca}
                marcaId={watch("marcaId")}
                disabled={producto && producto.sistema > 0}
                error={errors.marcaId?.message}
                onEnterMarca={(e) => handleEnterEnSelect(e, "MARCA")}
                onChangeMarca={(marca) => {
                  methods.setValue("marcaId", marca?.id || 0);
                }}
                onAgregarMarca={() => setMostrarFormularioMarca(true)}
              />

              <PresentacionesSelector
                denominacionPresentacion={denominacionPresentacion}
                setDenominacionPresentacion={setDenominacionPresentacion}
                denominacionPresentacionRef={denominacionPresentacionRef}
                selectPresentacionRef={selectPresentacionRef}
                presentaciones={presentaciones}
                selectedPresentacion={selectedPresentacion}
                presentacionId={watch("presentacionId")}
                disabled={producto && producto.sistema > 0}
                error={errors.presentacionId?.message}
                onEnterPresentacion={(e) =>
                  handleEnterEnSelect(e, "PRESENTACION")
                }
                onChangePresentacion={(presentacion) => {
                  setSelectedPresentacion(presentacion);
                  methods.setValue(
                    "presentacionId",
                    presentacion?.id || 0
                  );
                }}
                onAgregarPresentacion={() => {
                  // acá después abrimos el formulario de registrar presentación
                }}
              />



              <GenerarDenominacionButton disabled={deshabilitarGenerar} />



              </div>

              {/* Segunda fila */}


              <hr className="col-span-full my-2 border-gray-300" />

              
              
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* Botón de submit */}
            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? producto
                    ? "Actualizando..."
                    : "Registrando..."
                  : producto
                  ? "Actualizar"
                  : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>

        {mostrarFormularioLinea && (
          <RegistrarActualizarLineaForm
            onClose={() => setMostrarFormularioLinea(false)}
            onSuccess={() => {
              setMostrarFormularioLinea(false);
              handleBuscarPorDenominacion("LINEA")
            }}
          />
        )}


        {mostrarFormularioMarca && (
          <RegistrarActualizarMarcaForm
            onClose={() => setMostrarFormularioMarca(false)}
            onSuccess={() => {
              setMostrarFormularioMarca(false);
              handleBuscarPorDenominacion("MARCA")
            }}
          />
        )}

       
      </Card>
    </div>
  );
}
