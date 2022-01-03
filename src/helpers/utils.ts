export function nonNullValues(obj: Object) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null))
}