import { KindOfMark } from "./enums/KindOfMark"
export class LabBlock {
   Id:string = "";
   Date:string = "";
   Mark:number =0;
   MarkTeacherId: string = "";
   KindOfMark: KindOfMark = KindOfMark.FirstMark;
   UserFIO:string = "";
   LessonName:string = "";
   JournalId: string = "";
   StudentId: string = ""; 
   KindOfWorkId: string = "";
   IsKindOfWorkVisible: boolean = true;
   IsCalculateMark: boolean = true;
   IsVisibleToStudent: boolean = true;
   IsBoolField: boolean = false;
   IsSecondBlock: boolean = true;
   MarkTeacherName: string = "";
   Color: string = "";
   oldMark: number = 0;
   Deadline: string = "";
}
