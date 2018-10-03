declare const Ipfs: any
import * as Room from 'ipfs-pubsub-room'
import {promisify} from './util'
// import 'sets-game-engine'

log('Loaded')
const ipfs = new Ipfs({
    repo: `ipfs/pubsub-demo/${Math.random()}`,
    EXPERIMENTAL: {
        pubsub: true
    },
    config: {
        Addresses: {
            Swarm: [
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
            ]
        }
    }
})

ipfs.once('ready', async () => {
    const info = await (promisify(ipfs.id)()) as any
    log('IPFS node ready with address ' + info.id)

    const room = Room(ipfs, 'ipfs-pubsub-demo')

    room.on('peer joined', (peer: string) => log('peer ' + peer + ' joined'))
    room.on('peer left', (peer: string) => log('peer ' + peer + ' left'))

    // send and receive messages

    room.on('peer joined', (peer: string) => room.sendTo(peer, 'Hello ' + peer + '!'))
    room.on('message', (message: any) => log('got message from ' + message.from + ': ' + message.data.toString()))

    // broadcast message every 2 seconds

    //setInterval(() => room.broadcast('hey everyone!'), 2000)
})

function log(str: string) {
    const li = document.createElement('li')
    li.innerHTML = str
    document.getElementById('messages')!.appendChild(li)
}