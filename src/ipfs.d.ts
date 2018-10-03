// import StrictEventEmitter from 'strict-event-emitter-types'
// import {EventEmitter} from 'events'

// type StrictEventEmitter = import('strict-event-emitter-types')
// type EventEmitter = import('events')

type Constructor<T> = { new(...args: any[]): T }

export interface IPFSEvents {
    ready: void
}

export interface PeerInfo {
    id: string
}

declare class Ipfs {
    // extends (EventEmitter as Constructor<StrictEventEmitter<EventEmitter, IPFSEvents>>) {
    constructor(options: {})
    once: (name: 'ready', func: () => void) => void

    id: () => Promise<PeerInfo>
}

export default Ipfs

