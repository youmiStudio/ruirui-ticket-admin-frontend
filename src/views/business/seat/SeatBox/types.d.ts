export type Action = 'confirm' | 'close' | 'cancel';

export interface SeatBoxOptions {
  id?: number;
}

export type SeatBoxShortcutMethod = (
  options?: SeatBoxOptions,
  appContext?: AppContext
) => Promise<any>;

export interface ISeatBox {
  _context: AppContext | nul;

  /** Show a box */
  (options?: SeatBoxOptions, appContext?: AppContext): Promise<any>;

  show: SeatBoxShortcutMethod;

  close(): void
}
