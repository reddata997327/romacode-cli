import type { RomaCodeEvent } from "@romacode/client"
import type { SelectedEvent, SubscribeOptions } from "@romacode/client/promise/api"

type EventType = Exclude<RomaCodeEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<RomaCodeEvent, Type>>
}
