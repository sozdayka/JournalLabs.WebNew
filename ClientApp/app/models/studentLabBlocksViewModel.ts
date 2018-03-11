import { Student } from "./Student"
import { LabBlock } from "./LabBlock"
import { Remark } from "./Remark"

export class StudentLabBlocksViewModel {
  StudentInfo: Student = new Student();
  StudentLabBlocks: LabBlock[] = [];
  RemarkText: Remark = new Remark();
  TotalMark: number = 0;
}
