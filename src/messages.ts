import {Packer} from 'p2p-lobby'
import {CardOption} from './Game'

/**
 * The list of selected cards.
 * Since the cards should be synced for all, this is a more compact
 * way to point out the indexes of the card array.
 */
export class Selection {
    constructor(public selection: CardOption) {}

    static pack = (inst: Selection) =>
        inst.selection.reduce((total, bit) => total << 1 | +bit, 0)

    static unpack = (selected: number) =>
        new Selection(selected.toString(2).split('').map(bit => bit == '1'))
}

Packer(Selection)
