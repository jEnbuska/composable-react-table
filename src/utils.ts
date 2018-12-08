export function joinIfPresent(separator: string) {
    return function join(a: string, b?: string){
        return b ? a + separator + b : a;
    }
}

export const addClass = joinIfPresent(' ');

export function noRecursion<T extends Function>(callback: T) {
    let active = false;
    return function(...params: any[]): void {
        if(active){
            return;
        }
        active = true;
        callback(...params);
        active =false;
    }
}
