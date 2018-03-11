import { LabBlock } from "./LabBlock"
import { Student } from "./Student";
export class CreateJournalViewModel {
  LessonName: string = "";
  GroupName: string = "";
  IsExam: boolean = true;
  LabBlocksSettings: LabBlock[] = [];
  TeacherIds: string[] = [];

  Students: Student[] = [];

}
