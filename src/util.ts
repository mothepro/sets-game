/** Turns an ugly callback function into an async one */
export function promisify(f: Function, thisContext: any = null) {
    return function () {
        const args = [...arguments]
        return new Promise((resolve, reject) => {
            args.push((err: any, result: any) => err !== null ? reject(err) : resolve(result))
            f.apply(thisContext, args)
        });
    }
}
