import { PROJECT_SOURCE_URL } from "../siteMeta";
import { GithubLogo } from "./icons";

type Props = { dark: boolean };

/** GitHub link to the public source repo (icon only). Sits in the app toolbar. */
export function GitHubCornerLink({ dark }: Props) {
  return (
    <a
      href={PROJECT_SOURCE_URL}
      className={`app-github-corner${dark ? " dark" : ""}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Source code on GitHub"
      title="Source on GitHub"
    >
      <GithubLogo size={22} weight="regular" aria-hidden />
    </a>
  );
}
