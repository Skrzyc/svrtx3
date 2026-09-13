/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

const stylesDict = {
  dark: {
    log: "background: #1e1e1e; color: #61dafb; padding: 4px 10px; border-radius: 2px;",
    warn: "background: #1e1e1e; color: #ffa726; padding: 4px 10px; border-radius: 2px;",
    error:
      "background: #1e1e1e; color: #ef5350; padding: 4px 10px; border-radius: 2px;",
  },
  monochrome: {
    log: "background: #f5f5f5; color: #424242; border-left: 3px solid #42a5f5; padding: 4px 8px;",
    warn: "background: #f5f5f5; color: #424242; border-left: 3px solid #ffca28; padding: 4px 8px;",
    error:
      "background: #f5f5f5; color: #424242; border-left: 3px solid #ef5350; padding: 4px 8px;",
  },
};

/**
 * Custom Styled Logger with base funcs
 * - log - only in dev
 * - warn - always
 * - error - always
 */
class Logger {
  readonly styles = stylesDict.dark;

  disabled: boolean = false;

  log = (v: any) => {
    if (import.meta.env.DEV) this.output(v, this.styles.log, "log");
  };
  warn = (v: any) => this.output(v, this.styles.warn, "warn");
  error = (v: any) => this.output(v, this.styles.error, "error");

  output(value: any, style: string, label: string) {
    if (this.disabled) return;
    console.log(`%c[${label}] :: ${value}`, style);
  }
}

const logger = new Logger();

export default logger;
