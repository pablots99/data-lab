export interface IHash {
  [test: string] : string;
}
export class Registros {
  id: string;
  control_code: string;
  test_date: String;
  coments: string;
  operador: string;
  id_grupo: string;
  test: IHash;
}
