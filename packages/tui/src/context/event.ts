import type { RomaCodeEvent } from "@romacode/client"
import { useClient } from "./client"

type EventMetadata = {
  directory: string | undefined
}
type RomaCodeEventMap = { [Type in RomaCodeEvent["type"]]: Extract<RomaCodeEvent, { type: Type }> }

export function useEvent() {
  const client = useClient()

  function subscribe(handler: (event: RomaCodeEvent, metadata: EventMetadata) => void) {
    return client.event.listen(({ details }) => {
      if (details.type === "server.connected") return
      handler(details, { directory: details.location?.directory })
    })
  }

  function on<T extends RomaCodeEvent["type"]>(
    type: T,
    handler: (event: RomaCodeEventMap[T], metadata: EventMetadata) => void,
  ) {
    return client.event.on(type, (event) => {
      handler(event, { directory: event.location?.directory })
    })
  }

  return {
    subscribe,
    on,
  }
}
