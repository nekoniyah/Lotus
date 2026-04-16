import ModuleBuilder from "../../utils/module/ModuleBuilder";
import { Database } from "bun:sqlite";

export default class LevelingModule extends ModuleBuilder {
  constructor(db: Database) {
    super("leveling", { db });
  }
}
