declare module "node:sqlite" {
  export interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    all(...params: (string | number | bigint | null | undefined | Uint8Array)[]): Record<string, unknown>[];
    get(...params: (string | number | bigint | null | undefined | Uint8Array)[]): Record<string, unknown> | undefined;
    run(...params: (string | number | bigint | null | undefined | Uint8Array)[]): RunResult;
  }

  export class DatabaseSync {
    constructor(location: string, options?: { open?: boolean });
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
  }
}
