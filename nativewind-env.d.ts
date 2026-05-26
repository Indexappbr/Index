/// <reference types="nativewind/types" />

// Declarações ambiente para imports de CSS usados pelo template (web + NativeWind).
declare module '*.css';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
