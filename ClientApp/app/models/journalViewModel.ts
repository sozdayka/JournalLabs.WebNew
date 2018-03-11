import { Journal } from "./Journal"
import { KindOfWork } from "./kind-of-work"
import { StudentLabBlocksViewModel } from "./studentLabBlocksViewModel"

export class JournalViewModel {
  JournalModel: Journal = new Journal();
  KindsOfWorkForJournal: KindOfWork[] = [];
  StudentResultForJournal: StudentLabBlocksViewModel[] = [];
}
