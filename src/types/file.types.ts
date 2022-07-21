import { File } from "src/files/schemas/file.schema";


export interface createFileDto {
    name: string,
    type: string,
    parent?: File
}