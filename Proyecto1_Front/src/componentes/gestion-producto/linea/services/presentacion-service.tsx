import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../interfaces/interfaces-validaciones-linea";

const baseService = createCrudService<FormValues>("presentacion");

const PresentacionService = {
  ...baseService,
};

export default PresentacionService;
