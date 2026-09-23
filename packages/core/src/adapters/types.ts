import type { z } from "zod";

/** A single alert-worthy event produced by an adapter. */
export interface WatcherMatch {
  /**
   * Event-scoped idempotency key (e.g. "temperature:below:32:2026-07-22").
   * The engine prefixes the watch id to form the globally-unique dedupe key.
   */
  dedupeKey: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * What one evaluation produced. Kept as a single return so an adapter never
 * has to fetch twice: the reading a card displays comes out of the same
 * response that decided whether to alert, which matters on rate-limited
 * free tiers.
 */
export interface EvaluationResult {
  matches: WatcherMatch[];
  /**
   * Latest observed value for this watch, when the source has one. Weather
   * does; event-based sources like music and film have nothing to plot.
   */
  reading?: number;
}

export interface AdapterContext {
  now: Date;
  fetch: typeof fetch;
  /**
   * When this watch was created. Event-based adapters use it as a baseline so
   * turning on a watch doesn't alert about everything that already happened.
   */
  watchCreatedAt: Date;
}

/**
 * A pluggable data source. Each domain (weather, recalls, flights…) implements
 * one. The engine is otherwise source-agnostic — this interface is the seam
 * that lets the "everything app" grow by adding adapters, not rewrites.
 */
export interface SourceAdapter<Config> {
  source: string;
  configSchema: z.ZodType<Config>;
  /** Fetch current source data and report matches plus any current reading. */
  evaluate(config: Config, ctx: AdapterContext): Promise<EvaluationResult>;
}
