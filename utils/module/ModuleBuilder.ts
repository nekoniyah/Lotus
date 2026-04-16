import type { Client, ClientEvents, InteractionType } from "discord.js";
import { TemplateEvent, type TemplateEventListener } from "../typers";
import { Database } from "bun:sqlite";

let modules: ModuleBuilder[] = [];

export class EventModule<
  Event extends keyof ClientEvents = keyof ClientEvents,
> {
  constructor(public name: string) {
    this.name = name;
  }

  private _filepath: string = "";

  set filepath(value: string) {
    this._filepath = value;
  }

  get filepath() {
    return this._filepath;
  }

  async getListener(): Promise<TemplateEventListener<Event>> {
    const { default: event } = await import(this.filepath);
    return event as TemplateEventListener<Event>;
  }
}
export class InteractionModule<
  Type extends InteractionType = InteractionType,
> {}

export class RegisterModule {}

export default class ModuleBuilder<
  Options extends { [key: string]: string | number | boolean } = {
    [key: string]: string | number | boolean;
  },
> {
  events: EventModule[] = [];
  interactions: InteractionModule[] = [];
  db: Database | null = null;

  constructor(
    public name: string,
    dependecies?: Partial<{ db: Database }>,
  ) {
    this.name = name;

    if (dependecies) {
      if (dependecies.db) this.db = dependecies.db;
    }
  }

  async populateEvents() {
    return this;
  }

  async load(client: Client, options: Options) {
    for (let event of this.events) {
      const listener = await event.getListener();

      client.on(event.name, (async (
        ...args: ClientEvents[keyof ClientEvents]
      ) => {
        await listener(...args, options);
      }) as TemplateEventListener<keyof ClientEvents>);
    }

    return this;
  }

  register() {
    modules.push(this);
  }
}
