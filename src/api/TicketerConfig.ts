/**
 * States the current ticket configuration.
 */
export class TicketerConfig {
  /** The name of the ticketer plugin currently in use. */
  public readonly plugin: string;

  /** Defines if the ticketer integration is enabled. True if enabled, False otherwise. */
  public readonly enabled: boolean;

  constructor(plugin: string, enabled?: boolean) {
    this.plugin = plugin;
    this.enabled = enabled || false;
  }

  /**
   * Whether this ticketer object is the same as another.
   */
  public equals(that?: TicketerConfig) {
    return that &&
      this.plugin === that.plugin &&
      this.enabled === that.enabled;
  }

  /**
   * Create a new ticketer config object from this existing one.
   */
  public clone() {
    return new TicketerConfig(this.plugin, this.enabled);
  }

}
