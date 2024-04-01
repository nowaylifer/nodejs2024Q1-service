import {
  ConfigurableModuleBuilder,
  ConsoleLoggerOptions,
} from '@nestjs/common';

type WithLogFile = {
  saveToFile: true;
  maxFileSize: number; // in KiB;
  logDir: string;
};

type WithoutLogFile = {
  saveToFile?: false | undefined;
  maxFileSize?: number | undefined;
  logDir?: string | undefined;
};

type CustomLoggerOptions = WithLogFile | WithoutLogFile;

export type LoggerConfig = ConsoleLoggerOptions & CustomLoggerOptions;

export const {
  ConfigurableModuleClass: ConfigurableLoggerModuleClass,
  MODULE_OPTIONS_TOKEN: MODULE_CONFIG_TOKEN,
} = new ConfigurableModuleBuilder<LoggerConfig>()
  .setClassMethodName('forRoot')
  .build();
