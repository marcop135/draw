// Single icon source for the app UI: Phosphor weights are picked per-call.
// "fill" for solid file/glyph marks (Export menu, GitHub logo) and "bold"
// for outline-style symbols (Insert menu, chevrons). Both stay legible on
// touch screens at 18-26px without going thin. Tree-shaken: each named
// export pulls in only that one SVG.
export {
  CaretDown,
  GithubLogo,
  FileImage,
  FilePdf,
  FileSvg,
  PencilSimpleLine,
  Function as FunctionIcon,
  Graph as GraphIcon,
  MarkdownLogo,
} from "@phosphor-icons/react";
