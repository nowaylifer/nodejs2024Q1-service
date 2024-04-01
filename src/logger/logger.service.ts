import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { LoggerConfig, MODULE_CONFIG_TOKEN } from './logger.module-definition';
import { logLevels } from 'src/constants';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly maxFileSize: number;
  private readonly saveToFile: boolean;
  private readonly logDir: string;

  private readonly logFilename: Record<LogLevel, string> = {
    log: 'common.log',
    warn: 'warn.log',
    error: 'error.log',
    fatal: 'fatal.log',
    verbose: 'verbose.log',
    debug: 'debug.log',
  };

  private logFileRotation: Record<LogLevel, number> = {
    log: 0,
    warn: 0,
    error: 0,
    fatal: 0,
    verbose: 0,
    debug: 0,
  };

  constructor(
    context: string,
    @Inject(MODULE_CONFIG_TOKEN) config: LoggerConfig,
  ) {
    super(context, config);

    this.saveToFile = config.saveToFile ?? false;
    this.maxFileSize = config.maxFileSize;
    this.logDir = config.logDir;

    if (this.saveToFile) {
      fs.ensureDirSync(this.logDir);

      for (const logLevel of logLevels) {
        const logLevelDir = path.join(this.logDir, logLevel);

        if (
          !fs.pathExistsSync(logLevelDir) ||
          !fs.statSync(logLevelDir).isDirectory()
        ) {
          continue;
        }

        const filenameRegExp = new RegExp(
          `^(\\d+)-${this.logFilename[logLevel]}$`,
        );

        const existingLogFiles = fs
          .readdirSync(logLevelDir)
          .filter((filename) => filename.match(filenameRegExp));

        const currentRotation = Number(
          existingLogFiles.at(-1)?.match(filenameRegExp)[1],
        );

        if (Number.isFinite(currentRotation)) {
          const stats = fs.statSync(
            path.join(logLevelDir, existingLogFiles.at(-1)),
          );

          const currentSizeKiB = stats.size / 1024;

          this.logFileRotation[logLevel] =
            currentSizeKiB >= this.maxFileSize
              ? currentRotation + 1
              : currentRotation;
        }
      }
    }
  }

  private getPrintString(
    message: unknown,
    context = '',
    logLevel: LogLevel = 'log',
  ): string {
    const pidMessage = this.formatPid(process.pid);
    const contextMessage = this.formatContext(context);
    const timestampDiff = this.updateAndGetTimestampDiff();
    const formattedLogLevel = logLevel.toUpperCase().padStart(7, ' ');
    const formattedMessage = this.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      contextMessage,
      timestampDiff,
    );

    return formattedMessage;
  }

  private async saveLogToFile(
    messages: unknown[],
    logLevel: LogLevel,
    context: string,
    stack?: string,
  ) {
    const logFilename = `${this.logFileRotation[logLevel]}-${this.logFilename[logLevel]}`;
    const logFilePath = path.join(this.logDir, logLevel, logFilename);

    await fs.ensureFile(logFilePath);

    for (const msg of messages) {
      const printString = this.getPrintString(msg, context, logLevel);
      await fs.appendFile(logFilePath, printString);
    }

    if (stack) {
      await fs.appendFile(logFilePath, stack);
    }

    const stats = await fs.stat(logFilePath);
    const currentSizeKiB = stats.size / 1024;

    if (currentSizeKiB >= this.maxFileSize) {
      ++this.logFileRotation[logLevel];
    }
  }

  error(message: any, stackOrContext?: string): void;
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]): void;
  error(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('error')) {
      return;
    }

    super.error(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context, stack } =
      this.getContextAndStackAndMessagesToSave([message, ...optionalParams]);

    this.saveLogToFile(messages, 'error', context, stack);
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void;
  log(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('log')) {
      return;
    }

    super.log(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context } = this.getContextAndMessagesToSave([
      message,
      ...optionalParams,
    ]);

    this.saveLogToFile(messages, 'log', context);
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void;
  warn(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('warn')) {
      return;
    }

    super.warn(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context } = this.getContextAndMessagesToSave([
      message,
      ...optionalParams,
    ]);

    this.saveLogToFile(messages, 'warn', context);
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void;
  debug(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('debug')) {
      return;
    }

    super.warn(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context } = this.getContextAndMessagesToSave([
      message,
      ...optionalParams,
    ]);

    this.saveLogToFile(messages, 'debug', context);
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void;
  verbose(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }

    super.warn(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context } = this.getContextAndMessagesToSave([
      message,
      ...optionalParams,
    ]);

    this.saveLogToFile(messages, 'verbose', context);
  }

  fatal(message: any, context?: string): void;
  fatal(message: any, ...optionalParams: [...any, string?]): void;
  fatal(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('fatal')) {
      return;
    }

    super.warn(message, ...optionalParams);

    if (!this.saveLogToFile) return;

    const { messages, context } = this.getContextAndMessagesToSave([
      message,
      ...optionalParams,
    ]);

    this.saveLogToFile(messages, 'fatal', context);
  }

  getContextAndMessagesToSave(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }

    const lastElement = args[args.length - 1];
    const isContext = typeof lastElement === 'string';

    if (!isContext) {
      return { messages: args, context: this.context };
    }

    return {
      context: lastElement,
      messages: args.slice(0, args.length - 1),
    };
  }

  private getContextAndStackAndMessagesToSave(args: unknown[]) {
    if (args.length === 2) {
      return this.isStackFormatted(args[1])
        ? {
            messages: [args[0]],
            stack: args[1] as string,
            context: this.context,
          }
        : {
            messages: [args[0]],
            context: args[1] as string,
          };
    }

    const { messages, context } = this.getContextAndMessagesToSave(args);

    if (messages?.length <= 1) {
      return { messages, context };
    }

    const lastElement = messages[messages.length - 1];
    const isStack = typeof lastElement === 'string';

    if (!isStack && typeof lastElement !== 'undefined') {
      return { messages, context };
    }

    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }

  private isStackFormatted(stack: unknown) {
    if (typeof stack !== 'string' && typeof stack !== 'undefined') {
      return false;
    }

    return /^(.)+\n\s+at .+:\d+:\d+/.test(stack);
  }
}
