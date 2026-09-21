import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import { FormValues, schema, transformData, SublineasEnPayload, transformarSublineas } from "../interfaces/interfaces-validaciones-linea";
import LineaService from "../services/linea-service";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";

import { Layers, PlusCircle } from "lucide-react";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import CantidadesInput from "../../../herramientas/formateo-de-campos/cantidades-input";
import { getUsuarioId } from "../../../../utils/auth";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import SelectSuperlinea from "../componentes/select-superlinea";
import SuperlineasSelector from "../../producto/componentes/configuracion/superlineas-selector";
import { SelectSuperlineaInterface } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import ProductoService from "../../producto/services/producto-service";
import { useEnterFocus } from "../../../herramientas/formateo-de-campos/movimiento-campos";
import SuperLineaService from "../../producto/services/superlinea-service";
import RegistrarActualizarSuperLineaForm from "./registrar-actualizar-superlinea";

export default function RegistrarActualizarLineaForm({
  linea,
  onClose,
  onSuccess,
}: {
  linea?: Linea;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const [rStockCritico, setStockCritico] = useState(false);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(rStockCritico)) as any,
    defaultValues: linea ? transformData(linea) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

  const [denominacionSuperlinea, setDenominacionSuperlinea] = useState(" ");
  const [selectedSuperlinea, setSelectedSuperlinea] = React.useState<SelectSuperlineaInterface>();
  const [superlineaSeleccionada, setSuperlineaSeleccionada] = useState<Linea>({} as Linea);

  const [mostrarFormularioSuperlinea, setMostrarFormularioSuperlinea] = useState(false);
  const [superlineas, setSuperlineas] = React.useState<SelectSuperlineaInterface[]>([]);
  const selectSuperlineaRef = useRef<HTMLDivElement>(null);
  const denominacionSuperlineaRef = useRef<HTMLInputElement>(null);

  const enterToDenominacionSuperlinea = useEnterFocus(denominacionSuperlineaRef);
 
  const stockMinimo = watch("stockMinimo");
  const utilizaStockMinimo = watch("utilizaStockMinimo");

  useEffect(() => {
    if (!utilizaStockMinimo) {
      setValue("stockMinimo", 0);
    }
  }, [utilizaStockMinimo, setValue]);

  useEffect(() => {
    setStockCritico(utilizaStockMinimo || false);
  }, [utilizaStockMinimo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (linea) {
          setValue("denominacion", linea.denominacion || "");
          setValue("observacion", linea.observacion || null);
         
          setValue("superLineaId", linea.superlinea?.id || 0);
          setSelectedSuperlinea(linea.superlinea);
          
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, [linea, setValue]);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {
     

      if (linea) {
        const payload = { ...formData, usuarioUpdatedId: usuarioId };
        response = await LineaService.actualizar(linea.id, payload);
      } else {
        const payload = { ...formData, usuarioCreatedId: usuarioId };
        response = await LineaService.nuevo(payload);
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      setError("root", { type: "manual", message: parseApiError(error) });
    }
  };

  const handleBuscarPorDenominacion = async (select: string) => {
      try {
        if (select === "SUPERLINEA") {
          const superlineas = await ProductoService.obtenerTotales({ denominacion: denominacionSuperlinea }, "superlineas");
          if (superlineas) {
            console.log("Superlineas encontradas:", superlineas);
            setSuperlineas(superlineas.data);
          } else {
            console.log("No se encontró una superlinea con la denominación ingresada.");
          }
        }

        
      } catch (error) {
        console.error("Error al buscar por código:", error);
      }
    };
  
    const handleEnterEnSelect = async (e: React.KeyboardEvent<HTMLInputElement>, select: string) => {
      if (e.key === "Enter") {
        e.preventDefault();
  
        if (select === "SUPERLINEA") {
          handleBuscarPorDenominacion("SUPERLINEA");
        }
        // Esperar un poco (opcional, si el botón hace una búsqueda antes)
        setTimeout(() => {
          let selectDiv: HTMLDivElement | null = null;
          if (select === "SUPERLINEA") {
            selectDiv = selectSuperlineaRef.current;
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

  

  
  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="relative w-full max-w-7xl bg-white mx-auto shadow-lg rounded-lg overflow-hidden mt-10 mb-12">
        <EncabezadoFormularios
          title={linea ? "Actualizar Línea" : "Registrar Línea"}
          subtitle={linea ? "Modifica los detalles de la línea." : "Ingresa los datos de la nueva línea."}
          icon={<Layers className="form-icon" />}
          onClose={handleOnClose}
        />

        <fieldset disabled={linea?.sistema === 1}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4">
                <div className="lg:col-span-2">
                  <FormInput name="denominacion" label="Denominación" placeholder="Ingresa la denominación" />
                </div>

                <div className="lg:col-span-2">
                  <FormInput name="observacion" label="Observación" placeholder="Ingresa una observación (opcional)" />
                </div>

 <div className="flex items-end gap-2 lg:col-span-1">
                  <label className="flex items-center pb-2">
                    <input
                      type="checkbox"
                      {...methods.register("utilizaStockMinimo")}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  <CantidadesInput
                    name="stockMinimo"
                    label="Stock Crítico"
                    value={stockMinimo || 0}
                    onChange={(value) => setValue("stockMinimo", Number(value))}
                    disabled={utilizaStockMinimo ? false : true}
                  />
                </div>
               

                <div className="lg:col-span-2 p-2">
                  <SuperlineasSelector
                    denominacionSuperlinea={denominacionSuperlinea}
                    setDenominacionSuperlinea={setDenominacionSuperlinea}
                    denominacionSuperlineaRef={denominacionSuperlineaRef}
                    selectSuperlineaRef={selectSuperlineaRef}
                    superlineas={superlineas}
                    selectedSuperlinea={selectedSuperlinea}
                    superlineaId={watch("superlineaId")}
                 
                    errors={errors}
                    onEnterSuperlinea={(e) => handleEnterEnSelect(e, "SUPERLINEA")}
                    onEnterDenominacion={enterToDenominacionSuperlinea}
                    onSuperlineaChange={(superlinea) => {
                      methods.setValue("superlineaId", superlinea?.id || 0);
                      setSuperlineaSeleccionada(superlinea as any);
                    }}
                    onAgregarSuperlinea={() => setMostrarFormularioSuperlinea(true)}
                  
                  
                  ></SuperlineasSelector>
                
                </div>

              </CardContent>
              {errors.root?.message && (
                <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
              )}

              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting ? (linea ? "Actualizando..." : "Registrando...") : linea ? "Actualizar" : "Registrar"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </fieldset>
      </Card>

     
      <AlertasConfirmacion />

      {mostrarFormularioSuperlinea && (
        <RegistrarActualizarSuperLineaForm
          onClose={() => setMostrarFormularioSuperlinea(false)}
          onSuccess={async (mensaje) => {
            setMostrarFormularioSuperlinea(false);

            // Volver a cargar las superlíneas
            await handleBuscarPorDenominacion("SUPERLINEA");

            onSuccess(mensaje);
          }}
        />
      )}
    </div>
  );
}
