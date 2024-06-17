// globals.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      __basedir: string;
    }
  }
}

export {};
