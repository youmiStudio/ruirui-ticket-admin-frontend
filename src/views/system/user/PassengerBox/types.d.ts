export type Action = 'confirm' | 'close' | 'cancel';

export interface BoxOptions {
  id?: number;
  userId: number;
}

export type BoxShortcutMethod = (
  options?: BoxOptions,
  appContext?: AppContext
) => Promise<any>;

export interface IBox {
  _context: AppContext | nul;

  /** Show a box */
  (options?: BoxOptions, appContext?: AppContext): Promise<any>;

  show: BoxShortcutMethod;

  close(): void;
}
