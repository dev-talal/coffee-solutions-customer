type CSSModuleClasses = { readonly [key: string]: string };

declare module "*.module.css" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.scss" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.sass" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.less" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.style" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.stylus" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.pcss" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.module.sss" {
  const classes: CSSModuleClasses;
  export default classes;
}

// CSS
declare module "*.css" {}
declare module "*.scss" {}
declare module "*.sass" {}
declare module "*.less" {}
declare module "*.style" {}
declare module "*.stylus" {}
declare module "*.pcss" {}
declare module "*.sss" {}

// images
declare module "*.apng" {
  const src: string;
  export default src;
}
declare module "*.bmp" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.jfif" {
  const src: string;
  export default src;
}
declare module "*.pjpeg" {
  const src: string;
  export default src;
}
declare module "*.pjp" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.ico" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.avif" {
  const src: string;
  export default src;
}
declare module "*.cur" {
  const src: string;
  export default src;
}
declare module "*.jxl" {
  const src: string;
  export default src;
}

// media
declare module "*.mp4" {
  const src: string;
  export default src;
}
declare module "*.webm" {
  const src: string;
  export default src;
}
declare module "*.ogg" {
  const src: string;
  export default src;
}
declare module "*.mp3" {
  const src: string;
  export default src;
}
declare module "*.wav" {
  const src: string;
  export default src;
}
declare module "*.flac" {
  const src: string;
  export default src;
}
declare module "*.aac" {
  const src: string;
  export default src;
}
declare module "*.opus" {
  const src: string;
  export default src;
}
declare module "*.mov" {
  const src: string;
  export default src;
}
declare module "*.m4a" {
  const src: string;
  export default src;
}
declare module "*.vtt" {
  const src: string;
  export default src;
}
