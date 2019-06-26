/**
 * States the current ticket configuration.
 */
export class TicketerConfig {

    /** The name of the ticketer plugin currently in use. */
    public plugin?: string;

    /** Defines if the ticketer integration is enabled. True if enabled, False otherwise. */
    public enabled?: boolean;

  /**
   * Whether this ticketer object is the same as another.
   */
  public equals(that?: TicketerConfig) {
    return that &&
      this.plugin === that.plugin &&
      this.enabled === that.enabled;
  }

}
