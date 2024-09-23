// global.d.ts
export {};

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}
