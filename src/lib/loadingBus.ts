type Listener = (count: number) => void

class LoadingBus {
  private count = 0
  private listeners: Set<Listener> = new Set()

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    listener(this.count)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    for (const l of this.listeners) l(this.count)
  }

  increment() {
    this.count += 1
    this.emit()
  }

  decrement() {
    this.count = Math.max(0, this.count - 1)
    this.emit()
  }
}

export const loadingBus = new LoadingBus()


